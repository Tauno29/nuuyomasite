import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Inbox,
  Mail,
  Megaphone,
  MessageSquare,
  Newspaper,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminCard, AdminPageHeader, Badge } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { dashboardCounts, formatDate, formatDateTime } from "@/lib/site";
import type { Application, Message } from "@/lib/site";

export const metadata = { title: "Overview" };

function count(sql: string) {
  return (db.prepare(sql).get() as { n: number }).n;
}

export default function AdminOverviewPage() {
  const counts = dashboardCounts();
  const viewsToday = count("SELECT COUNT(*) AS n FROM page_views WHERE date(created_at) = date('now')");
  const views7 = count("SELECT COUNT(*) AS n FROM page_views WHERE julianday(created_at) >= julianday('now','-6 days')");
  const viewsAll = count("SELECT COUNT(*) AS n FROM page_views");

  const recentApplications = db
    .prepare(
      `SELECT id, learner_first_name, learner_surname, grade, guardian_name, guardian_phone, status, created_at
       FROM applications ORDER BY created_at DESC LIMIT 5`,
    )
    .all() as Pick<Application, "id" | "learner_first_name" | "learner_surname" | "grade" | "guardian_name" | "guardian_phone" | "status" | "created_at">[];

  const recentMessages = db
    .prepare("SELECT id, name, email, subject, is_read, created_at FROM messages ORDER BY created_at DESC LIMIT 4")
    .all() as Pick<Message, "id" | "name" | "email" | "subject" | "is_read" | "created_at">[];

  const recentAnnouncements = db
    .prepare("SELECT id, title, category, published, published_at FROM announcements ORDER BY published_at DESC LIMIT 4")
    .all() as { id: number; title: string; category: string; published: number; published_at: string }[];

  const daily = db
    .prepare(
      `SELECT date(created_at) AS day, COUNT(*) AS n FROM page_views
       WHERE julianday(created_at) >= julianday('now','-6 days') GROUP BY day`,
    )
    .all() as { day: string; n: number }[];
  const dailyMap = new Map(daily.map((row) => [row.day, row.n]));
  const series = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: date.toLocaleDateString("en-GB", { weekday: "short" }), value: dailyMap.get(key) ?? 0 };
  });
  const peak = Math.max(1, ...series.map((point) => point.value));

  const topPages = db
    .prepare(
      `SELECT path, COUNT(*) AS n FROM page_views
       WHERE julianday(created_at) >= julianday('now','-29 days')
       GROUP BY path ORDER BY n DESC LIMIT 5`,
    )
    .all() as { path: string; n: number }[];
  const topMax = Math.max(1, ...topPages.map((row) => row.n));

  const summary = [
    {
      label: "New applications",
      value: counts.newApplications,
      hint: `${counts.applications} total`,
      icon: Inbox,
      href: "/admin/applications",
      tone: "bg-[#e9f4ff] text-[#0b4f8a]",
    },
    {
      label: "Unread messages",
      value: counts.unreadMessages,
      hint: `${counts.messages} total`,
      icon: Mail,
      href: "/admin/messages",
      tone: "bg-[#f5edff] text-[#7c3fc0]",
    },
    {
      label: "Active learners",
      value: counts.learners,
      hint: "Portal accounts",
      icon: Users,
      href: "/admin/learners",
      tone: "bg-[#e9f7ff] text-[#0d6db7]",
    },
    {
      label: "Page views (7 days)",
      value: views7,
      hint: `${viewsToday} today`,
      icon: Eye,
      href: "/admin",
      tone: "bg-[#e9faf1] text-[#0f8a55]",
    },
  ];

  const inventory = [
    { label: "Announcements", value: counts.announcements, sub: `${counts.publishedAnnouncements} live`, icon: Megaphone, href: "/admin/announcements" },
    { label: "News stories", value: counts.news, sub: "Published & drafts", icon: Newspaper, href: "/admin/news" },
    { label: "Gallery items", value: counts.gallery, sub: "Photographs", icon: ImageIcon, href: "/admin/gallery" },
    { label: "Documents", value: counts.documents, sub: "Public & portal", icon: FileText, href: "/admin/documents" },
    { label: "Subscribers", value: counts.subscribers, sub: "Newsletter", icon: MessageSquare, href: "/admin/messages" },
    { label: "Total views", value: viewsAll, sub: "All time", icon: BarChart3, href: "/admin" },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Overview"
        title="School console"
        body="A live snapshot of the school website, applications, learner portal and office inbox."
        actions={
          <>
            <Link href="/admin/export" className="inline-flex items-center gap-1.5 rounded-full border border-[#e0d6ce] bg-white px-4 py-2.5 text-xs font-bold text-[#475569] hover:border-[#0b4f8a]">
              <Download size={14} /> Export backup
            </Link>
            <Link href="/admin/announcements" className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#24384f]">
              <Plus size={14} /> New announcement
            </Link>
          </>
        }
      />

      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e9faf1] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#0f8a55]">
        <ShieldCheck size={12} /> Authenticated administrator · changes publish instantly
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group rounded-2xl border border-[#e9e0d8] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,.04)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,.08)]">
              <div className="flex items-start justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}>
                  <Icon size={18} />
                </span>
                <ArrowUpRight size={15} className="text-[#94a3b8] transition group-hover:text-[#0b4f8a]" />
              </div>
              <div className="display mt-3 text-3xl text-[#0f172a]">{card.value}</div>
              <div className="text-xs font-bold text-[#475569]">{card.label}</div>
              <div className="mt-0.5 text-[10px] font-semibold text-[#94a3b8]">{card.hint}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
        <AdminCard title="Website analytics" description="Page views are recorded from the public website only. Admin and portal pages are excluded.">
          <div className="flex items-end justify-between">
            <div>
              <div className="display text-3xl text-[#0f172a]">{views7}</div>
              <div className="text-[11px] font-semibold text-[#64748b]">views in the last 7 days</div>
            </div>
            <Badge tone="green"><Eye size={11} /> {viewsToday} today</Badge>
          </div>
          <div className="mt-6 flex h-32 items-end gap-2">
            {series.map((point) => (
              <div key={point.key} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[9px] font-bold text-[#64748b]">{point.value || ""}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#0d6db7]/60 to-[#0d6db7]"
                  style={{ height: `${Math.max(4, (point.value / peak) * 88)}px` }}
                  title={`${point.value} views`}
                />
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#94a3b8]">{point.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-[#e2e8f0] pt-4">
            <div className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#94a3b8]">Most viewed pages · last 30 days</div>
            <div className="mt-3 grid gap-2">
              {topPages.length === 0 ? (
                <p className="text-xs text-[#94a3b8]">No page views recorded yet. Visit the public website to start collecting analytics.</p>
              ) : (
                topPages.map((row) => (
                  <div key={row.path} className="flex items-center gap-3">
                    <span className="w-36 truncate text-[11px] font-semibold text-[#475569]">{row.path}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f5f9]">
                      <div className="h-full rounded-full bg-[#0d6db7]" style={{ width: `${(row.n / topMax) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right text-[10px] font-bold text-[#64748b]">{row.n}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard title="Applications" action={<Link href="/admin/applications" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">View all</Link>}>
            <div className="grid gap-2.5">
              {recentApplications.length === 0 ? (
                <p className="text-xs text-[#94a3b8]">No applications have been submitted yet.</p>
              ) : (
                recentApplications.map((application) => (
                  <Link key={application.id} href="/admin/applications" className="flex items-center gap-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3 transition hover:border-[#f2c4ad]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9f4ff] text-[10px] font-extrabold text-[#0b4f8a]">
                      {application.learner_first_name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-[#1e293b]">
                        {application.learner_first_name} {application.learner_surname}
                      </span>
                      <span className="block text-[10px] text-[#94a3b8]">{application.grade} · {formatDate(application.created_at, { day: "numeric", month: "short" })}</span>
                    </span>
                    <Badge tone={application.status === "New" ? "coral" : application.status === "Accepted" ? "green" : "grey"}>{application.status}</Badge>
                  </Link>
                ))
              )}
            </div>
          </AdminCard>

          <AdminCard title="Office inbox" action={<Link href="/admin/messages" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">Open inbox</Link>}>
            <div className="grid gap-2.5">
              {recentMessages.length === 0 ? (
                <p className="text-xs text-[#94a3b8]">No messages have been received yet.</p>
              ) : (
                recentMessages.map((message) => (
                  <Link key={message.id} href="/admin/messages" className="block rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3 transition hover:border-[#ded4cb]">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${message.is_read ? "bg-[#d9d2cc]" : "bg-[#0d6db7]"}`} />
                      <span className="truncate text-xs font-bold text-[#1e293b]">{message.subject}</span>
                      <span className="ml-auto shrink-0 text-[9px] font-semibold text-[#94a3b8]">{formatDateTime(message.created_at).split(",")[0]}</span>
                    </div>
                    <div className="mt-0.5 truncate pl-3.5 text-[10px] text-[#64748b]">{message.name} · {message.email}</div>
                  </Link>
                ))
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <AdminCard title="Content inventory" description="Everything published from this console appears on the public site immediately.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inventory.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className="group rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 transition hover:border-[#f2c4ad]">
                  <Icon size={16} className="text-[#0b4f8a]" />
                  <div className="display mt-2 text-2xl text-[#0f172a]">{item.value}</div>
                  <div className="text-[11px] font-bold text-[#475569]">{item.label}</div>
                  <div className="text-[9px] font-semibold uppercase tracking-wide text-[#94a3b8]">{item.sub}</div>
                </Link>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard title="Latest announcements" action={<Link href="/admin/announcements" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">Manage</Link>}>
          <div className="grid gap-2.5">
            {recentAnnouncements.length === 0 ? (
              <p className="text-xs text-[#94a3b8]">No announcements yet.</p>
            ) : (
              recentAnnouncements.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 rounded-lg border border-[#e2e8f0] p-3">
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.published ? "bg-[#0f8a55]" : "bg-[#d9a441]"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-xs font-bold leading-5 text-[#1e293b]">{item.title}</div>
                    <div className="text-[9px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                      {item.category} · {formatDate(item.published_at, { day: "numeric", month: "short" })}
                    </div>
                  </div>
                  <Badge tone={item.published ? "green" : "amber"}>{item.published ? "Live" : "Draft"}</Badge>
                </div>
              ))
            )}
          </div>
          <Link href="/admin/content" className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b4f8a] hover:underline">
            Edit website content <ArrowRight size={12} />
          </Link>
        </AdminCard>
      </div>
    </div>
  );
}
