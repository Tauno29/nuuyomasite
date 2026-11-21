"use server";

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db, nowIso, uniqueSlug } from "@/lib/db";
import {
  checkRateLimit,
  clearRateLimit,
  createSession,
  destroySession,
  hashPassword,
  requireAdmin,
  verifyPassword,
} from "@/lib/auth";
import { contentDefinitions } from "@/lib/content";
import type { FormState } from "@/lib/form";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function fail(message: string, errors?: Record<string, string>): FormState {
  return { ok: false, message, errors };
}

const done = (message: string): FormState => ({ ok: true, message });

function zodFail(error: z.ZodError, fallback = "Please check the highlighted fields."): FormState {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  const first = error.issues[0]?.message;
  return { ok: false, message: first || fallback, errors };
}

const s = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const bool = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return value === "on" || value === "1" || value === "true" || value === "yes" ? 1 : 0;
};
const num = (fd: FormData, key: string, fallback = 0) => {
  const value = Number(fd.get(key));
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
};
const idOf = (fd: FormData) => {
  const value = Number(fd.get("id"));
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : null;
};

function revalidatePublic(...paths: string[]) {
  for (const p of new Set(paths)) revalidatePath(p);
}

const PUBLIC_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PRIVATE_UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const PRIVATE_URL_PREFIX = "/api/files/";
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MAX_UPLOAD = 8 * 1024 * 1024;

function looksValid(buffer: Buffer, ext: string) {
  if (ext === ".jpg" || ext === ".jpeg") return buffer[0] === 0xff && buffer[1] === 0xd8;
  if (ext === ".png") return buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
  if (ext === ".gif") return buffer.subarray(0, 6).toString("ascii").startsWith("GIF8");
  if (ext === ".webp") return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  if (ext === ".pdf") return buffer.subarray(0, 4).toString("ascii") === "%PDF";
  return false;
}

async function storeUpload(value: FormDataEntryValue | null, allowPdf = false, privateFile = false): Promise<string | null> {
  if (!value || typeof value === "string" || value.size === 0) return null;
  if (value.size > MAX_UPLOAD) throw new Error("The file is larger than 8 MB. Please upload a smaller file.");
  const ext = path.extname(value.name).toLowerCase();
  const allowed = allowPdf ? (IMAGE_EXT.has(ext) || ext === ".pdf") : IMAGE_EXT.has(ext);
  if (!allowed) throw new Error(allowPdf ? "Upload a JPG, PNG, WEBP, GIF or PDF file." : "Upload a JPG, PNG, WEBP or GIF image.");
  const buffer = Buffer.from(await value.arrayBuffer());
  if (!looksValid(buffer, ext)) throw new Error("The uploaded file does not look like a valid " + ext.replace(".", "").toUpperCase() + " file.");
  const dir = privateFile ? PRIVATE_UPLOAD_DIR : PUBLIC_UPLOAD_DIR;
  fs.mkdirSync(dir, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${ext}`;
  fs.writeFileSync(path.join(dir, name), buffer);
  return privateFile ? `${PRIVATE_URL_PREFIX}${name}` : `/uploads/${name}`;
}

function removeUpload(url: string | null | undefined) {
  if (!url) return;
  const isPrivate = url.startsWith(PRIVATE_URL_PREFIX);
  if (!isPrivate && !url.startsWith("/uploads/")) return;
  const name = url.slice(isPrivate ? PRIVATE_URL_PREFIX.length : "/uploads/".length);
  if (!/^[A-Za-z0-9._-]+$/.test(name)) return;
  try {
    fs.unlinkSync(path.join(isPrivate ? PRIVATE_UPLOAD_DIR : PUBLIC_UPLOAD_DIR, name));
  } catch {
    /* file may already be gone */
  }
}

const optionalHref = z
  .string()
  .trim()
  .max(400)
  .refine((value) => value === "" || value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://"), {
    message: "Links must start with / or https://",
  });

const imageHref = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://"), {
    message: "Use an image path starting with / or a full https:// URL.",
  });

/* ------------------------------------------------------------------ */
/* authentication                                                      */
/* ------------------------------------------------------------------ */

export async function adminLogin(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({
      email: z.string().trim().email("Enter a valid email address."),
      password: z.string().min(1, "Enter your password."),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const key = `admin-login:${ip}`;
  if (!checkRateLimit(key, 6, 15 * 60 * 1000).allowed) {
    return fail("Too many sign-in attempts. Please wait 15 minutes and try again.");
  }

  const email = parsed.data.email.toLowerCase();
  const row = db
    .prepare("SELECT id, password_hash AS passwordHash FROM users WHERE email = ? AND role = 'admin' AND active = 1")
    .get(email) as { id: number; passwordHash: string } | undefined;

  if (!row || !verifyPassword(parsed.data.password, row.passwordHash)) {
    return fail("Email address or password is incorrect.");
  }

  clearRateLimit(key);
  db.prepare("UPDATE users SET last_login_at = ? WHERE id = ?").run(nowIso(), row.id);
  await createSession(row.id, "admin");
  redirect("/admin");
}

export async function adminLogout() {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* website content                                                     */
/* ------------------------------------------------------------------ */

export async function saveContent(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const stmt = db.prepare(
    `INSERT INTO content (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
  );
  const tx = db.transaction(() => {
    for (const def of contentDefinitions) {
      if (!formData.has(def.key)) continue;
      const value = String(formData.get(def.key) ?? "").trim().slice(0, 20000);
      stmt.run(def.key, value, nowIso());
    }
  });
  tx();
  revalidatePath("/", "layout");
  revalidatePath("/learner-portal", "layout");
  return done("Website content saved. Public pages now show the updated content.");
}

/* ------------------------------------------------------------------ */
/* announcements                                                       */
/* ------------------------------------------------------------------ */

const announcementSchema = z.object({
  title: z.string().trim().min(3, "Enter an announcement title.").max(160),
  body: z.string().trim().min(3, "Enter the announcement text.").max(5000),
  category: z.string().trim().min(1, "Enter a category.").max(60),
  link_label: z.string().trim().max(80).optional().default(""),
  link_url: optionalHref.optional().default(""),
});

export async function saveAnnouncement(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = announcementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  const id = idOf(formData);
  const data = parsed.data;
  const published = bool(formData, "published");
  const pinned = bool(formData, "pinned");

  if (id) {
    db.prepare(
      `UPDATE announcements SET title=?, body=?, category=?, link_label=?, link_url=?, published=?, pinned=? WHERE id=?`,
    ).run(data.title, data.body, data.category, data.link_label || null, data.link_url || null, published, pinned, id);
  } else {
    db.prepare(
      `INSERT INTO announcements (title, body, category, link_label, link_url, published, pinned, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(data.title, data.body, data.category, data.link_label || null, data.link_url || null, published, pinned, nowIso());
  }

  revalidatePublic("/", "/news", "/learner-portal/dashboard", "/admin", "/admin/announcements");
  return done(id ? "Announcement updated." : "Announcement created.");
}

export async function deleteAnnouncement(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Announcement not found.");
  db.prepare("DELETE FROM announcements WHERE id = ?").run(id);
  revalidatePublic("/", "/news", "/learner-portal/dashboard", "/admin", "/admin/announcements");
  return done("Announcement deleted.");
}

export async function toggleAnnouncement(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Announcement not found.");
  const row = db.prepare("SELECT published FROM announcements WHERE id = ?").get(id) as { published: number } | undefined;
  if (!row) return fail("Announcement not found.");
  db.prepare("UPDATE announcements SET published = ? WHERE id = ?").run(row.published ? 0 : 1, id);
  revalidatePublic("/", "/news", "/learner-portal/dashboard", "/admin/announcements");
  return done(row.published ? "Announcement moved to draft." : "Announcement published.");
}

/* ------------------------------------------------------------------ */
/* news                                                                */
/* ------------------------------------------------------------------ */

const newsSchema = z.object({
  title: z.string().trim().min(3, "Enter a story title.").max(180),
  slug: z.string().trim().max(100).optional().default(""),
  excerpt: z.string().trim().min(3, "Enter a short summary.").max(400),
  body: z.string().trim().min(3, "Enter the story.").max(30000),
  category: z.string().trim().min(1, "Enter a category.").max(60),
  image_url: imageHref.optional().default(""),
  event_date: z.string().trim().max(20).optional().default(""),
});

export async function saveNews(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = newsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  const id = idOf(formData);
  const data = parsed.data;

  let imageUrl = data.image_url;
  try {
    const uploaded = await storeUpload(formData.get("image_file"));
    if (uploaded) imageUrl = uploaded;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "The image could not be uploaded.");
  }

  const slug = uniqueSlug("news", data.slug || data.title, id ?? undefined);
  const published = bool(formData, "published");
  const featured = bool(formData, "featured");

  if (id) {
    const previous = db.prepare("SELECT image_url FROM news WHERE id = ?").get(id) as { image_url: string | null } | undefined;
    if (!previous) return fail("Story not found.");
    if (previous.image_url && previous.image_url !== imageUrl) removeUpload(previous.image_url);
    db.prepare(
      `UPDATE news SET title=?, slug=?, excerpt=?, body=?, category=?, image_url=?, event_date=?, published=?, featured=? WHERE id=?`,
    ).run(data.title, slug, data.excerpt, data.body, data.category, imageUrl || null, data.event_date || null, published, featured, id);
    revalidatePublic("/", "/news", `/news/${slug}`, "/admin/news");
    return done("Story updated.");
  }

  db.prepare(
    `INSERT INTO news (title, slug, excerpt, body, category, image_url, event_date, published, featured, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(data.title, slug, data.excerpt, data.body, data.category, imageUrl || null, data.event_date || null, published, featured, nowIso());
  revalidatePublic("/", "/news", `/news/${slug}`, "/admin", "/admin/news");
  return done("Story created.");
}

export async function deleteNews(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Story not found.");
  const row = db.prepare("SELECT slug, image_url FROM news WHERE id = ?").get(id) as { slug: string; image_url: string | null } | undefined;
  if (!row) return fail("Story not found.");
  db.prepare("DELETE FROM news WHERE id = ?").run(id);
  removeUpload(row.image_url);
  revalidatePublic("/", "/news", `/news/${row.slug}`, "/admin", "/admin/news");
  return done("Story deleted.");
}

/* ------------------------------------------------------------------ */
/* gallery                                                             */
/* ------------------------------------------------------------------ */

export async function addGallery(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z
    .object({
      title: z.string().trim().min(2, "Enter a title for the photograph.").max(140),
      category: z.string().trim().min(1, "Choose a category.").max(60),
      caption: z.string().trim().max(300).optional().default(""),
      image_url: imageHref.optional().default(""),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  const data = parsed.data;
  const published = bool(formData, "published");

  const files = formData.getAll("images").filter((file): file is File => file instanceof File && file.size > 0);
  const urls: string[] = [];
  try {
    for (const file of files) {
      const url = await storeUpload(file);
      if (url) urls.push(url);
    }
  } catch (error) {
    return fail(error instanceof Error ? error.message : "The image could not be uploaded.");
  }
  if (urls.length === 0 && data.image_url) urls.push(data.image_url);
  if (urls.length === 0) return fail("Choose at least one image file, or paste an image URL.");

  const maxOrder = (db.prepare("SELECT COALESCE(MAX(sort_order), 0) AS n FROM gallery").get() as { n: number }).n;
  const insert = db.prepare(
    "INSERT INTO gallery (title, category, image_url, caption, sort_order, published) VALUES (?, ?, ?, ?, ?, ?)",
  );
  urls.forEach((url, index) => {
    insert.run(urls.length > 1 ? `${data.title} ${index + 1}` : data.title, data.category, url, data.caption || null, maxOrder + index + 1, published);
  });

  revalidatePublic("/", "/gallery", "/admin", "/admin/gallery");
  return done(`${urls.length} photograph${urls.length === 1 ? "" : "s"} added${published ? " and published" : " as draft"}.`);
}

export async function updateGallery(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Photograph not found.");
  const parsed = z
    .object({
      title: z.string().trim().min(2, "Enter a title.").max(140),
      category: z.string().trim().min(1, "Choose a category.").max(60),
      caption: z.string().trim().max(300).optional().default(""),
      sort_order: z.coerce.number().int().min(0).max(9999).default(0),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  db.prepare("UPDATE gallery SET title=?, category=?, caption=?, sort_order=?, published=? WHERE id=?").run(
    parsed.data.title,
    parsed.data.category,
    parsed.data.caption || null,
    parsed.data.sort_order,
    bool(formData, "published"),
    id,
  );
  revalidatePublic("/", "/gallery", "/admin/gallery");
  return done("Photograph updated.");
}

export async function deleteGallery(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Photograph not found.");
  const row = db.prepare("SELECT image_url FROM gallery WHERE id = ?").get(id) as { image_url: string } | undefined;
  if (!row) return fail("Photograph not found.");
  db.prepare("DELETE FROM gallery WHERE id = ?").run(id);
  removeUpload(row.image_url);
  revalidatePublic("/", "/gallery", "/admin", "/admin/gallery");
  return done("Photograph deleted.");
}

/* ------------------------------------------------------------------ */
/* academics: subjects, stats, values                                  */
/* ------------------------------------------------------------------ */

const subjectSchema = z.object({
  name: z.string().trim().min(2, "Enter a subject name.").max(120),
  level: z.string().trim().min(1, "Enter the grade range.").max(60),
  description: z.string().trim().max(400).optional().default(""),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export async function saveSubject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = subjectSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  const id = idOf(formData);
  if (id) {
    db.prepare("UPDATE subjects SET name=?, level=?, description=?, sort_order=? WHERE id=?").run(
      parsed.data.name,
      parsed.data.level,
      parsed.data.description || null,
      parsed.data.sort_order,
      id,
    );
  } else {
    db.prepare("INSERT INTO subjects (name, level, description, sort_order) VALUES (?, ?, ?, ?)").run(
      parsed.data.name,
      parsed.data.level,
      parsed.data.description || null,
      parsed.data.sort_order,
    );
  }
  revalidatePublic("/academics", "/admin/academics");
  return done(id ? "Subject updated." : "Subject added.");
}

export async function deleteSubject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Subject not found.");
  db.prepare("DELETE FROM subjects WHERE id = ?").run(id);
  revalidatePublic("/academics", "/admin/academics");
  return done("Subject removed.");
}

const statSchema = z.object({
  value: z.string().trim().min(1, "Enter a value.").max(40),
  label: z.string().trim().min(1, "Enter a label.").max(80),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export async function saveStat(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = statSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  const id = idOf(formData);
  if (id) {
    db.prepare("UPDATE stats SET value=?, label=?, sort_order=? WHERE id=?").run(parsed.data.value, parsed.data.label, parsed.data.sort_order, id);
  } else {
    db.prepare("INSERT INTO stats (value, label, sort_order) VALUES (?, ?, ?)").run(parsed.data.value, parsed.data.label, parsed.data.sort_order);
  }
  revalidatePublic("/", "/about", "/admin/academics");
  return done(id ? "Statistic updated." : "Statistic added.");
}

export async function deleteStat(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Statistic not found.");
  db.prepare("DELETE FROM stats WHERE id = ?").run(id);
  revalidatePublic("/", "/about", "/admin/academics");
  return done("Statistic removed.");
}

const valueSchema = z.object({
  title: z.string().trim().min(2, "Enter a value title.").max(80),
  description: z.string().trim().min(3, "Enter a description.").max(300),
  icon: z.string().trim().min(1, "Enter an icon or emoji.").max(8),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export async function saveValue(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = valueSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  const id = idOf(formData);
  if (id) {
    db.prepare("UPDATE values_list SET title=?, description=?, icon=?, sort_order=? WHERE id=?").run(
      parsed.data.title,
      parsed.data.description,
      parsed.data.icon,
      parsed.data.sort_order,
      id,
    );
  } else {
    db.prepare("INSERT INTO values_list (title, description, icon, sort_order) VALUES (?, ?, ?, ?)").run(
      parsed.data.title,
      parsed.data.description,
      parsed.data.icon,
      parsed.data.sort_order,
    );
  }
  revalidatePublic("/", "/about", "/admin/academics");
  return done(id ? "School value updated." : "School value added.");
}

export async function deleteValue(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Value not found.");
  db.prepare("DELETE FROM values_list WHERE id = ?").run(id);
  revalidatePublic("/", "/about", "/admin/academics");
  return done("School value removed.");
}

/* ------------------------------------------------------------------ */
/* applications                                                        */
/* ------------------------------------------------------------------ */

const applicationStatuses = ["New", "Reviewing", "Accepted", "Waiting list", "Declined"] as const;

export async function updateApplicationStatus(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  const parsed = z.enum(applicationStatuses).safeParse(s(formData, "status"));
  if (!id || !parsed.success) return fail("Choose a valid application status.");
  db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(parsed.data, id);
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  return done(`Application marked as ${parsed.data}.`);
}

export async function deleteApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Application not found.");
  db.prepare("DELETE FROM applications WHERE id = ?").run(id);
  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  return done("Application deleted.");
}

/* ------------------------------------------------------------------ */
/* learners                                                            */
/* ------------------------------------------------------------------ */

const grades = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"] as const;

export async function saveLearner(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z
    .object({
      student_id: z.string().trim().min(3, "Enter a Student ID.").max(40),
      first_name: z.string().trim().min(2, "Enter the learner's first name.").max(80),
      surname: z.string().trim().min(2, "Enter the learner's surname.").max(80),
      grade: z.enum(grades, { message: "Choose a grade." }),
      class_name: z.string().trim().max(40).optional().default(""),
      email: z.string().trim().max(160).optional().default(""),
      phone: z.string().trim().max(30).optional().default(""),
      guardian_name: z.string().trim().max(120).optional().default(""),
      guardian_phone: z.string().trim().max(30).optional().default(""),
      notes: z.string().trim().max(1000).optional().default(""),
      pin: z.string().trim().max(100).optional().default(""),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);

  const data = parsed.data;
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return fail("Enter a valid email address, or leave it blank.");
  const studentId = data.student_id.toUpperCase().replace(/\s+/g, "");
  const id = idOf(formData);
  const active = bool(formData, "active");

  try {
    if (!id) {
      if (data.pin.length < 6) return fail("Set a PIN of at least 6 characters for the new learner.");
      const result = db
        .prepare(
          `INSERT INTO learners (student_id, first_name, surname, grade, class_name, email, phone, guardian_name, guardian_phone, active, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(studentId, data.first_name, data.surname, data.grade, data.class_name || null, data.email || null, data.phone || null, data.guardian_name || null, data.guardian_phone || null, active, data.notes || null);
      const learnerId = Number(result.lastInsertRowid);
      db.prepare(
        `INSERT INTO users (email, password_hash, role, name, learner_id) VALUES (?, ?, 'learner', ?, ?)`,
      ).run(data.email || null, hashPassword(data.pin), `${data.first_name} ${data.surname}`, learnerId);
      revalidatePath("/admin/learners");
      return done(`Learner ${studentId} created. Share the Student ID and PIN with the learner securely.`);
    }

    const existing = db.prepare("SELECT id FROM learners WHERE id = ?").get(id) as { id: number } | undefined;
    if (!existing) return fail("Learner not found.");
    const user = db.prepare("SELECT id FROM users WHERE learner_id = ?").get(id) as { id: number } | undefined;
    if (!user && data.pin.length < 6) return fail("This learner has no portal login. Set a PIN to create one.");

    db.transaction(() => {
      db.prepare(
        `UPDATE learners SET student_id=?, first_name=?, surname=?, grade=?, class_name=?, email=?, phone=?, guardian_name=?, guardian_phone=?, active=?, notes=? WHERE id=?`,
      ).run(studentId, data.first_name, data.surname, data.grade, data.class_name || null, data.email || null, data.phone || null, data.guardian_name || null, data.guardian_phone || null, active, data.notes || null, id);

      if (user) {
        db.prepare("UPDATE users SET email=?, name=?, active=? WHERE id=?").run(
          data.email || null,
          `${data.first_name} ${data.surname}`,
          active,
          user.id,
        );
        if (data.pin) {
          if (data.pin.length < 6) throw new Error("PIN must be at least 6 characters.");
          db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(hashPassword(data.pin), user.id);
          db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id);
        }
      } else {
        db.prepare(
          `INSERT INTO users (email, password_hash, role, name, learner_id) VALUES (?, ?, 'learner', ?, ?)`,
        ).run(data.email || null, hashPassword(data.pin), `${data.first_name} ${data.surname}`, id);
      }
    })();

    revalidatePath("/admin/learners");
    revalidatePath("/learner-portal/dashboard");
    return done("Learner record updated.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "The learner could not be saved.";
    if (message.includes("UNIQUE") && message.includes("student_id")) return fail("That Student ID is already in use.");
    if (message.includes("UNIQUE") && message.includes("email")) return fail("That email address is already linked to another account.");
    return fail(message);
  }
}

export async function resetLearnerPin(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  const pin = s(formData, "pin");
  if (!id) return fail("Learner not found.");
  if (pin.length < 6) return fail("The new PIN must be at least 6 characters.");
  const user = db.prepare("SELECT id FROM users WHERE learner_id = ?").get(id) as { id: number } | undefined;
  if (!user) return fail("This learner has no portal account yet.");
  db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(hashPassword(pin), user.id);
  db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id);
  revalidatePath("/admin/learners");
  return done("PIN reset. Any active sessions for this learner were signed out.");
}

export async function deleteLearner(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Learner not found.");
  db.prepare("DELETE FROM learners WHERE id = ?").run(id);
  revalidatePath("/admin/learners");
  revalidatePath("/admin");
  return done("Learner and portal account deleted.");
}

export async function addReport(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const learnerId = Number(formData.get("learner_id"));
  const parsed = z
    .object({
      term: z.string().trim().min(2, "Enter the term.").max(40),
      summary: z.string().trim().min(3, "Enter a summary.").max(4000),
      file_url: imageHref.optional().default(""),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  if (!Number.isFinite(learnerId) || learnerId <= 0) return fail("Learner not found.");

  let fileUrl = parsed.data.file_url;
  try {
    const uploaded = await storeUpload(formData.get("file"), true, true);
    if (uploaded) fileUrl = uploaded;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "The report file could not be uploaded.");
  }
  if (!fileUrl) return fail("Upload a report file or paste a document URL.");

  db.prepare("INSERT INTO reports (learner_id, term, summary, file_url, published, updated_at) VALUES (?, ?, ?, ?, ?, ?)").run(
    learnerId,
    parsed.data.term,
    parsed.data.summary,
    fileUrl,
    bool(formData, "published"),
    nowIso(),
  );
  revalidatePath(`/admin/learners/${learnerId}`);
  revalidatePath("/learner-portal/dashboard");
  return done("Report published to the learner portal.");
}

export async function deleteReport(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Report not found.");
  const row = db.prepare("SELECT file_url FROM reports WHERE id = ?").get(id) as { file_url: string | null } | undefined;
  if (!row) return fail("Report not found.");
  db.prepare("DELETE FROM reports WHERE id = ?").run(id);
  removeUpload(row.file_url);
  revalidatePath("/admin/learners");
  revalidatePath("/learner-portal/dashboard");
  return done("Report deleted.");
}

/* ------------------------------------------------------------------ */
/* documents                                                           */
/* ------------------------------------------------------------------ */

export async function saveDocument(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z
    .object({
      title: z.string().trim().min(2, "Enter a document title.").max(160),
      description: z.string().trim().max(400).optional().default(""),
      category: z.string().trim().min(1, "Enter a category.").max(60),
      audience: z.enum(["public", "learner", "both"], { message: "Choose an audience." }),
      grade: z.enum(["", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]).optional().default(""),
      file_url: imageHref.optional().default(""),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  const id = idOf(formData);
  const data = parsed.data;

  let fileUrl = data.file_url;
  try {
    const uploaded = await storeUpload(formData.get("file"), true, true);
    if (uploaded) fileUrl = uploaded;
  } catch (error) {
    return fail(error instanceof Error ? error.message : "The document could not be uploaded.");
  }

  if (id) {
    const previous = db.prepare("SELECT file_url FROM documents WHERE id = ?").get(id) as { file_url: string } | undefined;
    if (!previous) return fail("Document not found.");
    if (previous.file_url && previous.file_url !== fileUrl) removeUpload(previous.file_url);
    db.prepare(
      "UPDATE documents SET title=?, description=?, category=?, audience=?, grade=?, file_url=?, published=? WHERE id=?",
    ).run(data.title, data.description || null, data.category, data.audience, data.grade || null, fileUrl, bool(formData, "published"), id);
    revalidatePublic("/admissions", "/learner-portal/dashboard", "/admin/documents");
    return done("Document updated.");
  }

  if (!fileUrl) return fail("Upload a file or paste a document URL.");
  db.prepare(
    "INSERT INTO documents (title, description, category, audience, grade, file_url, published, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(data.title, data.description || null, data.category, data.audience, data.grade || null, fileUrl, bool(formData, "published"), nowIso());
  revalidatePublic("/admissions", "/learner-portal/dashboard", "/admin/documents");
  return done("Document added.");
}

export async function deleteDocument(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Document not found.");
  const row = db.prepare("SELECT file_url FROM documents WHERE id = ?").get(id) as { file_url: string } | undefined;
  if (!row) return fail("Document not found.");
  db.prepare("DELETE FROM documents WHERE id = ?").run(id);
  removeUpload(row.file_url);
  revalidatePublic("/admissions", "/learner-portal/dashboard", "/admin/documents");
  return done("Document deleted.");
}

export async function toggleDocument(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Document not found.");
  const row = db.prepare("SELECT published FROM documents WHERE id = ?").get(id) as { published: number } | undefined;
  if (!row) return fail("Document not found.");
  db.prepare("UPDATE documents SET published = ? WHERE id = ?").run(row.published ? 0 : 1, id);
  revalidatePublic("/admissions", "/learner-portal/dashboard", "/admin/documents");
  return done(row.published ? "Document hidden from the website." : "Document published.");
}

/* ------------------------------------------------------------------ */
/* messages                                                            */
/* ------------------------------------------------------------------ */

export async function setMessageRead(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Message not found.");
  db.prepare("UPDATE messages SET is_read = ? WHERE id = ?").run(bool(formData, "read"), id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return done("Message updated.");
}

export async function deleteMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Message not found.");
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return done("Message deleted.");
}

/* ------------------------------------------------------------------ */
/* fees                                                                */
/* ------------------------------------------------------------------ */

export async function saveFee(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z
    .object({
      group_name: z.string().trim().min(2, "Enter a fee group.").max(80),
      label: z.string().trim().min(2, "Enter a fee label.").max(120),
      amount: z.string().trim().min(1, "Enter an amount or TBC.").max(40),
      note: z.string().trim().max(200).optional().default(""),
      sort_order: z.coerce.number().int().min(0).max(9999).default(0),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);
  const id = idOf(formData);
  if (id) {
    db.prepare("UPDATE fees SET group_name=?, label=?, amount=?, note=?, sort_order=? WHERE id=?").run(
      parsed.data.group_name,
      parsed.data.label,
      parsed.data.amount,
      parsed.data.note || null,
      parsed.data.sort_order,
      id,
    );
  } else {
    db.prepare("INSERT INTO fees (group_name, label, amount, note, sort_order) VALUES (?, ?, ?, ?, ?)").run(
      parsed.data.group_name,
      parsed.data.label,
      parsed.data.amount,
      parsed.data.note || null,
      parsed.data.sort_order,
    );
  }
  revalidatePublic("/fees", "/boarding", "/admin/fees");
  return done(id ? "Fee updated." : "Fee added.");
}

export async function deleteFee(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return fail("Fee not found.");
  db.prepare("DELETE FROM fees WHERE id = ?").run(id);
  revalidatePublic("/fees", "/boarding", "/admin/fees");
  return done("Fee removed.");
}

/* ------------------------------------------------------------------ */
/* settings                                                            */
/* ------------------------------------------------------------------ */

export async function updateAdminAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = z
    .object({
      name: z.string().trim().min(2, "Enter the administrator name.").max(120),
      email: z.string().trim().toLowerCase().email("Enter a valid email address."),
      current_password: z.string().min(1, "Enter your current password."),
      new_password: z.string().max(200).optional().default(""),
      confirm_password: z.string().optional().default(""),
    })
    .safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return zodFail(parsed.error);

  if (parsed.data.new_password && parsed.data.new_password.length < 10) {
    return fail("The new password must be at least 10 characters.");
  }
  if (parsed.data.new_password && parsed.data.new_password !== parsed.data.confirm_password) {
    return fail("The new passwords do not match.");
  }

  const row = db.prepare("SELECT password_hash AS passwordHash FROM users WHERE id = ?").get(admin.id) as { passwordHash: string } | undefined;
  if (!row || !verifyPassword(parsed.data.current_password, row.passwordHash)) {
    return fail("Your current password is not correct.");
  }

  const passwordHash = parsed.data.new_password ? hashPassword(parsed.data.new_password) : row.passwordHash;
  try {
    db.prepare("UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?").run(
      parsed.data.name,
      parsed.data.email,
      passwordHash,
      admin.id,
    );
  } catch {
    return fail("That email address is already in use.");
  }

  const changed = parsed.data.new_password ? "email and password" : "email";
  return done(`Administrator account ${changed} updated.`);
}
