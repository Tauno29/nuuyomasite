"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db, nowIso } from "@/lib/db";
import { checkRateLimit } from "@/lib/auth";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string> };

async function rateKey(prefix: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  return `${prefix}:${ip}`;
}

const applicationSchema = z.object({
  learner_first_name: z.string().trim().min(2, "Enter the learner's first name.").max(80),
  learner_surname: z.string().trim().min(2, "Enter the learner's surname.").max(80),
  date_of_birth: z.string().trim().optional().default(""),
  gender: z.string().trim().optional().default(""),
  grade: z.enum(["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"], {
    message: "Choose the grade being applied for.",
  }),
  home_language: z.string().trim().optional().default(""),
  postal_address: z.string().trim().optional().default(""),
  guardian_name: z.string().trim().min(2, "Enter the guardian's full name.").max(120),
  guardian_phone: z.string().trim().min(7, "Enter a contact number.").max(30),
  guardian_email: z.string().trim().email("Enter a valid email address.").max(160).or(z.literal("")),
  transport: z.string().trim().optional().default(""),
  boarding: z.string().optional().default("no"),
  previous_school: z.string().trim().optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
  consent: z.string().optional(),
  website: z.string().optional(),
});

export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  const key = await rateKey("apply");
  if (!checkRateLimit(key, 5, 60 * 60 * 1000).allowed) {
    return { ok: false, message: "Too many applications from this connection. Please try again later or contact the school office." };
  }

  const raw = Object.fromEntries(formData.entries());
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return { ok: true, message: "Application received." };
  }

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!errors[field]) errors[field] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields and try again.", errors };
  }

  if (raw.consent !== "on" && raw.consent !== "true") {
    return { ok: false, message: "Please confirm the declaration before submitting.", errors: { consent: "Confirmation is required." } };
  }

  const data = parsed.data;
  db.prepare(
    `INSERT INTO applications
      (learner_first_name, learner_surname, date_of_birth, gender, grade, home_language, postal_address,
       guardian_name, guardian_phone, guardian_email, transport, boarding, previous_school, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    data.learner_first_name,
    data.learner_surname,
    data.date_of_birth,
    data.gender,
    data.grade,
    data.home_language,
    data.postal_address,
    data.guardian_name,
    data.guardian_phone,
    data.guardian_email,
    data.transport,
    data.boarding === "yes" ? 1 : 0,
    data.previous_school,
    data.notes,
    nowIso(),
  );

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  return {
    ok: true,
    message:
      "Your application has been sent to the school office. This is not a confirmation of placement — the school will contact you after reviewing it.",
  };
}

const messageSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  phone: z.string().trim().max(30).optional().default(""),
  subject: z.string().trim().min(3, "Choose or enter a subject.").max(160),
  message: z.string().trim().min(10, "Please write a message of at least 10 characters.").max(4000),
  website: z.string().optional(),
});

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const key = await rateKey("contact");
  if (!checkRateLimit(key, 6, 60 * 60 * 1000).allowed) {
    return { ok: false, message: "Too many messages from this connection. Please try again later." };
  }

  const raw = Object.fromEntries(formData.entries());
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return { ok: true, message: "Message received." };
  }

  const parsed = messageSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!errors[field]) errors[field] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  const data = parsed.data;
  db.prepare(
    "INSERT INTO messages (name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(data.name, data.email, data.phone, data.subject, data.message, nowIso());

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return { ok: true, message: "Thank you. Your message has been sent to the school office." };
}

const subscribeSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(160),
});

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const key = await rateKey("subscribe");
  if (!checkRateLimit(key, 5, 60 * 60 * 1000).allowed) {
    return { ok: false, message: "Please try again later." };
  }
  const parsed = subscribeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email address." };
  }
  const email = parsed.data.email.toLowerCase();
  db.prepare("INSERT OR IGNORE INTO subscribers (email, created_at) VALUES (?, ?)").run(email, nowIso());
  return { ok: true, message: "You're on the list. Thank you for subscribing." };
}
