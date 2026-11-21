import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db, nowIso } from "@/lib/db";
import { checkRateLimit } from "@/lib/auth";

export async function POST(request: Request) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (!checkRateLimit(`pageview:${ip}`, 120, 60 * 1000).allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let path: unknown;
  try {
    ({ path } = await request.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof path !== "string" || !path.startsWith("/") || path.length > 300) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  db.prepare("INSERT INTO page_views (path, created_at) VALUES (?, ?)").run(path.split("?")[0], nowIso());
  return NextResponse.json({ ok: true });
}
