import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const videoUrl = request.nextUrl.searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
  }

  const decodedUrl = decodeURIComponent(videoUrl);

  if (!decodedUrl.startsWith("https://")) {
    return NextResponse.json({ error: "Invalid video URL" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300000);

    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "*/*",
        "Referer": "https://www.instagram.com/",
        "Origin": "https://www.instagram.com",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch video: HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const contentDisposition = response.headers.get("content-disposition") || 'attachment; filename="gotot_video.mp4"';
    const contentType = response.headers.get("content-type") || "video/mp4";
    const contentLength = response.headers.get("content-length");

    const streamHeaders = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
      "Cache-Control": "no-cache",
      "Accept-Ranges": "bytes",
    });

    if (contentLength) {
      streamHeaders.set("Content-Length", contentLength);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: streamHeaders,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return NextResponse.json(
        { error: "Download timed out. The CDN link may have expired. Please try fetching the video again." },
        { status: 408 }
      );
    }
    return NextResponse.json(
      { error: "Failed to stream video. The CDN link may have expired." },
      { status: 502 }
    );
  }
}
