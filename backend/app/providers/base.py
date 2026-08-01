"""
Base provider interface for video download platforms.

Each platform provider must implement extract_info() and extract_playlist().
Override supports_* properties to disable features per platform.
Override get_download_opts() to customize yt-dlp options per platform.
"""

import re
from abc import ABC, abstractmethod
from typing import Optional, Any
from urllib.parse import urlparse


_PLATFORM_HOSTS = {
    "tiktok": ("tiktok.com", "vm.tiktok.com"),
    "instagram": ("instagram.com",),
    "twitter": ("twitter.com", "x.com"),
    "facebook": ("facebook.com", "fb.watch"),
    "reddit": ("reddit.com", "redd.it", "v.redd.it", "i.redd.it"),
    "vimeo": ("vimeo.com",),
    "dailymotion": ("dailymotion.com", "dai.ly"),
    "twitch": ("twitch.tv", "clips.twitch.tv"),
    "linkedin": ("linkedin.com",),
    "pinterest": ("pinterest.com", "pin.it"),
    "snapchat": ("snapchat.com", "story.snapchat.com"),
    "bilibili": ("bilibili.com", "b23.tv"),
    "soundcloud": ("soundcloud.com", "soundcloud.app.goo.gl"),
    "rumble": ("rumble.com",),
    "odysee": ("odysee.com",),
}


class BaseProvider(ABC):
    name: str = ""
    display_name: str = ""
    color: str = "#666666"
    patterns: list[str] = []

    def __init__(self):
        self._compiled_patterns = [re.compile(p, re.IGNORECASE) for p in self.patterns]

    def matches(self, url: str) -> bool:
        try:
            hostname = (urlparse(url).hostname or "").lower().rstrip(".")
        except ValueError:
            hostname = ""

        hosts = _PLATFORM_HOSTS.get(self.name, ())
        if any(hostname == host or hostname.endswith(f".{host}") for host in hosts):
            return True

        return any(pattern.search(url) for pattern in self._compiled_patterns)

    @abstractmethod
    def extract_info(self, url: str, ydl_opts: Optional[dict] = None) -> Optional[dict]:
        """Extract video/audio info without downloading."""

    @abstractmethod
    def extract_playlist(self, url: str, ydl_opts: Optional[dict] = None) -> Optional[list]:
        """Extract playlist entries. Return None if not supported or not a playlist."""

    def get_download_opts(self, format_id: str, output_dir: str) -> dict:
        """Override to add platform-specific yt-dlp options."""
        return {
            "format": format_id,
            "outtmpl": f"{output_dir}/%(title)s.%(ext)s",
            "noplaylist": True,
            "quiet": True,
            "no_warnings": True,
        }

    def get_extract_opts(self) -> dict:
        """Override to add platform-specific extraction options (cookies, headers, etc.)."""
        return {}

    def supports_playlist(self) -> bool:
        return True

    def supports_subtitles(self) -> bool:
        return True

    def supports_audio_extraction(self) -> bool:
        return True

    def supports_images(self) -> bool:
        return False

    def requires_auth(self) -> bool:
        return False

    def get_auth_hint(self) -> Optional[str]:
        return None

    def get_metadata(self, info: dict) -> dict:
        return {
            "title": info.get("title", "video"),
            "duration": info.get("duration", 0),
            "thumbnail": info.get("thumbnail", ""),
            "uploader": info.get("uploader", info.get("channel", "")),
            "upload_date": info.get("upload_date", ""),
            "description": (info.get("description", "") or "")[:500],
            "view_count": info.get("view_count", 0),
            "like_count": info.get("like_count", 0),
            "tags": (info.get("tags") or [])[:10],
        }
