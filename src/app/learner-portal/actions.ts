"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit, clearRateLimit, createSession, destroySession, verifyPassword } from "@/lib/auth";

export type LoginState = { ok: boolean; message: string; errors?: Record<string, string> };

const loginSchema = z.object({
  student_id: z.string().trim().min(3, "Enter your Student ID.").max(40),
  pin: z.string().trim().min(4, "Enter your PIN.").max(100),
});

async function clientKey(prefix: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  return `${prefix}:${ip}`;
}

export async function learnerLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!errors[field]) errors[field] = issue.message;
    }
    return { ok: false, message: "Enter your Student ID and PIN.", errors };
  }

  const studentId = parsed.data.student_id.toUpperCase().replace(/\s+/g, "");
  const ipKey = await clientKey("learner-login");
  const idKey = `learner-login-id:${studentId}`;
  if (!checkRateLimit(ipKey, 8, 15 * 60 * 1000).allowed || !checkRateLimit(idKey, 8, 15 * 60 * 1000).allowed) {
    return { ok: false, message: "Too many sign-in attempts. Please wait 15 minutes and try again." };
  }

  const row = db
    .prepare(
      `SELECT u.id, u.password_hash AS passwordHash
       FROM users u JOIN learners l ON l.id = u.learner_id
       WHERE l.student_id = ? AND l.active = 1 AND u.active = 1 AND u.role = 'learner'`,
    )
    .get(studentId) as { id: number; passwordHash: string } | undefined;

  if (!row || !verifyPassword(parsed.data.pin, row.passwordHash)) {
    return {
      ok: false,
      message: "The Student ID or PIN you entered is not correct. Contact the school office if you need help.",
    };
  }

  clearRateLimit(idKey);
  await createSession(row.id, "learner");
  redirect("/learner-portal/dashboard");
}

export async function learnerLogout() {
  await destroySession();
  redirect("/learner-portal");
}
