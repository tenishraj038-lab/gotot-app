import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - GoTot",
  description: "Frequently Asked Questions about GoTot — the free universal video downloader.",
  openGraph: {
    title: "FAQ - GoTot",
    description: "Frequently Asked Questions about GoTot — the free universal video downloader.",
    type: "website",
    url: "https://gotot.app/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - GoTot",
    description: "Frequently Asked Questions about GoTot — the free universal video downloader.",
  },
  alternates: {
    canonical: "https://gotot.app/faq",
  },
};

export default function FaqPage() {
  const faqs = [
    {
      q: "Is GoTot free to use?",
      a: "Yes, GoTot is completely free. You can download unlimited videos without creating an account.",
    },
    {
      q: "Do I need to register to download videos?",
      a: "No, registration is not required for free downloads. You can start downloading immediately by pasting a video URL.",
    },
    {
      q: "Which platforms are supported?",
      a: "GoTot supports 15+ platforms including TikTok, Instagram, Twitter/X, Facebook, Reddit, Vimeo, Dailymotion, Twitch, LinkedIn, Pinterest, Snapchat, Bilibili, SoundCloud, Rumble, and Odysee.",
    },
    {
      q: "Can I download videos in MP3 format?",
      a: "Yes, GoTot supports MP3 conversion for supported platforms. Simply select the audio format when downloading.",
    },
    {
      q: "Can I download entire playlists?",
      a: "Yes, GoTot supports playlist downloads. When you paste a playlist URL, you'll be given the option to download all videos in the playlist.",
    },
    {
      q: "Is there a GoTot browser extension?",
      a: "Yes, GoTot offers a Chrome extension that adds a 'Download with GoTot' button directly on supported video platforms.",
    },
    {
      q: "Are there any download limits?",
      a: "Free users can download unlimited videos. Pro and Unlimited subscription plans offer additional features like higher quality downloads and batch processing.",
    },
    {
      q: "Is my data safe with GoTot?",
      a: "Yes, we use industry-standard security measures including HTTPS encryption, JWT authentication, and secure password hashing. We never store your downloaded content or payment details.",
    },
    {
      q: "How do I contact support?",
      a: "You can reach our support team at contact@gotot.app or use the contact form on our Contact page.",
    },
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <summary className="cursor-pointer flex items-center justify-between list-none">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{faq.q}</h2>
                <span className="text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}