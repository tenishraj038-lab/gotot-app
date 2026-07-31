import { NextRequest, NextResponse } from "next/server";

interface InstagramVideoInfo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  duration: number;
  width: number;
  height: number;
  author: string;
  type: "reel" | "post" | "tv";
  is_image?: boolean;
}

export async function POST(request: NextRequest) {
  const { instagramUrl } = await request.json();

  if (!instagramUrl || typeof instagramUrl !== "string") {
    return NextResponse.json({ error: "Instagram URL is required" }, { status: 400 });
  }

  const match = instagramUrl.match(
    /instagram\.com\/(?:p|reel|reels|tv)\/([^\/?#&]+)/
  );

  if (!match || !match[1]) {
    return NextResponse.json(
      { error: "Invalid Instagram URL. Use a post, reel, or tv link." },
      { status: 400 }
    );
  }

  const shortcode = match[1];
  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned`;

  try {
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    };

    const embedRes = await fetch(embedUrl, { headers });
    if (!embedRes.ok) {
      return NextResponse.json(
        { error: "This post may be private or unavailable. Instagram returned an error." },
        { status: 404 }
      );
    }

    const html = await embedRes.text();

    if (html.includes("This page isn't available") || html.length < 500) {
      return NextResponse.json(
        { error: "Post not found. It may have been deleted or is from a private account." },
        { status: 404 }
      );
    }

    const videoUrlMatch = html.match(/"video_url":"(https:\/\/[^"]+)"/);
    const thumbnailMatch = html.match(/"thumbnail_url":"(https:\/\/[^"]+)"/);
    const titleMatch = html.match(/"edge_media_to_caption"[^}]*"text":"([^"]+)"/);
    const authorMatch = html.match(/"owner":\{"username":"([^"]+)"/);
    const durationMatch = html.match(/"video_duration":([\d.]+)/);
    const dimensionsMatch = html.match(/"dimensions":\{"height":(\d+),"width":(\d+)\}/);
    const mediaType = instagramUrl.includes("/reel") || instagramUrl.includes("/reels") ? "reel" : instagramUrl.includes("/tv") ? "tv" : "post";

    const videoUrl = videoUrlMatch ? videoUrlMatch[1].replace(/\\/g, "") : null;
    const thumbnail = thumbnailMatch ? thumbnailMatch[1].replace(/\\/g, "") : null;

    if (!videoUrl) {
      const imageUrlMatch = html.match(/"display_url":"(https:\/\/[^"]+)"/);
      if (imageUrlMatch) {
        const imageUrl = imageUrlMatch[1].replace(/\\/g, "");
        return NextResponse.json({
          id: shortcode,
          url: imageUrl,
          thumbnail: imageUrl,
          title: titleMatch ? titleMatch[1] : `Instagram ${mediaType} by ${authorMatch?.[1] || "user"}`,
          duration: 0,
          width: 1080,
          height: 1080,
          author: authorMatch?.[1] || "instagram",
          type: mediaType as "reel" | "post" | "tv",
          is_image: true,
        });
      }
      return NextResponse.json(
        { error: "No video or image found. The post may be private or Instagram blocked the request." },
        { status: 400 }
      );
    }

    const info: InstagramVideoInfo = {
      id: shortcode,
      url: videoUrl,
      thumbnail: thumbnail || "",
      title: titleMatch ? titleMatch[1] : `Instagram ${mediaType} by ${authorMatch?.[1] || "user"}`,
      duration: durationMatch ? parseFloat(durationMatch[1]) : 0,
      width: dimensionsMatch ? parseInt(dimensionsMatch[2]) : 1080,
      height: dimensionsMatch ? parseInt(dimensionsMatch[1]) : 1920,
      author: authorMatch?.[1] || "instagram",
      type: mediaType as "reel" | "post" | "tv",
    };

    return NextResponse.json(info);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch Instagram post. Instagram may be rate-limiting requests. Try again later." },
      { status: 502 }
    );
  }
}
