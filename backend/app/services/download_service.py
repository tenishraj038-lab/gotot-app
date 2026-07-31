import os
import time
import uuid
import logging
import asyncio
from typing import Optional, Dict, Any, List

from app.config import get_settings

logger = logging.getLogger("gotot.download_service")
settings = get_settings()

# In-memory job store with TTL
_active_jobs: Dict[str, Dict[str, Any]] = {}
_job_locks: Dict[str, asyncio.Lock] = {}

# Cache for metadata (key: url, value: {info, timestamp})
_metadata_cache: Dict[str, Dict[str, Any]] = {}
_CACHE_TTL = settings.cache_ttl


def get_job_lock(job_id: str) -> asyncio.Lock:
    if job_id not in _job_locks:
        _job_locks[job_id] = asyncio.Lock()
    return _job_locks[job_id]


def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    return _active_jobs.get(job_id)


def get_active_jobs() -> List[Dict[str, Any]]:
    return list(_active_jobs.values())


def cleanup_expired_jobs() -> None:
    """Remove jobs older than 1 hour."""
    now = time.time()
    expired = [jid for jid, job in _active_jobs.items() if now - job.get("created_at", 0) > 3600]
    for jid in expired:
        _active_jobs.pop(jid, None)
        _job_locks.pop(jid, None)


async def prepare_download(url: str, fmt: str = "best", quality: str = "1080") -> Dict[str, Any]:
    """Prepare a download job immediately and return job info."""
    job_id = str(uuid.uuid4())[:12]
    lock = get_job_lock(job_id)

    job = {
        "id": job_id,
        "url": url,
        "format": fmt,
        "quality": quality,
        "status": "preparing",
        "progress": 0,
        "created_at": time.time(),
        "attempts": [],
    }
    _active_jobs[job_id] = job

    async with lock:
        try:
            # Check cache first
            cache_key = url
            cached = _metadata_cache.get(cache_key)
            if cached and (time.time() - cached.get("timestamp", 0)) < _CACHE_TTL:
                video_info = cached["info"]
            else:
                # Import here to avoid circular deps
                from app.services.downloader import extract_video_info
                video_info = await extract_video_info(url)
                if video_info:
                    _metadata_cache[cache_key] = {"info": video_info, "timestamp": time.time()}
                else:
                    raise ValueError("Could not extract video info")

            job["video_info"] = video_info
            job["status"] = "ready"
            job["progress"] = 100

            # Get thumbnail immediately
            job["thumbnail_url"] = video_info.get("thumbnail") or ""

            # Get file size if available
            job["file_size"] = video_info.get("filesize") or video_info.get("filesize_approx")

            # Get available formats
            job["available_formats"] = video_info.get("formats", [])

            # Get download URL (first format)
            formats = video_info.get("formats", [])
            job["download_url"] = ""
            if formats:
                first = formats[0] if isinstance(formats[0], dict) else {}
                job["download_url"] = first.get("url", "")

            # Extract metadata
            job["metadata"] = {
                "title": video_info.get("title", ""),
                "uploader": video_info.get("uploader", ""),
                "duration": video_info.get("duration", 0),
                "platform": video_info.get("platform", ""),
                "upload_date": video_info.get("upload_date", ""),
                "view_count": video_info.get("view_count", 0),
                "like_count": video_info.get("like_count", 0),
            }

            return {
                "job_id": job_id,
                "status": "ready",
                "video_info": video_info,
                "thumbnail_url": job["thumbnail_url"],
                "file_size": job["file_size"],
                "available_formats": job["available_formats"],
                "metadata": job["metadata"],
                "download_url": job["download_url"],
            }

        except Exception as e:
            job["status"] = "failed"
            job["error"] = str(e)
            logger.error(f"Job {job_id} preparation failed: {e}", exc_info=True)
            raise


async def start_download(job_id: str) -> Dict[str, Any]:
    """Start the actual download for a prepared job."""
    job = _active_jobs.get(job_id)
    if not job:
        raise ValueError("Job not found")

    lock = get_job_lock(job_id)

    async with lock:
        if job["status"] != "ready":
            raise ValueError(f"Job not ready (status: {job['status']})")

        job["status"] = "downloading"
        job["progress"] = 0
        job["started_at"] = time.time()

    try:
        download_url = job.get("download_url")
        if not download_url:
            raise ValueError("No download URL available")

        # Record the download attempt
        attempt = {
            "job_id": job_id,
            "url": job["url"],
            "format": job["format"],
            "quality": job["quality"],
            "status": "started",
            "started_at": time.time(),
        }
        job["attempts"].append(attempt)

        # Perform the download using aiohttp
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(download_url) as resp:
                if resp.status == 200:
                    total = int(resp.headers.get("content-length", 0))
                    downloaded = 0

                    async for chunk in resp.content.iter_chunked(8192):
                        downloaded += len(chunk)
                        if total > 0:
                            job["progress"] = min(int((downloaded / total) * 100), 99)

                    job["status"] = "completed"
                    job["progress"] = 100
                    job["completed_at"] = time.time()
                    attempt["status"] = "completed"
                    attempt["completed_at"] = time.time()
                    attempt["bytes_downloaded"] = downloaded

                    return {
                        "job_id": job_id,
                        "status": "completed",
                        "progress": 100,
                        "bytes_downloaded": downloaded,
                    }
                else:
                    raise Exception(f"HTTP {resp.status}")

    except Exception as e:
        job["status"] = "failed"
        job["error"] = str(e)
        attempt["status"] = "failed"
        attempt["completed_at"] = time.time()
        attempt["error"] = str(e)
        logger.error(f"Download job {job_id} failed: {e}", exc_info=True)
        raise


async def retry_job(job_id: str) -> Dict[str, Any]:
    """Retry a failed download job."""
    job = _active_jobs.get(job_id)
    if not job:
        raise ValueError("Job not found")

    if job["status"] not in ("failed", "cancelled"):
        raise ValueError(f"Cannot retry job in status: {job['status']}")

    # Reset job status
    job["status"] = "preparing"
    job["progress"] = 0
    job["error"] = None
    job["started_at"] = None
    job["completed_at"] = None

    # Clean up attempts
    job["attempts"] = [a for a in job["attempts"] if a.get("status") == "completed"]

    # Re-prepare
    return await prepare_download(job["url"], job["format"], job["quality"])


async def cancel_job(job_id: str) -> Dict[str, Any]:
    """Cancel a running download job."""
    job = _active_jobs.get(job_id)
    if not job:
        raise ValueError("Job not found")

    if job["status"] == "downloading":
        job["status"] = "cancelled"
        job["completed_at"] = time.time()

    return {"job_id": job_id, "status": "cancelled"}


async def get_job_status(job_id: str) -> Dict[str, Any]:
    """Get the current status of a download job."""
    job = _active_jobs.get(job_id)
    if not job:
        return {"job_id": job_id, "status": "not_found"}

    return {
        "job_id": job["id"],
        "status": job["status"],
        "progress": job["progress"],
        "url": job["url"],
        "format": job["format"],
        "quality": job["quality"],
        "error": job.get("error"),
        "thumbnail_url": job.get("thumbnail_url"),
        "file_size": job.get("file_size"),
        "video_info": job.get("video_info"),
        "metadata": job.get("metadata"),
        "attempts": len(job.get("attempts", [])),
        "created_at": job.get("created_at"),
    }


async def get_download_history() -> List[Dict[str, Any]]:
    """Get download history for the current session."""
    history = []
    for job in _active_jobs.values():
        history.append({
            "job_id": job["id"],
            "url": job["url"],
            "status": job["status"],
            "format": job["format"],
            "quality": job["quality"],
            "progress": job["progress"],
            "thumbnail_url": job.get("thumbnail_url"),
            "file_size": job.get("file_size"),
            "video_info": job.get("video_info"),
            "metadata": job.get("metadata"),
            "created_at": job.get("created_at"),
            "completed_at": job.get("completed_at"),
        })
    history.sort(key=lambda x: x["created_at"] or 0, reverse=True)
    return history


async def add_to_favorites(url: str, video_info: Dict[str, Any]) -> bool:
    """Add a video to favorites."""
    return True


async def get_favorites() -> List[Dict[str, Any]]:
    """Get favorite videos."""
    return []


async def get_queue_status() -> Dict[str, Any]:
    """Get the current download queue status."""
    jobs = get_active_jobs()
    return {
        "total": len(jobs),
        "pending": sum(1 for j in jobs if j["status"] == "preparing"),
        "ready": sum(1 for j in jobs if j["status"] == "ready"),
        "downloading": sum(1 for j in jobs if j["status"] == "downloading"),
        "completed": sum(1 for j in jobs if j["status"] == "completed"),
        "failed": sum(1 for j in jobs if j["status"] == "failed"),
        "cancelled": sum(1 for j in jobs if j["status"] == "cancelled"),
    }