"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Link, Loader2, Music, Video, Twitter, Facebook, Globe, Clapperboard, Tv, Briefcase, Pin, PlayCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api";
import TermsModal from "./TermsModal";
import toast from "react-hot-toast";

const PLATFORM_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  instagram: { icon: Video, color: "text-purple-500" },
  tiktok: { icon: Music, color: "text-pink-500" },
  twitter: { icon: Twitter, color: "text-sky-500" },
  facebook: { icon: Facebook, color: "text-blue-600" },
  reddit: { icon: Globe, color: "text-orange-500" },
  vimeo: { icon: Clapperboard, color: "text-teal-500" },
  twitch: { icon: Tv, color: "text-violet-500" },
  dailymotion: { icon: PlayCircle, color: "text-blue-500" },
  linkedin: { icon: Briefcase, color: "text-blue-700" },
  pinterest: { icon: Pin, color: "text-rose-500" },
  snapchat: { icon: Globe, color: "text-yellow-400" },
  bilibili: { icon: Tv, color: "text-pink-400" },
  soundcloud: { icon: Music, color: "text-orange-400" },
  rumble: { icon: Globe, color: "text-green-500" },
  odysee: { icon: Globe, color: "text-purple-400" },
};

const PLATFORM_PATTERNS: Record<string, RegExp[]> = {
  instagram: [/instagram\.com\/(p|reel|reels|tv)\/[\w-]+/, /instagram\.com\/stories\/[\w.-]+\/\d+/],
  tiktok: [/tiktok\.com/, /vm\.tiktok\.com/],
  twitter: [/twitter\.com/, /x\.com/],
  facebook: [/facebook\.com/, /fb\.watch/],
  reddit: [/reddit\.com/, /v\.redd\.it/],
  vimeo: [/vimeo\.com/],
  dailymotion: [/dailymotion\.com/, /dai\.ly/],
  twitch: [/twitch\.tv/, /clips\.twitch\.tv/],
  linkedin: [/linkedin\.com/],
  pinterest: [/pinterest\.com/, /pin\.it/],
  snapchat: [/snapchat\.com/],
  bilibili: [/bilibili\.com/],
  soundcloud: [/soundcloud\.com/],
  rumble: [/rumble\.com/],
  odysee: [/odysee\.com/],
};

function detectPlatformFromUrl(url: string): string | null {
  for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
    for (const p of patterns) {
      if (p.test(url)) return platform;
    }
  }
  return null;
}

function validateUrl(url: string): string | null {
  if (!url.trim()) return "Please enter a URL";
  if (!url.match(/^https?:\/\//i)) return "URL must start with http:// or https://";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes(".")) return "Invalid URL";
  } catch {
    return "Invalid URL format";
  }
  return null;
}

const allPlatforms = [
  { name: "Instagram", key: "instagram", icon: Video, color: "text-purple-500" },
  { name: "TikTok", key: "tiktok", icon: Music, color: "text-pink-500" },
  { name: "Twitter/X", key: "twitter", icon: Twitter, color: "text-sky-500" },
  { name: "Facebook", key: "facebook", icon: Facebook, color: "text-blue-600" },
  { name: "Reddit", key: "reddit", icon: Globe, color: "text-orange-500" },
  { name: "Vimeo", key: "vimeo", icon: Clapperboard, color: "text-teal-500" },
  { name: "Dailymotion", key: "dailymotion", icon: PlayCircle, color: "text-blue-500" },
  { name: "Twitch", key: "twitch", icon: Tv, color: "text-violet-500" },
  { name: "LinkedIn", key: "linkedin", icon: Briefcase, color: "text-blue-700" },
  { name: "Pinterest", key: "pinterest", icon: Pin, color: "text-rose-500" },
];

export default function DownloadForm() {
  const {
    url, setUrl, isLoading, setIsLoading, setVideoInfo, setError, addRecentUrl,
    detectedPlatform, setDetectedPlatform, setPlaylistEntries,
    termsAccepted, setTermsModalOpen, setFfmpegAvailable,
  } = useStore();
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const platform = detectPlatformFromUrl(url);
    setDetectedPlatform(platform);
    setLocalError(null);
  }, [url, setDetectedPlatform]);

  useEffect(() => {
    api.getFFmpegStatus().then(s => setFfmpegAvailable(s.available)).catch(() => {});
  }, [setFfmpegAvailable]);

  const fetchInstagram = useCallback(async (instagramUrl: string) => {
    setIsLoading(true);
    setVideoInfo(null);
    setPlaylistEntries([]);
    useStore.setState({ videoInfo: null, downloadResult: null, error: null });
    try {
      const res = await fetch("/api/download/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagramUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      const mapped = {
        id: data.id || instagramUrl,
        title: data.title || "Instagram video",
        thumbnail: data.thumbnail || "",
        duration: data.duration || 0,
        uploader: data.author || "instagram",
        platform: "instagram",
        url: data.url || "", // CDN video URL
        formats: [{
          format_id: "direct",
          format_note: `${data.height || 1080}p`,
          ext: "mp4",
          height: data.height || 1080,
          width: data.width || 1920,
          filesize: 0,
          vcodec: "h264",
          acodec: "aac",
          video_ext: "mp4",
          resolution: `${data.height || 1080}p`,
          fps: 30,
          url: data.url || "", // CDN video URL
        }],
        is_playlist: false,
      };
      setVideoInfo(mapped as any);
      useStore.setState({ downloadResult: null, error: null, isLoading: false });
      addRecentUrl(instagramUrl);
      toast.success("Video found!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to get video info";
      setError(msg);
      setIsLoading(false);
    }
  }, []);

  const doSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const urlValidationError = validateUrl(url);
    if (urlValidationError) {
      setLocalError(urlValidationError);
      return;
    }

    if (!termsAccepted) {
      setTermsModalOpen(true);
      return;
    }

    const searchVer = useStore.getState().searchVersion + 1;
    useStore.setState({ isLoading: true, videoInfo: null, downloadResult: null, error: null, playlistEntries: [], searchVersion: searchVer });

    try {
      if (detectedPlatform === "instagram") {
        await fetchInstagram(url.trim());
        return;
      }

      // Start info extraction immediately for faster preview
      const info = await api.getVideoInfo(url.trim());
      useStore.setState({ videoInfo: info, isLoading: false, error: null });
      addRecentUrl(url.trim());
      if (info.is_playlist) {
        try {
          const playlistData = await api.getPlaylistInfo(url.trim());
          setPlaylistEntries(playlistData.entries);
        } catch {}
      } else {
        setPlaylistEntries([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get video info");
      setIsLoading(false);
    }
  };

  const handleTermsAccepted = () => {
    useStore.getState().setTermsAccepted(true);
    setTermsModalOpen(false);
    doSubmit();
  };

  const handleTermsDeclined = () => {
    setTermsModalOpen(false);
    setError("You must accept the Terms of Service to use GoTot.");
  };

  const DetectedIcon = detectedPlatform ? PLATFORM_ICONS[detectedPlatform]?.icon : null;
  const detectedColor = detectedPlatform ? PLATFORM_ICONS[detectedPlatform]?.color : "";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={doSubmit} className="relative">
        <div
          className={`relative flex items-center transition-all duration-300 ${
            isFocused
              ? "ring-2 ring-primary-500/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 shadow-2xl shadow-primary-500/20"
              : "shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50"
          }`}
        >
          <div className="absolute left-4 flex items-center pointer-events-none">
            {DetectedIcon ? (
              <DetectedIcon className={`w-5 h-5 ${detectedColor}`} />
            ) : (
              <Link className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setLocalError(null); }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Paste video URL here (Instagram, TikTok, etc.)..."
            className="w-full pl-12 pr-36 py-5 rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-base input-glow focus:outline-none focus:border-transparent transition-all duration-200"
            disabled={isLoading}
            autoComplete="off"
            autoCorrect="off"
          />

          <div className="absolute right-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary-500/25 active:scale-[0.98] hover:scale-[1.02]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{isLoading ? "Analyzing..." : "Get Video"}</span>
            </button>
          </div>
        </div>

        {localError && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
            <span className="text-xs">⚠</span> {localError}
          </p>
        )}

        {detectedPlatform && !localError && (
          <div className="absolute -bottom-7 left-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            {DetectedIcon && <DetectedIcon className={`w-3 h-3 ${detectedColor}`} />}
            {detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1)} detected
          </div>
        )}
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
        {allPlatforms.map((platform) => (
          <div
            key={platform.key}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800/50 text-[10px] font-medium text-gray-600 dark:text-gray-400 cursor-default hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <platform.icon className={`w-3 h-3 ${platform.color}`} />
            {platform.name}
          </div>
        ))}
      </div>
      <TermsModal
        isOpen={useStore((s) => s.termsModalOpen)}
        onAccept={handleTermsAccepted}
        onDecline={handleTermsDeclined}
      />
    </div>
  );
}
