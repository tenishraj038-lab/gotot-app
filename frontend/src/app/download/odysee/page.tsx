import { Metadata } from "next";
import DownloadClient from "../DownloadClient";

export const metadata: Metadata = {
  title: "Odysee Video Downloader - Download Odysee Videos Free | GoTot",
  description:
    "Download Odysee videos for free. Save Odysee LBRY videos in high quality without watermark.",
  keywords: ["odysee downloader", "download odysee videos", "odysee video saver", "lbry download"],
  openGraph: {
    title: "Odysee Video Downloader - GoTot",
    description: "Download Odysee videos for free. High quality, no watermark.",
    url: "https://gotot.app/download/odysee",
  },
  twitter: {
    card: "summary_large_image",
    title: "Odysee Video Downloader - GoTot",
    description: "Download Odysee videos for free.",
  },
  alternates: {
    canonical: "https://gotot.app/download/odysee",
  },
};

export default function OdyseeDownloaderPage() {
  return (
    <DownloadClient
      platform="Odysee"
      defaultUrl="https://odysee.com/@example:video-title"
      seoContent={{
        heading: "Odysee Video Downloader",
        subheading: "Download Odysee videos for free. High quality, no watermark, no sign-up required.",
        sections: [
          { title: "How to download Odysee videos", steps: [
            { text: "Open Odysee and copy the video link", image: "/og-image.png" },
            { text: "Paste the URL above", image: "/og-image.png" },
            { text: "Choose video or audio format", image: "/og-image.png" },
            { text: "Download and enjoy offline", image: "/og-image.png" },
          ]},
          { title: "Features", items: ["Odysee video download", "LBRY content download", "MP4 and MP3 formats", "High quality preservation"] },
        ],
        faq: [
          { q: "Can I download Odysee videos?", a: "Yes, GoTot supports downloading Odysee videos." },
          { q: "Is it free?", a: "Yes, GoTot is completely free. Download as many Odysee videos as you want." },
        ],
      }}
    />
  );
}