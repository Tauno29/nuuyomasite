import fs from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { getSessionUser, type SessionUser } from "@/lib/auth";

export const runtime = "nodejs";

const DIR = path.join(process.cwd(), "data", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

type DocumentRow = { audience: string; grade: string | null; published: number };
type ReportRow = { learner_id: number; published: number };

function learnerGrade(learnerId: number | null) {
  if (!learnerId) return null;
  const row = db.prepare("SELECT grade FROM learners WHERE id = ? AND active = 1").get(learnerId) as
    | { grade: string }
    | undefined;
  return row?.grade ?? null;
}

function canAccess(fileUrl: string, user: SessionUser | null) {
  if (user?.role === "admin") return true;

  const grade = user?.role === "learner" ? learnerGrade(user.learnerId) : null;

  const document = db
    .prepare("SELECT audience, grade, published FROM documents WHERE file_url = ?")
    .get(fileUrl) as DocumentRow | undefined;

  if (document) {
    if (!document.published) return false;
    if (document.audience !== "learner") return true;
    if (!grade) return false;
    if (document.grade && document.grade !== grade) return false;
    return true;
  }

  const report = db.prepare("SELECT learner_id, published FROM reports WHERE file_url = ?").get(fileUrl) as
    | ReportRow
    | undefined;

  if (report) {
    return Boolean(user?.learnerId && report.learner_id === user.learnerId && report.published);
  }

  return false;
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[A-Za-z0-9._-]+$/.test(name)) {
    return new Response("Not found", { status: 404 });
  }

  const file = path.join(DIR, name);
  if (!fs.existsSync(file)) {
    return new Response("Not found", { status: 404 });
  }

  const user = await getSessionUser();
  if (!canAccess(`/api/files/${name}`, user)) {
    return new Response(
      user ? "Your account does not have access to this file." : "Sign in to the learner portal to download this file.",
      {
        status: user ? 403 : 401,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      },
    );
  }

  const ext = path.extname(name).toLowerCase();
  const buffer = fs.readFileSync(file);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Content-Length": String(buffer.byteLength),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
