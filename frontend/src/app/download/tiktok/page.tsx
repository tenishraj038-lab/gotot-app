import { Metadata } from "next";
import DownloadClient from "../DownloadClient";

export const metadata: Metadata = {
  title: "TikTok Video Downloader - Download TikTok Videos Free | GoTot",
  description:
    "Download TikTok videos without watermark in high quality. Save TikTok, TikTok Music, and TikTok slideshows for free.",
  keywords: ["tiktok downloader", "download tiktok videos", "tiktok without watermark", "tiktok video saver"],
  openGraph: {
    title: "TikTok Video Downloader - GoTot",
    description: "Download TikTok videos without watermark. Free and fast.",
    url: "https://gotot.app/download/tiktok",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Video Downloader - GoTot",
    description: "Download TikTok videos without watermark. Free and fast.",
  },
  alternates: {
    canonical: "https://gotot.app/download/tiktok",
  },
};

export default function TiktokDownloaderPage() {
  return (
    <DownloadClient
      platform="TikTok"
      defaultUrl="https://www.tiktok.com/@username/video/"
      seoContent={{
        heading: "TikTok Video Downloader",
        subheading: "Save TikTok videos without watermark. Free and no sign-up required.",
        sections: [
          { title: "How to download TikTok videos", steps: [
            { text: "Open TikTok and copy the video link", image: "/og-image.png" },
            { text: "Paste the URL above", image: "/og-image.png" },
            { text: "Choose video or audio only", image: "/og-image.png" },
            { text: "Download and enjoy offline", image: "/og-image.png" },
          ]},
          { title: "Features", items: ["No watermark download", "Save TikTok slideshows", "MP4 and MP3 formats", "High quality preservation"] },
        ],
        faq: [
          { q: "Can I download TikTok without watermark?", a: "Yes, GoTot removes watermarks from TikTok downloads." },
          { q: "Is it free?", a: "Yes, GoTot is completely free. Download as many TikTok videos as you want with no limits." },
        ],
      }}
    />
  );
}
