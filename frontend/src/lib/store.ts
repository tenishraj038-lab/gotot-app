import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { VideoInfo, DownloadResult, UserInfo, SubscriptionStatus } from "./api";

interface PlaylistEntry {
  url: string;
  title: string;
  duration: number;
  thumbnail: string;
  id?: string;
}

interface DownloadState {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  videoInfo: VideoInfo | null;
  setVideoInfo: (info: VideoInfo | null) => void;
  downloadResult: DownloadResult | null;
  setDownloadResult: (result: DownloadResult | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  recentUrls: string[];
  addRecentUrl: (url: string) => void;

  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  subscription: SubscriptionStatus | null;
  setSubscription: (sub: SubscriptionStatus | null) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  adModalOpen: boolean;
  setAdModalOpen: (open: boolean) => void;
  paymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  pendingDownload: { url: string; formatId: string; asMp3: boolean } | null;
  setPendingDownload: (pending: { url: string; formatId: string; asMp3: boolean } | null) => void;

  playlistEntries: PlaylistEntry[];
  setPlaylistEntries: (entries: PlaylistEntry[]) => void;
  selectedPlaylistItems: Set<number>;
  togglePlaylistItem: (index: number) => void;
  selectAllPlaylist: () => void;
  clearPlaylistSelection: () => void;
  detectedPlatform: string | null;
  setDetectedPlatform: (p: string | null) => void;

  termsModalOpen: boolean;
  setTermsModalOpen: (open: boolean) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;

  downloadHistory: Array<{ id: string; url: string; title?: string; platform: string; format: string; status: string; file_size: number | null; created_at: string | null }>;
  setDownloadHistory: (history: Array<{ id: string; url: string; title?: string; platform: string; format: string; status: string; file_size: number | null; created_at: string | null }>) => void;
  ffmpegAvailable: boolean | null;
  setFfmpegAvailable: (available: boolean | null) => void;
  searchVersion: number;
  bumpSearch: () => void;

  supabaseUser: User | null;
  setSupabaseUser: (user: User | null) => void;
  supabaseSession: Session | null;
  setSupabaseSession: (session: Session | null) => void;

  // Download flow persistence
  lastVideoInfo: VideoInfo | null;
  setLastVideoInfo: (info: VideoInfo | null) => void;
  isDownloading: boolean;
  setIsDownloading: (downloading: boolean) => void;
  downloadProgress: number | null;
  setDownloadProgress: (progress: number | null) => void;
  downloadSpeed: string | null;
  setDownloadSpeed: (speed: string | null) => void;
  downloadETA: string | null;
  setDownloadETA: (eta: string | null) => void;
  downloadFileSize: string | null;
  setDownloadFileSize: (size: string | null) => void;
  isDownloadCancelled: boolean;
  setIsDownloadCancelled: (cancelled: boolean) => void;
  downloadRetryCount: number;
  setDownloadRetryCount: (count: number) => void;
  selectedFormatId: string | null;
  setSelectedFormatId: (id: string | null) => void;
  selectedAudioFormat: string | null;
  setSelectedAudioFormat: (format: string | null) => void;
  selectedAudioBitrate: string | null;
  setSelectedAudioBitrate: (bitrate: string | null) => void;
  downloadQueue: Array<{ id: string; url: string; title: string; format: string; status: string; progress: number; file_size: number | null }>;
  setDownloadQueue: (queue: Array<{ id: string; url: string; title: string; format: string; status: string; progress: number; file_size: number | null }>) => void;
  addToDownloadQueue: (item: { id: string; url: string; title: string; format: string; status: string; progress: number; file_size: number | null }) => void;
  updateDownloadQueueItem: (id: string, updates: Partial<{ status: string; progress: number; file_size: number | null }>) => void;
  removeFromDownloadQueue: (id: string) => void;
  clearDownloadQueue: () => void;
}

export const useStore = create<DownloadState>((set) => ({
  url: "",
  setUrl: (url) => set({ url }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading, error: null, downloadResult: null }),
  videoInfo: null,
  setVideoInfo: (info) => set({ videoInfo: info, error: null, lastVideoInfo: info }),
  downloadResult: null,
  setDownloadResult: (result) => set({ downloadResult: result }),
  error: null,
  setError: (error) => set({ error, isLoading: false }),
  isDarkMode: false,
  toggleDarkMode: () =>
    set((state) => {
      const newMode = !state.isDarkMode;
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", newMode);
        localStorage.setItem("darkMode", String(newMode));
      }
      return { isDarkMode: newMode };
    }),
  recentUrls: [],
  addRecentUrl: (url) =>
    set((state) => ({
      recentUrls: [url, ...state.recentUrls.filter((u) => u !== url)].slice(0, 10),
    })),

  user: null,
  setUser: (user) => set({ user }),
  subscription: null,
  setSubscription: (sub) => set({ subscription: sub }),
  isAuthModalOpen: false,
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  adModalOpen: false,
  setAdModalOpen: (open) => set({ adModalOpen: open }),
  paymentModalOpen: false,
  setPaymentModalOpen: (open) => set({ paymentModalOpen: open }),
  pendingDownload: null,
  setPendingDownload: (pending) => set({ pendingDownload: pending }),

  playlistEntries: [],
  setPlaylistEntries: (entries) => set({ playlistEntries: entries, selectedPlaylistItems: new Set(entries.map((_, i) => i)) }),
  selectedPlaylistItems: new Set(),
  togglePlaylistItem: (index) =>
    set((state) => {
      const next = new Set(state.selectedPlaylistItems);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return { selectedPlaylistItems: next };
    }),
  selectAllPlaylist: () =>
    set((state) => ({
      selectedPlaylistItems: new Set(state.playlistEntries.map((_, i) => i)),
    })),
  clearPlaylistSelection: () => set({ selectedPlaylistItems: new Set() }),

  detectedPlatform: null,
  setDetectedPlatform: (p) => set({ detectedPlatform: p }),

  termsModalOpen: false,
  setTermsModalOpen: (open) => set({ termsModalOpen: open }),
  termsAccepted: typeof window !== "undefined" ? document.cookie.includes("terms_accepted=true") : false,
  setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

  downloadHistory: [],
  setDownloadHistory: (history) => set({ downloadHistory: history }),
  ffmpegAvailable: null,
  setFfmpegAvailable: (available) => set({ ffmpegAvailable: available }),
  searchVersion: 0,
  bumpSearch: () => set((s) => ({ searchVersion: s.searchVersion + 1 })),

  supabaseUser: null,
  setSupabaseUser: (user) => set({ supabaseUser: user }),
  supabaseSession: null,
  setSupabaseSession: (session) => set({ supabaseSession: session }),

  // Download flow persistence
  lastVideoInfo: null,
  setLastVideoInfo: (info) => set({ lastVideoInfo: info }),
  isDownloading: false,
  setIsDownloading: (downloading) => set({ isDownloading: downloading }),
  downloadProgress: null,
  setDownloadProgress: (progress) => set({ downloadProgress: progress }),
  downloadSpeed: null,
  setDownloadSpeed: (speed) => set({ downloadSpeed: speed }),
  downloadETA: null,
  setDownloadETA: (eta) => set({ downloadETA: eta }),
  downloadFileSize: null,
  setDownloadFileSize: (size) => set({ downloadFileSize: size }),
  isDownloadCancelled: false,
  setIsDownloadCancelled: (cancelled) => set({ isDownloadCancelled: cancelled }),
  downloadRetryCount: 0,
  setDownloadRetryCount: (count) => set({ downloadRetryCount: count }),
  selectedFormatId: null,
  setSelectedFormatId: (id) => set({ selectedFormatId: id }),
  selectedAudioFormat: null,
  setSelectedAudioFormat: (format) => set({ selectedAudioFormat: format }),
  selectedAudioBitrate: null,
  setSelectedAudioBitrate: (bitrate) => set({ selectedAudioBitrate: bitrate }),
  downloadQueue: [],
  setDownloadQueue: (queue) => set({ downloadQueue: queue }),
  addToDownloadQueue: (item) =>
    set((state) => ({ downloadQueue: [...state.downloadQueue, item] })),
  updateDownloadQueueItem: (id, updates) =>
    set((state) => ({
      downloadQueue: state.downloadQueue.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
  removeFromDownloadQueue: (id) =>
    set((state) => ({
      downloadQueue: state.downloadQueue.filter((item) => item.id !== id),
    })),
  clearDownloadQueue: () => set({ downloadQueue: [] }),
}));
