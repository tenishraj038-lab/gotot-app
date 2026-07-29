"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2, Download, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";

interface QueueProgressProps {
  taskId: string;
  wsUrl?: string;
  onComplete?: (result: { file_name: string; file_size: number; format: string; file_path: string }) => void;
  onError?: (error: string) => void;
}

interface TaskStatus {
  task_id: string;
  status: "queued" | "downloading" | "processing" | "completed" | "failed";
  progress: number;
  message: string;
  error?: string;
}

const STATUS_ICONS: Record<string, React.ElementType> = {
  queued: Clock,
  downloading: Download,
  processing: RefreshCw,
  completed: CheckCircle2,
  failed: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
  queued: "text-yellow-500",
  downloading: "text-blue-500",
  processing: "text-purple-500",
  completed: "text-green-500",
  failed: "text-red-500",
};

export default function QueueProgress({ taskId, wsUrl, onComplete, onError }: QueueProgressProps) {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const pollCount = useRef(0);
  const maxPolls = 600; // 10 minutes at 1s intervals
  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/download/queue/${taskId}`);
      if (!res.ok) return;
      const data = await res.json();
      setStatus(data);

      if (data.status === "completed") {
        onComplete?.(data);
        return;
      }
      if (data.status === "failed") {
        onError?.(data.error || data.message || "Download failed");
        return;
      }
    } catch {
      // Poll will retry
    }
  }, [taskId, onComplete, onError]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (pollCount.current >= maxPolls) {
        onError?.("Download timed out. Please try again.");
        clearInterval(timer);
        return;
      }
      pollCount.current += 1;
      poll();
    }, 1000);

    return () => clearInterval(timer);
  }, [poll, onError, maxPolls]);

  useEffect(() => {
    if (!wsUrl) return;
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${wsProtocol}//${window.location.host}${wsUrl}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatus(data as TaskStatus);
        if (data.status === "completed") onComplete?.(data);
        if (data.status === "failed") onError?.(data.error || data.message || "Download failed");
      } catch {}
    };

    ws.onerror = () => {};
    return () => ws.close();
  }, [wsUrl, onComplete, onError]);

  if (!status) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        <span className="text-sm text-gray-500">Initializing download...</span>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[status.status] || Clock;
  const iconColor = STATUS_COLORS[status.status] || "text-gray-400";

  return (
    <div
      className="w-full max-w-md mx-auto"
    >
      <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <StatusIcon className={`w-5 h-5 ${iconColor} ${status.status === "processing" ? "animate-spin" : ""}`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {status.status === "queued" && "Queued"}
              {status.status === "downloading" && "Downloading..."}
              {status.status === "processing" && "Processing..."}
              {status.status === "completed" && "Download Complete!"}
              {status.status === "failed" && "Download Failed"}
            </p>
            {status.message && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{status.message}</p>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {status.progress}%
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status.status === "failed" ? "bg-red-500" : "bg-gradient-to-r from-primary-500 to-accent-500"
            }`}
            style={{ width: `${status.progress}%` }}
          />
        </div>

        {status.status === "failed" && status.error && (
          <p className="mt-2 text-xs text-red-500">{status.error}</p>
        )}
      </div>
    </div>
  );
}
