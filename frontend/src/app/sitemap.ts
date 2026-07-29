import { MetadataRoute } from "next";

const baseUrl = "https://gotot.app";

const platforms = ["tiktok", "instagram", "twitter", "facebook", "reddit", "vimeo", "dailymotion", "twitch", "linkedin", "pinterest"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages = [
    { url: baseUrl, lastModified, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/dmca`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/copyright`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${baseUrl}/faq`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${baseUrl}/docs`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/help`, lastModified, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified, changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  const downloaderPages = platforms.map((p) => ({
    url: `${baseUrl}/download/${p}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogPages = [
    { url: `${baseUrl}/blog/top-10-video-downloader-tips`, lastModified, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/blog/how-to-download-tiktok-videos`, lastModified, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  return [...staticPages, ...downloaderPages, ...blogPages];
}
