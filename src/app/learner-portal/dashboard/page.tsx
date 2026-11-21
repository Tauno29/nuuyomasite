import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  BookOpen,
  CalendarDays,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Pin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { requireLearner } from "@/lib/auth";
import {
  formatDate,
  getAnnouncements,
  getContent,
  getLearnerByUserId,
  getLearnerDocuments,
  getReports,
} from "@/lib/site";

export const metadata = { title: "Dashboard" };

export default async function LearnerDashboardPage() {
  const user = await requireLearner();
  const learner = getLearnerByUserId(user.id);

  if (!learner) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <div className="rounded-2xl border border-[#dbeafe] bg-white p-8 text-center">
          <h1 className="display text-2xl text-[#0f172a]">Account not linked</h1>
          <p className="mt-2 text-sm text-[#64748b]">
            Your portal account is not linked to a learner record. Please contact the school office.
          </p>
        </div>
      </div>
    );
  }

  const content = getContent();
  const announcements = getAnnouncements(5);
  const reports = getReports(learner.id);
  const resources = getLearnerDocuments(learner.grade);

  const summary = [
    [Megaphone, String(announcements.length), "School notices", "#0d6db7", "#e9f4ff"],
    [BookOpen, String(resources.length), "Learning resources", "#0d6db7", "#e9f7ff"],
    [FileText, String(reports.length), "Published reports", "#9755ec", "#f5edff"],
    [GraduationCap, learner.grade, "Current grade", "#08a86b", "#e9faf1"],
  ] as const;

  return (
    <div className="px-5 py-10">
      <div className="mx-auto max-w-[1160px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Learner Dashboard</div>
            <h1 className="display mt-2 text-4xl text-[#0f172a] sm:text-5xl">Hello, {learner.first_name}.</h1>
            <p className="mt-2 text-sm text-[#64748b]">
              Your school notices, resources and published reports in one secure place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="pill inline-flex items-center gap-1.5 bg-white px-3.5 py-2 text-[11px] font-bold text-[#475569] shadow-sm">
              <UserRound size={13} className="text-[#0b4f8a]" /> {learner.student_id}
            </span>
            <span className="pill inline-flex items-center gap-1.5 bg-white px-3.5 py-2 text-[11px] font-bold text-[#475569] shadow-sm">
              <GraduationCap size={13} className="text-[#0d6db7]" /> {learner.grade}
              {learner.class_name ? ` · ${learner.class_name}` : ""}
            </span>
            <span className="pill inline-flex items-center gap-1.5 bg-[#e9faf1] px-3.5 py-2 text-[11px] font-bold text-[#0f8a55]">
              <ShieldCheck size={13} /> Active
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map(([Icon, value, label, color, bg]) => (
            <div key={label} className="rounded-[1.2rem] border border-[#e2e8f0] bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,.04)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: bg, color }}>
                <Icon size={18} />
              </span>
              <div className="display mt-3 text-2xl text-[#0f172a]">{value}</div>
              <div className="text-xs font-semibold text-[#64748b]">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.35fr_.85fr]">
          <div className="grid gap-6">
            {/* ANNOUNCEMENTS */}
            <section className="rounded-[1.5rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,.05)]">
              <div className="flex items-center justify-between">
                <h2 className="display flex items-center gap-2 text-2xl text-[#0f172a]">
                  <BellRing size={19} className="text-[#0d6db7]" /> School announcements
                </h2>
                <Link href="/news" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">School news</Link>
              </div>
              <div className="mt-5 grid gap-3">
                {announcements.length === 0 ? (
                  <p className="rounded-xl bg-[#f8fafc] p-5 text-sm text-[#64748b]">No announcements have been published yet.</p>
                ) : (
                  announcements.map((item) => (
                    <article key={item.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#0b4f8a]">
                        {item.pinned ? <Pin size={11} /> : null}
                        <span className="rounded-full bg-white px-2 py-0.5">{item.category}</span>
                        <span className="ml-auto font-semibold text-[#94a3b8]">{formatDate(item.published_at, { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <h3 className="mt-2 text-sm font-bold leading-5 text-[#1e293b]">{item.title}</h3>
                      <p className="mt-1 whitespace-pre-line text-xs leading-5 text-[#64748b]">{item.body}</p>
                      {item.link_url && item.link_label && (
                        <Link href={item.link_url} className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b4f8a]">
                          {item.link_label} <ArrowRight size={12} />
                        </Link>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>

            {/* REPORTS */}
            <section className="rounded-[1.5rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,.05)]">
              <h2 className="display flex items-center gap-2 text-2xl text-[#0f172a]">
                <FileText size={19} className="text-[#9755ec]" /> My term reports
              </h2>
              <div className="mt-5 grid gap-3">
                {reports.length === 0 ? (
                  <p className="rounded-xl bg-[#f8fafc] p-5 text-sm text-[#64748b]">
                    No reports have been published for your account yet. Reports appear here when the school publishes them.
                  </p>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f5edff] text-[#7c3fc0]">
                        <FileText size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-[#1e293b]">{report.term} report</div>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#64748b]">{report.summary}</p>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[.1em] text-[#94a3b8]">
                          <CalendarDays size={11} /> Updated {formatDate(report.updated_at)}
                        </div>
                      </div>
                      {report.file_url ? (
                        <a
                          href={report.file_url}
                          className="pill inline-flex items-center gap-1.5 bg-[#0f172a] px-4 py-2 text-[11px] font-bold text-white hover:bg-[#24384f]"
                          download
                        >
                          <Download size={12} /> Download
                        </a>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#94a3b8]">Summary only</span>
                      )}
                    </div>
                  ))
                )}
              </div>
              <p className="mt-4 text-[11px] leading-5 text-[#94a3b8]">
                Reports are private to your account. Only reports marked as published by the school are shown.
              </p>
            </section>

            {/* RESOURCES */}
            <section className="rounded-[1.5rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,.05)]">
              <h2 className="display flex items-center gap-2 text-2xl text-[#0f172a]">
                <BookOpen size={19} className="text-[#0d6db7]" /> Learning resources
              </h2>
              <p className="mt-1 text-xs text-[#64748b]">Documents shared with {learner.grade} learners.</p>
              <div className="mt-4 grid gap-3">
                {resources.length === 0 ? (
                  <p className="rounded-xl bg-[#f8fafc] p-5 text-sm text-[#64748b]">
                    No learning resources have been published for your grade yet. Check back soon or ask your teacher.
                  </p>
                ) : (
                  resources.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      download
                      className="group flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 transition hover:border-[#b7d7ee]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f7ff] text-[#0d6db7]">
                        <BookOpen size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-[#1e293b]">{doc.title}</span>
                        <span className="block truncate text-[11px] text-[#64748b]">{doc.description || doc.category}</span>
                      </span>
                      <Download size={15} className="shrink-0 text-[#94a3b8] transition group-hover:text-[#0d6db7]" />
                    </a>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="grid gap-6">
            {/* PROFILE */}
            <section className="rounded-[1.5rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_8px_22px_rgba(15,23,42,.05)]">
              <h2 className="display flex items-center gap-2 text-xl text-[#0f172a]">
                <UserRound size={18} className="text-[#0b4f8a]" /> My details
              </h2>
              <dl className="mt-4 grid gap-3 text-sm">
                {[
                  ["Full name", `${learner.first_name} ${learner.surname}`],
                  ["Student ID", learner.student_id],
                  ["Grade", `${learner.grade}${learner.class_name ? ` · ${learner.class_name}` : ""}`],
                  ["Guardian", learner.guardian_name || "Not recorded"],
                  ["Guardian phone", learner.guardian_phone || "Not recorded"],
                  ["Email", learner.email || "Not recorded"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-[#f1f5f9] pb-2 last:border-0 last:pb-0">
                    <dt className="text-[11px] font-bold uppercase tracking-[.08em] text-[#94a3b8]">{label}</dt>
                    <dd className="text-right text-xs font-semibold text-[#4f4a45]">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-lg bg-[#f8fafc] p-3 text-[10px] leading-5 text-[#94a3b8]">
                If these details are incorrect, please contact the school office. Your PIN is never displayed here.
              </p>
            </section>

            {/* SCHOOL INFO */}
            <section className="rounded-[1.5rem] bg-[#0f172a] p-6 text-white">
              <h2 className="display text-xl">School information</h2>
              <div className="mt-4 grid gap-3 text-sm text-white/80">
                <div className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-[#0d6db7]" /> {content["site.location"]}</div>
                <div className="flex items-center gap-2"><Phone size={15} className="shrink-0 text-[#0d6db7]" /> {content["site.phone"]}</div>
                <div className="flex items-center gap-2"><Mail size={15} className="shrink-0 text-[#0d6db7]" /> <span className="break-all">{content["site.email"]}</span></div>
                <div className="flex items-start gap-2"><CalendarDays size={15} className="mt-0.5 shrink-0 text-[#0d6db7]" /> {content["site.hours"]}</div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-3 text-[10px] leading-5 text-white/45">
                Contact details are editable placeholders managed by the school administration.
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-[#e2e8f0] bg-[#f8fafc] p-6">
              <h2 className="display text-lg text-[#0f172a]">Portal help</h2>
              <ul className="mt-3 grid gap-2 text-xs leading-5 text-[#64748b]">
                <li>Use the Student ID printed on your school card.</li>
                <li>Your PIN is private — never share it with another learner.</li>
                <li>Contact the office if you cannot sign in or your details are wrong.</li>
              </ul>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0b4f8a] hover:underline">
                Contact the school <ArrowRight size={12} />
              </Link>
            </section>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] leading-5 text-[#94a3b8]">
          Signed in as {user.name}. Session secured by an encrypted, http-only cookie and expires after 7 days.
        </p>
      </div>
    </div>
  );
}
