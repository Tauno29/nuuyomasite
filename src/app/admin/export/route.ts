import fs from "node:fs";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  await requireAdmin();
  db.pragma("wal_checkpoint(TRUNCATE)");
  const row = db.prepare("PRAGMA database_list").get() as { file: string } | undefined;
  if (!row?.file || !fs.existsSync(row.file)) {
    return new Response("Backup unavailable", { status: 500 });
  }
  const file = fs.readFileSync(row.file);
  const name = `nsss-backup-${new Date().toISOString().slice(0, 10)}.db`;
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}
