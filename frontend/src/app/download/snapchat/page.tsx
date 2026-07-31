import { Metadata } from "next";
import DownloadClient from "../DownloadClient";

export const metadata: Metadata = {
  title: "Snapchat Downloader - Download Snapchat Stories & Spots | GoTot",
  description:
    "Download Snapchat stories, spots, and snaps for free. Save Snapchat content in high quality without watermark.",
  keywords: ["snapchat downloader", "download snapchat stories", "snapchat spots download", "snapchat saver"],
  openGraph: {
    title: "Snapchat Downloader - GoTot",
    description: "Download Snapchat stories and spots for free. No watermark, no sign-up required.",
    url: "https://gotot.app/download/snapchat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snapchat Downloader - GoTot",
    description: "Download Snapchat stories and spots for free.",
  },
  alternates: {
    canonical: "https://gotot.app/download/snapchat",
  },
};

export default function SnapchatDownloaderPage() {
  return (
    <DownloadClient
      platform="Snapchat"
      defaultUrl="https://snapchat.com/spotlight/example"
      seoContent={{
        heading: "Snapchat Downloader",
        subheading: "Download Snapchat stories, spots, and snaps for free. No watermark, no sign-up required.",
        sections: [
          { title: "How to download Snapchat content", steps: [
            { text: "Open Snapchat and copy the story or spot link", image: "/og-image.png" },
            { text: "Paste the URL above", image: "/og-image.png" },
            { text: "Choose video or image format", image: "/og-image.png" },
            { text: "Download and enjoy offline", image: "/og-image.png" },
          ]},
          { title: "Features", items: ["Snapchat stories download", "Snapchat spots download", "No watermark", "High quality preservation"] },
        ],
        faq: [
          { q: "Can I download Snapchat stories?", a: "Yes, GoTot supports downloading Snapchat stories and spots." },
          { q: "Is it free?", a: "Yes, GoTot is completely free. Download as many Snapchat stories as you want." },
        ],
      }}
    />
  );
}