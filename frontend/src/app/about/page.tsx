import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About GoTot - Universal Video Downloader",
  description: "Learn about GoTot — the free, fast, and secure video downloader supporting 15+ platforms. No registration required.",
  openGraph: {
    title: "About GoTot - Universal Video Downloader",
    description: "Learn about GoTot — the free, fast, and secure video downloader supporting 15+ platforms.",
    type: "website",
    url: "https://gotot.app/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GoTot - Universal Video Downloader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About GoTot - Universal Video Downloader",
    description: "Learn about GoTot — the free, fast, and secure video downloader supporting 15+ platforms.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://gotot.app/about",
  },
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">About GoTot</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <p>GoTot is a free, universal video downloader that lets you download videos from 10+ platforms — including TikTok, Instagram, Twitter/X, Facebook, Reddit, Vimeo, Dailymotion, Twitch, LinkedIn, and Pinterest.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Our Mission</h2>
          <p>We built GoTot to make downloading online videos simple, fast, and accessible to everyone. No registration is required for free downloads, and our platform supports the most popular video-sharing websites on the internet.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Download videos from 10+ platforms in HD quality</li>
            <li>Convert videos to MP3 audio format</li>
            <li>Download entire playlists with a single click</li>
            <li>No registration required for free downloads</li>
            <li>Fast, secure, and completely free</li>
            <li>Chrome extension for one-click downloading</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8">Contact</h2>
          <p>Have questions or feedback? Reach out to us at <a href="/contact" className="text-primary-600 hover:underline">contact@gotot.app</a>.</p>
        </div>
      </div>
    </div>
  );
}