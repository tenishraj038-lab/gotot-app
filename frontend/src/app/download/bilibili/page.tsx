import { Metadata } from "next";
import DownloadClient from "../DownloadClient";

export const metadata: Metadata = {
  title: "Bilibili Video Downloader - Download Bilibili Videos Free | GoTot",
  description:
    "Download Bilibili videos in high quality. Save Bilibili anime, music videos, and more for free.",
  keywords: ["bilibili downloader", "download bilibili videos", "bilibili video saver", "bilibili anime download"],
  openGraph: {
    title: "Bilibili Video Downloader - GoTot",
    description: "Download Bilibili videos for free. High quality, no watermark.",
    url: "https://gotot.app/download/bilibili",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bilibili Video Downloader - GoTot",
    description: "Download Bilibili videos for free.",
  },
  alternates: {
    canonical: "https://gotot.app/download/bilibili",
  },
};

export default function BilibiliDownloaderPage() {
  return (
    <DownloadClient
      platform="Bilibili"
      defaultUrl="https://www.bilibili.com/video/BV1xx411c7mD"
      seoContent={{
        heading: "Bilibili Video Downloader",
        subheading: "Download Bilibili videos in high quality. Free, fast, and no watermark.",
        sections: [
          { title: "How to download Bilibili videos", steps: [
            { text: "Open Bilibili and copy the video link", image: "/og-image.png" },
            { text: "Paste the URL above", image: "/og-image.png" },
            { text: "Choose video or audio format", image: "/og-image.png" },
            { text: "Download and enjoy offline", image: "/og-image.png" },
          ]},
          { title: "Features", items: ["Bilibili video download", "Bilibili anime download", "MP4 and MP3 formats", "High quality preservation"] },
        ],
        faq: [
          { q: "Can I download Bilibili videos?", a: "Yes, GoTot supports downloading Bilibili videos." },
          { q: "Is it free?", a: "Yes, GoTot is completely free. Download as many Bilibili videos as you want." },
        ],
      }}
    />
  );
}