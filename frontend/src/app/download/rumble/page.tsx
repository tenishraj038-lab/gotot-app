import { Metadata } from "next";
import DownloadClient from "../DownloadClient";

export const metadata: Metadata = {
  title: "Rumble Video Downloader - Download Rumble Videos Free | GoTot",
  description:
    "Download Rumble videos for free. Save Rumble videos in high quality without watermark.",
  keywords: ["rumble downloader", "download rumble videos", "rumble video saver", "rumble download"],
  openGraph: {
    title: "Rumble Video Downloader - GoTot",
    description: "Download Rumble videos for free. High quality, no watermark.",
    url: "https://gotot.app/download/rumble",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rumble Video Downloader - GoTot",
    description: "Download Rumble videos for free.",
  },
  alternates: {
    canonical: "https://gotot.app/download/rumble",
  },
};

export default function RumbleDownloaderPage() {
  return (
    <DownloadClient
      platform="Rumble"
      defaultUrl="https://rumble.com/v123456-example.html"
      seoContent={{
        heading: "Rumble Video Downloader",
        subheading: "Download Rumble videos for free. High quality, no watermark, no sign-up required.",
        sections: [
          { title: "How to download Rumble videos", steps: [
            { text: "Open Rumble and copy the video link", image: "/og-image.png" },
            { text: "Paste the URL above", image: "/og-image.png" },
            { text: "Choose video or audio format", image: "/og-image.png" },
            { text: "Download and enjoy offline", image: "/og-image.png" },
          ]},
          { title: "Features", items: ["Rumble video download", "No watermark", "MP4 and MP3 formats", "High quality preservation"] },
        ],
        faq: [
          { q: "Can I download Rumble videos?", a: "Yes, GoTot supports downloading Rumble videos." },
          { q: "Is it free?", a: "Yes, GoTot is completely free. Download as many Rumble videos as you want." },
        ],
      }}
    />
  );
}