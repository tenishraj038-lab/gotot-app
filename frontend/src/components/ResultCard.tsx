"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Download, Loader2, AlertCircle, X, CheckCircle,
  Copy, Star, Clock,
  HardDrive, Wifi, ChevronDown, ChevronUp, Music, Video,
  Settings2, XCircle, RotateCcw,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { api, API_BASE } from "@/lib/api";
import toast from "react-hot-toast";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec < 1024) return `${bytesPerSec} B/s`;
  if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
}

function formatETA(remainingBytes: number, speedBytesPerSec: number): string {
  if (speedBytesPerSec <= 0) return "--:--";
  const seconds = Math.ceil(remainingBytes / speedBytesPerSec);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${m}m ${s}s`;
}

export default function ResultCard() {
  const {
    videoInfo, isLoading, error, setError,
    url, setUrl,
    lastVideoInfo, setLastVideoInfo,
    downloadProgress, setDownloadProgress,
    downloadSpeed, setDownloadSpeed,
    downloadETA, setDownloadETA,
    downloadFileSize, setDownloadFileSize,
    selectedFormatId, setSelectedFormatId,
    setSelectedAudioFormat,
    addToDownloadQueue,
    setIsDownloading, setIsDownloadCancelled,
    setDownloadRetryCount,
  } = useStore();

  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"video" | "audio">("video");
  const [audioBitrate, setAudioBitrate] = useState("192");
  const [showFormats, setShowFormats] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");
  const [cancelToken, setCancelToken] = useState(false);
  const [downloadElapsed, setDownloadElapsed] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);
  const bytesDownloadedRef = useRef<number>(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isImage = videoInfo?.is_image || videoInfo?.formats?.[0]?.is_image;

  const audioFormats = [
    { label: "MP3", value: "mp3", bitrates: ["128", "192", "256", "320"] },
    { label: "M4A", value: "m4a", bitrates: ["128", "192", "256", "320"] },
    { label: "AAC", value: "aac", bitrates: ["128", "192", "256", "320"] },
    { label: "WAV", value: "wav", bitrates: ["16", "24", "32"] },
    { label: "FLAC", value: "flac", bitrates: ["16", "24", "32"] },
    { label: "OPUS", value: "opus", bitrates: ["16", "32", "64", "128", "192"] },
    { label: "OGG", value: "ogg", bitrates: ["64", "128", "192", "320"] },
  ];

  const selectedAudioFormatObj = audioFormats.find((f) => f.value === downloadFormat) || audioFormats[0];

  const videoFormats = videoInfo?.formats?.filter((f) => f.has_video && f.ext !== "mp3") || [];

  const downloadBlob = (blob: Blob, filename: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  const startProgressTracking = useCallback((totalSize: number) => {
    startTimeRef.current = Date.now();
    bytesDownloadedRef.current = 0;
    setDownloadProgress(0);
    setDownloadSpeed("0 B/s");
    setDownloadETA("--:--");
    setDownloadFileSize(formatBytes(totalSize));

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      if (cancelToken) {
        clearInterval(progressIntervalRef.current!);
        progressIntervalRef.current = null;
        return;
      }
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      if (elapsed > 0) {
        const speed = bytesDownloadedRef.current / elapsed;
        setDownloadSpeed(formatSpeed(speed));
        const remaining = totalSize - bytesDownloadedRef.current;
        setDownloadETA(formatETA(remaining, speed));
        const progress = Math.min(99, Math.round((bytesDownloadedRef.current / totalSize) * 100));
        setDownloadProgress(progress);
        const ms = Math.round((elapsed % 1) * 1000);
        setDownloadElapsed(`${Math.floor(elapsed)}s ${ms}ms`);
      }
    }, 500);
  }, [cancelToken]);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const addDownloadToQueue = useCallback((title: string, format: string, fileSize: number | null) => {
    const id = `download_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    addToDownloadQueue({ id, url: url, title, format, status: "completed", progress: 100, file_size: fileSize });
  }, [url, addToDownloadQueue]);

  const directDownload = useCallback(async () => {
    if (!videoInfo || downloading) return;
    abortControllerRef.current = new AbortController();
    setCancelToken(false);
    setIsDownloadCancelled(false);
    setDownloading(true);
    setDone(false);
    setMsg("");
    setDownloadProgress(null);
    setDownloadSpeed(null);
    setDownloadETA(null);
    setDownloadFileSize(null);
    setDownloadRetryCount(0);

    try {
      if (isImage) {
        const imageUrl = videoInfo.url || (videoInfo as any).formats?.[0]?.url;
        if (!imageUrl) throw new Error("Image URL not available");

        const resp = await fetch(imageUrl, {
          signal: abortControllerRef.current.signal,
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const contentLength = resp.headers.get("content-length");
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
        if (totalSize > 0) startProgressTracking(totalSize);

        const blob = await resp.blob();
        const ext = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
        const fn = `${(videoInfo.title || "image").replace(/[^a-z0-9_-]/gi, "_")}.${ext}`;
        downloadBlob(blob, fn);
        addDownloadToQueue(videoInfo.title || "Image", ext, blob.size);

        setMsg("Download complete! Ready for another.");
        setDone(true);
        toast.success("Image downloaded!");
      } else {
        const fmts = videoInfo.formats;
        const formatId = selectedFormatId || fmts?.[0]?.format_id;
        if (!formatId) throw new Error("No format available");

        const selectedFormat = fmts?.find((f) => f.format_id === formatId) || fmts?.[0];
        if (!selectedFormat) throw new Error("Selected format not available");

        const result = await api.startDownload(url, formatId, false, "192");
        if (!result?.download_url) throw new Error(result?.require_payment ? "Upgrade needed" : "Download failed");

        // Use direct browser navigation for faster, streaming download
        const downloadUrl = `${API_BASE}${result.download_url}`;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = result.file_name || "video";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Track progress via content-length if available
        try {
          const headResp = await fetch(downloadUrl, { method: "HEAD" });
          const contentLength = headResp.headers.get("content-length");
          if (contentLength) {
            const totalSize = parseInt(contentLength, 10);
            if (totalSize > 0) startProgressTracking(totalSize);
          }
        } catch {
          // HEAD request failed, progress tracking will use estimated size
        }

        addDownloadToQueue(videoInfo.title || "Video", result.format || "mp4", result.file_size);

        setMsg("Download complete! Ready for another.");
        setDone(true);
        toast.success("Download complete!");
      }
    } catch (err: any) {
      if (err.message === "Download cancelled") {
        setMsg("Download cancelled.");
        toast("Download cancelled", { icon: "⏹️" });
      } else {
        const em = err?.message || "Download failed";
        setMsg(em);
        toast.error(em);
      }
    }
    setDownloading(false);
    setIsDownloading(false);
    stopProgressTracking();
  }, [
    videoInfo, url, isImage, downloading, cancelToken,
    selectedFormatId, startProgressTracking, stopProgressTracking, addDownloadToQueue,
  ]);

  const downloadAudio = useCallback(async () => {
    if (!videoInfo || downloading) return;
    abortControllerRef.current = new AbortController();
    setCancelToken(false);
    setIsDownloadCancelled(false);
    setDownloading(true);
    setDone(false);
    setMsg("");
    setDownloadProgress(null);
    setDownloadSpeed(null);
    setDownloadETA(null);
    setDownloadFileSize(null);

    try {
      const fmts = videoInfo.formats;
      const audioFmt = fmts?.find((f) => !f.has_video && f.has_audio && f.ext === downloadFormat);
      const formatId = audioFmt?.format_id || fmts?.find((f) => !f.has_video && f.has_audio)?.format_id;
      if (!formatId) throw new Error("No audio format available");

      const result = await api.startDownload(url, formatId, true, audioBitrate);
      if (!result?.download_url) throw new Error(result?.require_payment ? "Upgrade needed" : "Download failed");

      // Use direct browser navigation for faster, streaming download
      const downloadUrl = `${API_BASE}${result.download_url}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = result.file_name || "audio";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track progress via content-length if available
      try {
        const headResp = await fetch(downloadUrl, { method: "HEAD" });
        const contentLength = headResp.headers.get("content-length");
        if (contentLength) {
          const totalSize = parseInt(contentLength, 10);
          if (totalSize > 0) startProgressTracking(totalSize);
        }
      } catch {
        // HEAD request failed, progress tracking will use estimated size
      }

      addDownloadToQueue(videoInfo.title || "Audio", downloadFormat, result.file_size);

      setMsg("Audio download complete!");
      setDone(true);
      toast.success("Audio download complete!");
    } catch (err: any) {
      if (err.message === "Download cancelled") {
        setMsg("Download cancelled.");
        toast("Download cancelled", { icon: "⏹️" });
      } else {
        const em = err?.message || "Audio download failed";
        setMsg(em);
        toast.error(em);
      }
    }
    setDownloading(false);
    setIsDownloading(false);
    stopProgressTracking();
  }, [
    videoInfo, url, downloading, cancelToken, downloadFormat, audioBitrate,
    startProgressTracking, stopProgressTracking, addDownloadToQueue,
  ]);

  const cancelDownload = useCallback(() => {
    setCancelToken(true);
    setIsDownloadCancelled(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    stopProgressTracking();
    toast("Cancelling download...", { icon: "⏹️" });
  }, [stopProgressTracking]);

  const clearAll = () => {
    setUrl("");
    setError(null);
    setLastVideoInfo(null);
    useStore.setState({
      videoInfo: null, downloadResult: null, error: null,
      detectedPlatform: null, playlistEntries: [],
      isDownloading: false, downloadProgress: null, downloadSpeed: null,
      downloadETA: null, downloadFileSize: null, isDownloadCancelled: false,
      downloadRetryCount: 0, selectedFormatId: null,
      selectedAudioFormat: null, selectedAudioBitrate: null,
    });
    setDone(false);
    setMsg("");
    setDownloading(false);
    setCancelToken(false);
    setThumbnailLoaded(false);
    stopProgressTracking();
    toast.success("Cleared. Ready for a new link!");
  };

  const retryLastDownload = useCallback(() => {
    if (!videoInfo) return;
    setMsg("");
    setDone(false);
    if (downloadFormat === "video" || activeTab === "video") {
      directDownload();
    } else {
      downloadAudio();
    }
  }, [videoInfo, downloadFormat, activeTab, directDownload, downloadAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  if (!videoInfo && !error && !isLoading && !lastVideoInfo) return null;

  const displayInfo = videoInfo || lastVideoInfo;

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
      {displayInfo && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-xl">
          {/* Thumbnail */}
          {displayInfo.thumbnail && (
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <img
                src={displayInfo.thumbnail}
                alt={`Thumbnail for ${displayInfo.title || "video"}`}
                className={`w-full h-full object-cover transition-opacity duration-500 ${thumbnailLoaded ? "opacity-100" : "opacity-0"}`}
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
            {/* Title and platform */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{displayInfo.title || "Video"}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 flex-wrap">
                  {displayInfo.uploader && <span>{displayInfo.uploader}</span>}
                  {displayInfo.platform && (
                    <span className="px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 capitalize">
                      {displayInfo.platform}
                    </span>
                  )}
                  {displayInfo.duration > 0 && <span>{formatDuration(displayInfo.duration)}</span>}
                  {displayInfo.view_count && <span>{displayInfo.view_count.toLocaleString()} views</span>}
                </div>
              </div>
              <button onClick={clearAll} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 shrink-0" aria-label="Clear results">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab switcher: Video / Audio */}
            <div className="flex items-center gap-1 mt-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("video")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "video"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Video className="w-4 h-4" /> Video
              </button>
              <button
                onClick={() => setActiveTab("audio")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "audio"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Music className="w-4 h-4" /> Audio
              </button>
            </div>

            {/* Video Tab */}
            {activeTab === "video" && (
              <div className="mt-3 space-y-3">
                {/* Format selector */}
                {videoFormats.length > 1 && (
                  <div>
                    <button
                      onClick={() => setShowFormats(!showFormats)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        {selectedFormatId
                          ? `Format: ${selectedFormatId}`
                          : `Select format (${videoFormats.length} available)`}
                      </span>
                      {showFormats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showFormats && (
                      <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                        {videoFormats.map((fmt) => (
                          <button
                            key={fmt.format_id}
                            onClick={() => {
                              setSelectedFormatId(fmt.format_id);
                              setShowFormats(false);
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                              selectedFormatId === fmt.format_id
                                ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            <span>
                              {fmt.quality_label || fmt.ext.toUpperCase()}
                              {fmt.height ? ` (${fmt.height}p)` : ""}
                            </span>
                            <span className="text-xs text-gray-400">
                              {fmt.filesize ? formatBytes(fmt.filesize) : fmt.filesize_approx ? formatBytes(fmt.filesize_approx) : "Unknown"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Download button */}
                <button
                  onClick={directDownload}
                  disabled={downloading || !displayInfo}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 text-base"
                  aria-label={isImage ? "Download image" : "Download video"}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Downloading...
                      {downloadProgress !== null && ` ${downloadProgress}%`}
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" /> {isImage ? "Download Image" : "Download Video"}
                    </>
                  )}
                </button>

                {/* Progress bar */}
                {downloading && downloadProgress !== null && (
                  <div className="w-full">
                    <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1"><Wifi className="w-3 h-3" /> {downloadSpeed || "--"}</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> ETA: {downloadETA || "--"}</div>
                      <div className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {downloadFileSize || "--"}</div>
                      <div className="flex items-center gap-1">{downloadProgress}%</div>
                    </div>
                    <button
                      onClick={cancelDownload}
                      className="mt-2 w-full py-2 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Cancel Download
                    </button>
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
                    <Copy className="w-4 h-4" /> Copy Link
                  </button>
                </div>

                {/* Retry button */}
                {done && msg && (
                  <button
                    onClick={retryLastDownload}
                    className="w-full mt-2 py-2 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Download Again
                  </button>
                )}

                {/* Status messages */}
                {msg && (
                  <div
                    className={`mt-3 px-4 py-2 rounded-xl text-sm font-medium text-center ${
                      done
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/30"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/30"
                    }`}
                  >
                    {done && <CheckCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
                    {!done && <AlertCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
                    {msg}
                    {done && (
                      <button onClick={clearAll} className="ml-2 underline text-primary-600 dark:text-primary-400">
                        New Link
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Audio Tab */}
            {activeTab === "audio" && (
              <div className="mt-3 space-y-3">
                {/* Audio format selector */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audio Format</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {audioFormats.map((fmt) => (
                      <button
                        key={fmt.value}
                        onClick={() => {
                          setDownloadFormat(fmt.value as any);
                          setSelectedAudioFormat(fmt.value);
                        }}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          downloadFormat === fmt.value
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                            : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bitrate selector */}
                {selectedAudioFormatObj.bitrates.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Settings2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bitrate</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedAudioFormatObj.bitrates.map((br) => (
                        <button
                          key={br}
                          onClick={() => setAudioBitrate(br)}
                          className={`py-1.5 px-3 rounded-lg text-sm font-medium transition-all ${
                            audioBitrate === br
                              ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {br} kbps
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio download button */}
                <button
                  onClick={downloadAudio}
                  disabled={downloading || !displayInfo}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 text-base"
                  aria-label="Download audio"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Downloading Audio...
                      {downloadProgress !== null && ` ${downloadProgress}%`}
                    </>
                  ) : (
                    <>
                      <Music className="w-5 h-5" /> Download Audio
                    </>
                  )}
                </button>

                {/* Audio progress bar */}
                {downloading && downloadProgress !== null && (
                  <div className="w-full">
                    <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1"><Wifi className="w-3 h-3" /> {downloadSpeed || "--"}</div>
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> ETA: {downloadETA || "--"}</div>
                      <div className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {downloadFileSize || "--"}</div>
                      <div className="flex items-center gap-1">{downloadProgress}%</div>
                    </div>
                    <button
                      onClick={cancelDownload}
                      className="mt-2 w-full py-2 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Cancel Download
                    </button>
                  </div>
                )}

                {/* Audio retry */}
                {done && msg && (
                  <button
                    onClick={retryLastDownload}
                    className="w-full mt-2 py-2 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Download Again
                  </button>
                )}

                {/* Audio status */}
                {msg && (
                  <div
                    className={`mt-3 px-4 py-2 rounded-xl text-sm font-medium text-center ${
                      done
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/30"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/30"
                    }`}
                  >
                    {done && <CheckCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
                    {!done && <AlertCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
                    {msg}
                    {done && (
                      <button onClick={clearAll} className="ml-2 underline text-primary-600 dark:text-primary-400">
                        New Link
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}