"use client";

import { ExternalLink } from "lucide-react";
import Hero from "@/components/Hero";
import DownloadForm from "@/components/DownloadForm";
import ResultCard from "@/components/ResultCard";
import Features from "@/components/Features";
import AffiliateSection from "@/components/AffiliateSection";
import RecentDownloads from "@/components/RecentDownloads";

const platforms = [
  { name: "TikTok", href: "/download/tiktok" },
  { name: "Instagram", href: "/download/instagram" },
  { name: "Twitter/X", href: "/download/twitter" },
  { name: "Facebook", href: "/download/facebook" },
  { name: "Reddit", href: "/download/reddit" },
  { name: "Vimeo", href: "/download/vimeo" },
  { name: "Dailymotion", href: "/download/dailymotion" },
  { name: "Twitch", href: "/download/twitch" },
  { name: "LinkedIn", href: "/download/linkedin" },
  { name: "Pinterest", href: "/download/pinterest" },
];

export default function Home() {
  return (
    <>
      <Hero />
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <ins
            className="adsbygoogle"
            style={{ display: "block", textAlign: "center" }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
            data-ad-slot="6415948659"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </section>
      )}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <DownloadForm />
        <ResultCard />
      </section>
      <Features />
      <RecentDownloads />
      <AffiliateSection />
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <section className="py-8 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ins
              className="adsbygoogle"
              style={{ display: "block", textAlign: "center" }}
              data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
              data-ad-slot="6415948659"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </section>
      )}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Downloading?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Paste any video URL above and download in seconds. No sign-up needed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all text-sm font-medium"
              >
                {p.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
