import { Metadata } from "next";
import DownloadClient from "../DownloadClient";

export const metadata: Metadata = {
  title: "Pinterest Video Downloader - Download Pinterest Videos Free | GoTot",
  description:
    "Download Pinterest videos and Idea Pins in high quality. Save Pinterest content to your device for free.",
  keywords: ["pinterest downloader", "download pinterest videos", "pinterest video saver", "idea pin downloader"],
  openGraph: {
    title: "Pinterest Video Downloader - GoTot",
    description: "Download Pinterest videos and Idea Pins. Free and fast.",
    url: "https://gotot.app/download/pinterest",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinterest Video Downloader - GoTot",
    description: "Download Pinterest videos and Idea Pins. Free and fast.",
  },
  alternates: {
    canonical: "https://gotot.app/download/pinterest",
  },
};

export default function PinterestDownloaderPage() {
  return (
    <DownloadClient
      platform="Pinterest"
      defaultUrl="https://www.pinterest.com/pin/"
      seoContent={{
        heading: "Pinterest Video Downloader",
        subheading: "Save Pinterest videos and Idea Pins in high quality. Free and anonymous.",
        sections: [
          { title: "How to download Pinterest videos", steps: [
            { text: "Find the Pinterest pin with a video", image: "/og-image.png" },
            { text: "Click the three dots and copy the link", image: "/og-image.png" },
            { text: "Paste the URL above", image: "/og-image.png" },
            { text: "Download in original quality", image: "/og-image.png" },
          ]},
          { title: "Supported Content", items: ["Pinterest video pins", "Idea Pins (Storyboard)", "Pinterest GIF pins", "High quality downloads"] },
        ],
        faq: [
          { q: "Can I download Idea Pins?", a: "Yes, GoTot supports downloading Pinterest Idea Pins and video pins." },
          { q: "Is it free?", a: "Yes, Pinterest downloads are completely free with no limits." },
          { q: "What formats are available?", a: "Pinterest videos are available in MP4 format at original quality." },
        ],
      }}
    />
  );
}
