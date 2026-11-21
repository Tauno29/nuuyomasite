import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { hashSync } from "bcryptjs";
import { contentDefaults } from "./content";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, "nsss.db");

declare global {
  // eslint-disable-next-line no-var
  var __nsssDb: Database.Database | undefined;
}

export const db: Database.Database =
  globalThis.__nsssDb ??
  (() => {
    const instance = new Database(dbPath, { timeout: 15000 });
    instance.pragma("journal_mode = WAL");
    instance.pragma("foreign_keys = ON");
    return instance;
  })();

if (process.env.NODE_ENV !== "production") globalThis.__nsssDb = db;

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || `item-${Date.now()}`
  );
}

export function uniqueSlug(table: "news", base: string, excludeId?: number) {
  const stem = slugify(base);
  let candidate = stem;
  let n = 1;
  const stmt = db.prepare(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`);
  while (stmt.get(candidate, excludeId ?? 0)) {
    candidate = `${stem}-${++n}`;
  }
  return candidate;
}

function createSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin','learner')),
      name TEXT NOT NULL,
      learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
      active INTEGER NOT NULL DEFAULT 1,
      last_login_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS learners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      surname TEXT NOT NULL,
      grade TEXT NOT NULL DEFAULT 'Grade 8',
      class_name TEXT,
      email TEXT,
      phone TEXT,
      guardian_name TEXT,
      guardian_phone TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL,
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS values_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '⭐',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Announcement',
      link_label TEXT,
      link_url TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      pinned INTEGER NOT NULL DEFAULT 0,
      published_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'News',
      image_url TEXT,
      event_date TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Campus',
      image_url TEXT NOT NULL,
      caption TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      file_url TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      audience TEXT NOT NULL DEFAULT 'public' CHECK (audience IN ('public','learner','both')),
      grade TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      learner_id INTEGER NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
      term TEXT NOT NULL,
      summary TEXT NOT NULL,
      file_url TEXT,
      published INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      learner_first_name TEXT NOT NULL,
      learner_surname TEXT NOT NULL,
      date_of_birth TEXT,
      gender TEXT,
      grade TEXT NOT NULL,
      home_language TEXT,
      postal_address TEXT,
      guardian_name TEXT NOT NULL,
      guardian_phone TEXT NOT NULL,
      guardian_email TEXT,
      transport TEXT,
      boarding INTEGER NOT NULL DEFAULT 0,
      previous_school TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New','Reviewing','Accepted','Waiting list','Declined')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level TEXT NOT NULL DEFAULT 'Senior Secondary',
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL,
      label TEXT NOT NULL,
      amount TEXT NOT NULL,
      note TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity TEXT,
      detail TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_news_published ON news(published, created_at);
    CREATE INDEX IF NOT EXISTS idx_gallery_published ON gallery(published, sort_order);
    CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(published, pinned);
    CREATE INDEX IF NOT EXISTS idx_documents_audience ON documents(audience, published);
  `);
}

function seed() {
  const contentCount = db.prepare("SELECT COUNT(*) AS n FROM content").get() as { n: number };
  if (contentCount.n === 0) {
    const insert = db.prepare("INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)");
    const tx = db.transaction(() => {
      for (const [key, value] of Object.entries(contentDefaults)) insert.run(key, value);
    });
    tx();
  }

  const adminCount = db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").get() as { n: number };
  if (adminCount.n === 0) {
    const email = (process.env.ADMIN_EMAIL || "admin@nuuyomasss.na").toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "ChangeMe-NSSS-2026!";
    db.prepare(
      "INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, 'admin', ?)",
    ).run(email, hashSync(password, 12), "School Administrator");
  }

  // Learner accounts are created by an administrator (Admin → Learner Registry)
  // so that no account with a publicly known PIN is ever shipped.

  const statsCount = db.prepare("SELECT COUNT(*) AS n FROM stats").get() as { n: number };
  if (statsCount.n === 0) {
    const insert = db.prepare("INSERT INTO stats (value, label, sort_order) VALUES (?, ?, ?)");
    [
      ["8–12", "Grades Offered"],
      ["3", "School Terms"],
      ["English", "Medium of Instruction"],
      ["1985", "Year Established"],
    ].forEach(([value, label], i) => insert.run(value, label, i));
  }

  const valuesCount = db.prepare("SELECT COUNT(*) AS n FROM values_list").get() as { n: number };
  if (valuesCount.n === 0) {
    const insert = db.prepare("INSERT INTO values_list (title, description, icon, sort_order) VALUES (?, ?, ?, ?)");
    [
      ["Discipline", "We build responsible habits, punctuality and respect for self and others.", "🎯"],
      ["Academic Excellence", "We encourage every learner to work hard, ask questions and aim higher.", "📘"],
      ["Integrity", "We act honestly and fairly, in the classroom and beyond it.", "🤝"],
      ["Leadership", "We create opportunities for learners to serve, lead and take responsibility.", "🌱"],
      ["Innovation", "We prepare learners to adapt, solve problems and use technology responsibly.", "💡"],
      ["Community", "We value partnership with families and the Oshikuku community.", "🏡"],
    ].forEach(([title, description, icon], i) => insert.run(title, description, icon, i));
  }

  const subjectCount = db.prepare("SELECT COUNT(*) AS n FROM subjects").get() as { n: number };
  if (subjectCount.n === 0) {
    const insert = db.prepare("INSERT INTO subjects (name, level, description, sort_order) VALUES (?, ?, ?, ?)");
    [
      ["English", "Grades 8–12", "Language, literature, comprehension and communication skills."],
      ["Oshindonga / Oshikwanyama", "Grades 8–12", "First-language literacy, literature and cultural understanding."],
      ["Mathematics", "Grades 8–12", "Core numeracy, algebra, geometry and mathematical reasoning."],
      ["Physical Science", "Grades 10–12", "Physics and chemistry foundations for science and technology pathways."],
      ["Biology / Life Science", "Grades 10–12", "Living systems, health, ecology and scientific investigation."],
      ["Geography", "Grades 8–12", "Physical and human geography, maps, climate and development."],
      ["History", "Grades 8–12", "Namibian, African and world history with source-based skills."],
      ["Business Studies", "Grades 10–12", "Enterprise, management, finance and the business environment."],
      ["Accounting", "Grades 10–12", "Financial records, statements and sound money management."],
      ["Agriculture", "Grades 8–12", "Practical agriculture, food production and sustainable land use."],
      ["Computer Studies / ICT", "Grades 8–12", "Digital literacy, office applications and responsible technology use."],
      ["Life Skills", "Grades 8–12", "Personal development, health, citizenship and career planning."],
    ].forEach(([name, level, description], i) => insert.run(name, level, description, i));
  }

  const feeCount = db.prepare("SELECT COUNT(*) AS n FROM fees").get() as { n: number };
  if (feeCount.n === 0) {
    const insert = db.prepare("INSERT INTO fees (group_name, label, amount, note, sort_order) VALUES (?, ?, ?, ?, ?)");
    [
      ["School payments", "School registration fee", "TBC", "Confirm with the school office"],
      ["School payments", "School development fund", "TBC", "Confirm with the school office"],
      ["Boarding", "Boarding registration fee", "TBC", "Once-off · confirm with the school office"],
      ["Boarding", "Monthly boarding fee", "TBC", "Payable before the 7th of each month"],
      ["School items", "Uniform items", "TBC", "Available through the school"],
    ].forEach(([group, label, amount, note], i) => insert.run(group, label, amount, note, i));
  }

  const galleryCount = db.prepare("SELECT COUNT(*) AS n FROM gallery").get() as { n: number };
  if (galleryCount.n === 0) {
    const insert = db.prepare(
      "INSERT INTO gallery (title, category, image_url, caption, sort_order) VALUES (?, ?, ?, ?, ?)",
    );
    [
      ["School Campus", "Campus", "/assets/gallery/campus.webp", "A place to learn and grow."],
      ["Classroom Learning", "Classrooms", "/assets/gallery/classroom.webp", "Focused teaching and active participation."],
      ["Science Laboratory", "Academics", "/assets/gallery/science.webp", "Hands-on science investigation."],
      ["Library & Study", "Academics", "/assets/gallery/library.webp", "Quiet space for reading and revision."],
      ["Sports Field", "Sports", "/assets/gallery/sports.webp", "Teamwork, fitness and school spirit."],
      ["Football at Nuuyoma", "Sports", "/assets/gallery/football.webp", "Sport is part of school life."],
      ["Cultural Day", "Culture", "/assets/gallery/culture.webp", "Celebrating Namibian culture."],
      ["School Assembly", "Events", "/assets/gallery/assembly.webp", "Coming together as a school community."],
      ["Computer Practice", "Classrooms", "/assets/gallery/computer.webp", "Building digital skills for the future."],
    ].forEach(([title, category, image, caption], i) => insert.run(title, category, image, caption, i));
  }

  const newsCount = db.prepare("SELECT COUNT(*) AS n FROM news").get() as { n: number };
  if (newsCount.n === 0) {
    const insert = db.prepare(
      `INSERT INTO news (title, slug, excerpt, body, category, image_url, published, featured, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    );
    insert.run(
      "Welcome to the new Nuuyoma Senior Secondary School website",
      "welcome-to-the-new-nsss-website",
      "Explore our new online home for school news, admissions information, the gallery and the learner portal.",
      "We are pleased to launch the new Nuuyoma Senior Secondary School website.\n\nThe site brings school announcements, admissions information, our gallery and a secure learner portal together in one place. Parents and guardians can also send a message directly to the school office.\n\nThis is a placeholder news story and can be edited or removed from the admin dashboard.",
      "News",
      "/assets/gallery/campus.webp",
      1,
      new Date().toISOString(),
    );
    insert.run(
      "Admission information for the next academic year",
      "admission-information-next-academic-year",
      "The school office is preparing the admission information for the next academic year. Please confirm all dates and requirements directly with the school.",
      "Admission information for the next academic year is being finalised by the school office.\n\nPlease use the online application form to register your interest, or contact the school office for the official requirements, dates and fee schedule. This notice will be updated when the school confirms the details.",
      "Admissions",
      "/assets/gallery/classroom.webp",
      0,
      new Date(Date.now() - 86400000).toISOString(),
    );
    insert.run(
      "Examination notices and timetables",
      "examination-notices-and-timetables",
      "Examination timetables and notices will be published here as soon as they are released.",
      "Examination timetables, entry information and invigilation notices will be published on this page and in the announcements section as soon as they are released by the school or the Ministry of Education, Arts and Culture.\n\nLearners should also check the notice boards at school.",
      "Examinations",
      "/assets/gallery/science.webp",
      0,
      new Date(Date.now() - 172800000).toISOString(),
    );
  }

  const announcementCount = db.prepare("SELECT COUNT(*) AS n FROM announcements").get() as { n: number };
  if (announcementCount.n === 0) {
    const insert = db.prepare(
      `INSERT INTO announcements (title, body, category, link_label, link_url, published, pinned, published_at)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    );
    insert.run(
      "Welcome to the Nuuyoma Senior Secondary School website",
      "Our new website is live. Explore school information, the gallery and the secure learner portal. Announcements and notices will be published here throughout the year.",
      "General",
      "Visit the gallery",
      "/gallery",
      1,
      new Date().toISOString(),
    );
    insert.run(
      "Admissions: information for the next academic year",
      "The school office is finalising admission information for the next academic year. Please confirm requirements and dates directly with the office before submitting an application.",
      "Admissions",
      "Admissions information",
      "/admissions",
      0,
      new Date(Date.now() - 3600000).toISOString(),
    );
    insert.run(
      "Learner portal now available",
      "Learners can sign in with the Student ID and PIN issued by the school to view announcements, resources and published reports.",
      "Learner Portal",
      "Open the learner portal",
      "/learner-portal",
      0,
      new Date(Date.now() - 7200000).toISOString(),
    );
  }

  const documentCount = db.prepare("SELECT COUNT(*) AS n FROM documents").get() as { n: number };
  if (documentCount.n === 0) {
    db.prepare(
      "INSERT INTO documents (title, description, file_url, category, audience, published) VALUES (?, ?, ?, ?, ?, 1)",
    ).run(
      "Application checklist (placeholder)",
      "A general checklist created for this website. Replace it with the official school document once available.",
      "/api/application-form.pdf",
      "Admissions",
      "public",
    );
  }
}

function migrateLegacyImageUrls() {
  db.prepare("UPDATE gallery SET image_url = REPLACE(image_url, '.jpg', '.webp') WHERE image_url LIKE '/assets/gallery/%.jpg'").run();
  db.prepare("UPDATE news SET image_url = REPLACE(image_url, '.jpg', '.webp') WHERE image_url LIKE '/assets/gallery/%.jpg'").run();
  db.prepare("UPDATE content SET value = '/assets/principal-placeholder.webp' WHERE key = 'site.principal_photo' AND value = '/assets/principal-placeholder.jpg'").run();
}

function movePrivateUploads() {
  const publicDir = path.join(process.cwd(), "public", "uploads");
  const privateDir = path.join(process.cwd(), "data", "uploads");
  const rows = [
    ...db.prepare("SELECT file_url FROM documents WHERE audience = 'learner' AND file_url LIKE '/uploads/%'").all(),
    ...db.prepare("SELECT file_url FROM reports WHERE file_url LIKE '/uploads/%'").all(),
  ] as { file_url: string }[];
  if (rows.length === 0) return;
  fs.mkdirSync(privateDir, { recursive: true });
  const updateDocuments = db.prepare("UPDATE documents SET file_url = ? WHERE file_url = ?");
  const updateReports = db.prepare("UPDATE reports SET file_url = ? WHERE file_url = ?");
  for (const { file_url } of rows) {
    const name = file_url.slice("/uploads/".length);
    if (!/^[A-Za-z0-9._-]+$/.test(name)) continue;
    const source = path.join(publicDir, name);
    if (!fs.existsSync(source)) continue;
    fs.renameSync(source, path.join(privateDir, name));
    updateDocuments.run(`/api/files/${name}`, file_url);
    updateReports.run(`/api/files/${name}`, file_url);
  }
}

let initialised = false;
export function ensureDatabase() {
  if (initialised) return;
  createSchema();
  // Acquire a write lock before checking counts so concurrent build workers
  // cannot both insert the same seed rows.
  db.transaction(seed).immediate();
  migrateLegacyImageUrls();
  movePrivateUploads();
  initialised = true;
}

ensureDatabase();
