import "server-only";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";

export const SESSION_COOKIE = "nsss_session";
const SESSION_DAYS = 7;

export type Role = "admin" | "learner";

export type SessionUser = {
  id: number;
  name: string;
  email: string | null;
  role: Role;
  learnerId: number | null;
};

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export async function createSession(userId: number, role: Role) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db.prepare("INSERT INTO sessions (token_hash, user_id, role, expires_at) VALUES (?, ?, ?, ?)").run(
    hashToken(token),
    userId,
    role,
    expiresAt,
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.learner_id AS learnerId, s.expires_at AS expiresAt
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND u.active = 1`,
    )
    .get(hashToken(token)) as
    | { id: number; name: string; email: string | null; role: Role; learnerId: number | null; expiresAt: number }
    | undefined;

  if (!row) return null;
  if (row.expiresAt < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
    return null;
  }

  return { id: row.id, name: row.name, email: row.email, role: row.role, learnerId: row.learnerId };
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
  store.delete(SESSION_COOKIE);
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/admin/login");
  return user;
}

export async function requireLearner() {
  const user = await getSessionUser();
  if (!user || user.role !== "learner") redirect("/learner-portal");
  return user;
}

const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }
  if (entry.count >= max) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true, remaining: max - entry.count };
}

export function clearRateLimit(key: string) {
  attempts.delete(key);
}
