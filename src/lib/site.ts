import "server-only";
import { db } from "./db";
import { contentDefaults } from "./content";

export type Stat = { id: number; value: string; label: string; sort_order: number };
export type SchoolValue = { id: number; title: string; description: string; icon: string; sort_order: number };
export type Subject = { id: number; name: string; level: string; description: string; sort_order: number };
export type FeeItem = { id: number; group_name: string; label: string; amount: string; note: string; sort_order: number };
export type Announcement = {
  id: number;
  title: string;
  body: string;
  category: string;
  link_label: string | null;
  link_url: string | null;
  pinned: number;
  published: number;
  published_at: string;
};
export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  image_url: string | null;
  event_date: string | null;
  featured: number;
  published: number;
  created_at: string;
};
export type GalleryItem = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  published: number;
};
export type DocumentItem = {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  category: string;
  audience: "public" | "learner" | "both";
  grade: string | null;
  published: number;
  created_at: string;
};
export type Learner = {
  id: number;
  student_id: string;
  first_name: string;
  surname: string;
  grade: string;
  class_name: string | null;
  email: string | null;
  phone: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  active: number;
  notes: string | null;
  created_at: string;
};
export type Report = {
  id: number;
  learner_id: number;
  term: string;
  summary: string;
  file_url: string | null;
  published: number;
  updated_at: string;
};
export type Application = {
  id: number;
  learner_first_name: string;
  learner_surname: string;
  date_of_birth: string | null;
  gender: string | null;
  grade: string;
  home_language: string | null;
  postal_address: string | null;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string | null;
  transport: string | null;
  boarding: number;
  previous_school: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};
export type Message = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
};

export function getContent(): Record<string, string> {
  const rows = db.prepare("SELECT key, value FROM content").all() as { key: string; value: string }[];
  const map: Record<string, string> = { ...contentDefaults };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export function getContentValue(key: string) {
  const row = db.prepare("SELECT value FROM content WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value ?? contentDefaults[key] ?? "";
}

export function getStats(): Stat[] {
  return db.prepare("SELECT id, value, label, sort_order FROM stats ORDER BY sort_order, id").all() as Stat[];
}

export function getValues(): SchoolValue[] {
  return db
    .prepare("SELECT id, title, description, icon, sort_order FROM values_list ORDER BY sort_order, id")
    .all() as SchoolValue[];
}

export function getSubjects(): Subject[] {
  return db
    .prepare("SELECT id, name, level, description, sort_order FROM subjects ORDER BY sort_order, id")
    .all() as Subject[];
}

export function getFees(): FeeItem[] {
  return db
    .prepare("SELECT id, group_name, label, amount, note, sort_order FROM fees ORDER BY sort_order, id")
    .all() as FeeItem[];
}

export function getAnnouncements(limit?: number, includeDrafts = false): Announcement[] {
  const sql = `SELECT id, title, body, category, link_label, link_url, pinned, published, published_at
    FROM announcements ${includeDrafts ? "" : "WHERE published = 1"}
    ORDER BY pinned DESC, published_at DESC ${limit ? "LIMIT ?" : ""}`;
  return (limit ? db.prepare(sql).all(limit) : db.prepare(sql).all()) as Announcement[];
}

export function getNews(limit?: number, includeDrafts = false): NewsItem[] {
  const sql = `SELECT id, title, slug, excerpt, body, category, image_url, event_date, featured, published, created_at
    FROM news ${includeDrafts ? "" : "WHERE published = 1"}
    ORDER BY featured DESC, COALESCE(event_date, created_at) DESC ${limit ? "LIMIT ?" : ""}`;
  return (limit ? db.prepare(sql).all(limit) : db.prepare(sql).all()) as NewsItem[];
}

export function getNewsBySlug(slug: string, includeDrafts = false): NewsItem | undefined {
  return db
    .prepare(
      `SELECT id, title, slug, excerpt, body, category, image_url, event_date, featured, published, created_at
       FROM news WHERE slug = ? ${includeDrafts ? "" : "AND published = 1"}`,
    )
    .get(slug) as NewsItem | undefined;
}

export function getGallery(includeDrafts = false): GalleryItem[] {
  return db
    .prepare(
      `SELECT id, title, category, image_url, caption, sort_order, published FROM gallery
       ${includeDrafts ? "" : "WHERE published = 1"} ORDER BY sort_order, id`,
    )
    .all() as GalleryItem[];
}

export function getGalleryCategories(): string[] {
  const rows = db
    .prepare("SELECT DISTINCT category FROM gallery WHERE published = 1 ORDER BY category")
    .all() as { category: string }[];
  return rows.map((r) => r.category);
}

export function getPublicDocuments(): DocumentItem[] {
  return db
    .prepare(
      `SELECT id, title, description, file_url, category, audience, grade, published, created_at FROM documents
       WHERE published = 1 AND audience IN ('public','both') ORDER BY created_at DESC`,
    )
    .all() as DocumentItem[];
}

export function getLearnerDocuments(grade: string): DocumentItem[] {
  return db
    .prepare(
      `SELECT id, title, description, file_url, category, audience, grade, published, created_at FROM documents
       WHERE published = 1 AND audience IN ('learner','both') AND (grade IS NULL OR grade = '' OR grade = ?)
       ORDER BY created_at DESC`,
    )
    .all(grade) as DocumentItem[];
}

export function getLearnerById(id: number): Learner | undefined {
  return db.prepare("SELECT * FROM learners WHERE id = ?").get(id) as Learner | undefined;
}

export function getLearnerByUserId(userId: number): Learner | undefined {
  return db
    .prepare(
      `SELECT l.* FROM learners l JOIN users u ON u.learner_id = l.id WHERE u.id = ? AND l.active = 1`,
    )
    .get(userId) as Learner | undefined;
}

export function getReports(learnerId: number, includeDrafts = false): Report[] {
  return db
    .prepare(
      `SELECT id, learner_id, term, summary, file_url, published, updated_at FROM reports
       WHERE learner_id = ? ${includeDrafts ? "" : "AND published = 1"} ORDER BY term, id`,
    )
    .all(learnerId) as Report[];
}

export function getLearnerAnnouncements(limit = 6): Announcement[] {
  return getAnnouncements(limit);
}

export function formatDate(value: string | null | undefined, opts?: Intl.DateTimeFormatOptions) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", opts ?? { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T") + "Z");
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseLines(value: string | undefined | null): string[] {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitStat(value: string) {
  return value;
}

export function dashboardCounts() {
  const one = <T>(sql: string, ...args: unknown[]) =>
    (db.prepare(sql).get(...args) as T);
  return {
    announcements: one<{ n: number }>("SELECT COUNT(*) AS n FROM announcements").n,
    publishedAnnouncements: one<{ n: number }>("SELECT COUNT(*) AS n FROM announcements WHERE published = 1").n,
    news: one<{ n: number }>("SELECT COUNT(*) AS n FROM news").n,
    gallery: one<{ n: number }>("SELECT COUNT(*) AS n FROM gallery").n,
    learners: one<{ n: number }>("SELECT COUNT(*) AS n FROM learners WHERE active = 1").n,
    applications: one<{ n: number }>("SELECT COUNT(*) AS n FROM applications").n,
    newApplications: one<{ n: number }>("SELECT COUNT(*) AS n FROM applications WHERE status = 'New'").n,
    messages: one<{ n: number }>("SELECT COUNT(*) AS n FROM messages").n,
    unreadMessages: one<{ n: number }>("SELECT COUNT(*) AS n FROM messages WHERE is_read = 0").n,
    documents: one<{ n: number }>("SELECT COUNT(*) AS n FROM documents").n,
    subscribers: one<{ n: number }>("SELECT COUNT(*) AS n FROM subscribers").n,
  };
}
