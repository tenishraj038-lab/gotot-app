"use client";

import { useState, useCallback } from "react";
import { Download, Loader2, AlertCircle, X, FileDown, CheckCircle, Copy, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { api, API_BASE } from "@/lib/api";
import toast from "react-hot-toast";

export default function ResultCard() {
  const {
    videoInfo, isLoading, error, downloadResult, setDownloadResult,
    setError, url, detectedPlatform, setUrl,
  } = useStore();
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [showFavBtn, setShowFavBtn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const isInstagram = detectedPlatform === "instagram";

  const downloadBlob = (blob: Blob, filename: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const directDownload = useCallback(async () => {
    if (!videoInfo || downloading) return;
    setDownloading(true);
    setDone(false);
    setMsg("");

    try {
      if (isInstagram) {
        const cdnUrl = videoInfo.url || (videoInfo as any).formats?.[0]?.url;
        if (!cdnUrl) throw new Error("Video URL not available");

        const resp = await fetch(`/api/download/stream?url=${encodeURIComponent(cdnUrl)}`);
        if (!resp.ok) {
          const t = await resp.text().catch(() => "");
          let em;
          try { em = JSON.parse(t).error; } catch { em = `Error ${resp.status}`; }
          throw new Error(em);
        }

        const blob = await resp.blob();
        const fn = ((videoInfo.title || "video").replace(/[^a-z0-9_-]/gi, "_")) + ".mp4";
        downloadBlob(blob, fn);

        fetch("/api/download/log", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, platform: "instagram", title: videoInfo.title, format: "mp4", status: "success", file_size: blob.size }),
        }).catch(() => {});

        setMsg("Saved — ready for another!");
        setDone(true);
      } else {
        const fmts = videoInfo.formats;
        const best = fmts?.[0];
        if (!best) throw new Error("No format available");

        const result = await api.startDownload(url, best.format_id, best.as_mp3 || false, best.mp3_bitrate || "192");
        if (!result?.download_url) throw new Error(result?.require_payment ? "Upgrade needed" : "Download failed");

        const resp = await fetch(`${API_BASE}${result.download_url}`);
        if (!resp.ok) throw new Error(`Server error ${resp.status}`);

        const blob = await resp.blob();
        downloadBlob(blob, `${result.file_name || "video"}.${result.format || "mp4"}`);
        setDownloadResult(result);
        setMsg("Saved — ready for another!");
        setDone(true);
      }
      toast.success("Downloaded!");
    } catch (err: any) {
      const em = err?.message || "Download failed";
      setMsg(em);
    }
    setDownloading(false);
  }, [videoInfo, url, isInstagram, downloading]);

  const clearAll = () => {
    setUrl("");
    setError(null);
    setDownloadResult(null);
    useStore.setState({ videoInfo: null, downloadResult: null, error: null, detectedPlatform: null });
    setDone(false);
    setMsg("");
    setDownloading(false);
  };

  if (!videoInfo && !error && !isLoading) return null;

  return (
    <div className="mt-6 w-full max-w-3xl mx-auto">
      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-800 dark:text-red-200 flex-1">{error}</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setError(null)} className="text-xs text-primary-600 hover:underline">OK</button>
            <button onClick={clearAll} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded"><X className="w-4 h-4 text-red-400" /></button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 p-10 flex items-center justify-center shadow-xl">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto" />
            <p className="mt-3 text-sm text-gray-500">Fetching info...</p>
            <button onClick={clearAll} className="mt-2 text-xs text-gray-400 hover:text-red-500">Cancel</button>
          </div>
        </div>
      )}

      {/* Preview Card — STAYS visible even during download */}
      {videoInfo && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-xl">
          {videoInfo.thumbnail && (
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img
                src={videoInfo.thumbnail}
                alt={`Thumbnail for ${videoInfo.title || 'video'}`}
                className={`w-full h-full object-cover transition-opacity duration-500 ${thumbnailLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="eager"
                onLoad={() => setThumbnailLoaded(true)}
              />
              {!thumbnailLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{videoInfo.title || "Video"}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  {videoInfo.uploader && <span>{videoInfo.uploader}</span>}
                  {videoInfo.platform && <span className="px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 capitalize">{videoInfo.platform}</span>}
                  {videoInfo.duration > 0 && <span>{Math.floor(videoInfo.duration / 60)}:{String(videoInfo.duration % 60).padStart(2, "0")}</span>}
                </div>
              </div>
              <button onClick={clearAll} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 shrink-0"><X className="w-4 h-4" /></button>
            </div>

            {/* Download button */}
            <button
              onClick={directDownload}
              disabled={downloading || !videoInfo}
              className="mt-4 w-full py-3.5 px-6 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 text-base"
              aria-label="Download video"
            >
              {downloading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Downloading...{downloadProgress !== null && ` ${downloadProgress}%`}</>
              ) : (
                <><Download className="w-5 h-5" />Download Video</>
              )}
            </button>

            {/* Download progress bar */}
            {downloading && downloadProgress !== null && (
              <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={`w-4 h-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                {isFavorite ? "Favorited" : "Favorite"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
                aria-label="Copy download link"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>

            {/* Status messages */}
            {msg && (
              <div className={`mt-3 px-4 py-2 rounded-xl text-sm font-medium text-center ${
                done ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/30" :
                "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/30"
              }`}>
                {done && <CheckCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
                {!done && <AlertCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
                {msg}
                {done && (
                  <button onClick={clearAll} className="ml-2 underline text-primary-600 dark:text-primary-400">New Link</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
