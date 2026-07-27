import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const body = await request.json();
  const { url, platform, title, status, format, file_size } = body;

  if (url) {
    try {
      await supabase.from("downloads").insert({
        user_id: userId,
        url,
        platform: platform || "unknown",
        title: title || null,
        format: format || null,
        status: status || "success",
        file_size: file_size || null,
      });
    } catch {}
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ downloads: [], error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("downloads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ downloads: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ downloads: data || [] });
}
