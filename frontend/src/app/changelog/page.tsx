"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

const changelogEntries = [
  {
    version: "2.0.0",
    date: "2026-07-29",
    type: "major",
    title: "Download Flow Overhaul & New Features",
    changes: [
      { type: "feature", text: "Fixed download flow — video info now persists after download starts or completes" },
      { type: "feature", text: "Added Clear button to manually reset the page and start a new search" },
      { type: "feature", text: "Added format selection UI — choose video quality and format before downloading" },
      { type: "feature", text: "Added dedicated Audio download section with MP3, M4A, AAC, WAV, FLAC, OPUS, OGG support" },
      { type: "feature", text: "Added audio bitrate selection (128, 192, 256, 320 kbps and more)" },
      { type: "feature", text: "Added download progress bar with percentage, speed, ETA, and file size" },
      { type: "feature", text: "Added cancel download, retry download, and download queue features" },
      { type: "feature", text: "Added download history tracking with status and file size" },
      { type: "feature", text: "Added improved notification system using react-hot-toast" },
      { type: "feature", text: "Added email subscription system with validation and confirmation" },
      { type: "feature", text: "Updated footer with Blog, API, Changelog, Status, Subscribe, and social media links" },
      { type: "feature", text: "Added contact emails display in footer and contact page" },
      { type: "feature", text: "Created Changelog page showing version history and release notes" },
      { type: "fix", text: "Fixed video information disappearing after download" },
      { type: "fix", text: "Fixed duplicate API requests on rapid form submission" },
      { type: "fix", text: "Fixed UI flickering during download state transitions" },
      { type: "fix", text: "Fixed loading state issues and memory leaks in download progress tracking" },
      { type: "fix", text: "Fixed state management bugs causing unexpected re-renders" },
      { type: "fix", text: "Improved mobile responsiveness across all pages" },
      { type: "fix", text: "Fixed accessibility issues with proper ARIA labels and focus states" },
    ],
  },
  {
    version: "1.5.0",
    date: "2026-06-15",
    type: "minor",
    title: "Performance & Stability Updates",
    changes: [
      { type: "feature", text: "Added playlist download support with multi-select" },
      { type: "feature", text: "Added dark mode with system preference detection" },
      { type: "feature", text: "Added download history and recent downloads list" },
      { type: "fix", text: "Fixed slow download speeds on large files" },
      { type: "fix", text: "Fixed memory leaks in long-running download sessions" },
      { type: "fix", text: "Improved error handling and retry logic" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-01-01",
    type: "release",
    title: "Initial Release",
    changes: [
      { type: "feature", text: "Initial release with video download support for 10+ platforms" },
      { type: "feature", text: "Added MP3 audio conversion" },
      { type: "feature", text: "Added batch download support" },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">What&apos;s New</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay up to date with the latest features, bug fixes, and improvements.
          </p>
        </motion.div>

        <div className="space-y-8">
          {changelogEntries.map((entry, idx) => (
            <motion.div
              key={entry.version}
              className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    entry.type === "major"
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : entry.type === "minor"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}>
                    {entry.type === "major" ? "Major Release" : entry.type === "minor" ? "Update" : "Release"}
                  </span>
                  <span className="text-sm font-mono text-gray-400">v{entry.version}</span>
                </div>
                <h2 className="text-xl font-bold">{entry.title}</h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {entry.date}
                </div>
              </div>
              <div className="p-6 space-y-3">
                {entry.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 shrink-0">
                      {change.type === "feature" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : change.type === "fix" ? (
                        <Clock className="w-4 h-4 text-blue-500" />
                      ) : change.type === "security" ? (
                        <AlertTriangle className="w-4 h-4 text-purple-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </span>
                    <span className={`${
                      change.type === "feature"
                        ? "text-gray-900 dark:text-gray-100"
                        : change.type === "fix"
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {change.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}