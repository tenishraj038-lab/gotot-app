import { Metadata } from "next";
import DownloadClient from "../DownloadClient";

export const metadata: Metadata = {
  title: "SoundCloud Downloader - Download SoundCloud Tracks & Music | GoTot",
  description:
    "Download SoundCloud tracks, music, and podcasts for free. Save SoundCloud audio in MP3, FLAC, and more.",
  keywords: ["soundcloud downloader", "download soundcloud music", "soundcloud mp3", "soundcloud audio download"],
  openGraph: {
    title: "SoundCloud Downloader - GoTot",
    description: "Download SoundCloud tracks for free. MP3, FLAC, and more formats available.",
    url: "https://gotot.app/download/soundcloud",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoundCloud Downloader - GoTot",
    description: "Download SoundCloud tracks for free.",
  },
  alternates: {
    canonical: "https://gotot.app/download/soundcloud",
  },
};

export default function SoundCloudDownloaderPage() {
  return (
    <DownloadClient
      platform="SoundCloud"
      defaultUrl="https://soundcloud.com/example/track"
      seoContent={{
        heading: "SoundCloud Downloader",
        subheading: "Download SoundCloud tracks, music, and podcasts for free. No sign-up required.",
        sections: [
          { title: "How to download SoundCloud tracks", steps: [
            { text: "Open SoundCloud and copy the track link", image: "/og-image.png" },
            { text: "Paste the URL above", image: "/og-image.png" },
            { text: "Choose audio format (MP3, FLAC, etc.)", image: "/og-image.png" },
            { text: "Download and enjoy offline", image: "/og-image.png" },
          ]},
          { title: "Features", items: ["SoundCloud track download", "SoundCloud playlist download", "MP3, FLAC, WAV formats", "High quality audio"] },
        ],
        faq: [
          { q: "Can I download SoundCloud tracks?", a: "Yes, GoTot supports downloading SoundCloud tracks and playlists." },
          { q: "Is it free?", a: "Yes, GoTot is completely free. Download as many SoundCloud tracks as you want." },
        ],
      }}
    />
  );
}