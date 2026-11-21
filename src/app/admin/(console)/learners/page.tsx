import Link from "next/link";
import { ArrowRight, Search, UserPlus, Users } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { saveLearner } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { formatDate, type Learner } from "@/lib/site";

export const metadata = { title: "Learner Registry" };

type Row = Learner & { report_count: number; has_login: number };

export default async function AdminLearnersPage({ searchParams }: { searchParams: Promise<{ q?: string; grade?: string }> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const grade = params.grade ?? "";

  const where: string[] = [];
  const args: unknown[] = [];
  if (q) {
    where.push("(l.student_id LIKE ? OR l.first_name LIKE ? OR l.surname LIKE ? OR l.guardian_name LIKE ?)");
    args.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (grade) {
    where.push("l.grade = ?");
    args.push(grade);
  }

  const learners = db
    .prepare(
      `SELECT l.*, (SELECT COUNT(*) FROM reports r WHERE r.learner_id = l.id) AS report_count,
              (SELECT COUNT(*) FROM users u WHERE u.learner_id = l.id) AS has_login
       FROM learners l ${where.length ? "WHERE " + where.join(" AND ") : ""}
       ORDER BY l.grade, l.surname, l.first_name`,
    )
    .all(...args) as Row[];

  const total = (db.prepare("SELECT COUNT(*) AS n FROM learners WHERE active = 1").get() as { n: number }).n;

  return (
    <div>
      <AdminPageHeader
        eyebrow="School"
        title="Learner registry"
        body="Create learner accounts, reset PINs and publish term reports to the secure learner portal."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f7ff] px-4 py-2.5 text-xs font-bold text-[#0d6db7]">
            <Users size={14} /> {total} active learners
          </span>
        }
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <AdminCard title="Register a learner" description="This creates both the learner record and a portal login (Student ID + PIN).">
          <ActionForm action={saveLearner} submitLabel="Create learner account" tone="coral" resetOnSuccess>
            <div className="grid gap-3">
              <label className="block">
                <span className={adminLabel}>Student ID *</span>
                <input name="student_id" required maxLength={40} className={`mt-1.5 ${adminInput}`} placeholder="NSSS-2026-001" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={adminLabel}>First name *</span>
                  <input name="first_name" required maxLength={80} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Surname *</span>
                  <input name="surname" required maxLength={80} className={`mt-1.5 ${adminInput}`} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={adminLabel}>Grade *</span>
                  <select name="grade" className={`mt-1.5 ${adminInput}`} defaultValue="Grade 8">
                    {["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={adminLabel}>Class</span>
                  <input name="class_name" maxLength={40} className={`mt-1.5 ${adminInput}`} placeholder="8 A" />
                </label>
              </div>
              <label className="block">
                <span className={adminLabel}>Email (optional)</span>
                <input name="email" type="email" maxLength={160} className={`mt-1.5 ${adminInput}`} placeholder="Used as the account email" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={adminLabel}>Guardian</span>
                  <input name="guardian_name" maxLength={120} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Guardian phone</span>
                  <input name="guardian_phone" type="tel" maxLength={30} className={`mt-1.5 ${adminInput}`} />
                </label>
              </div>
              <label className="block">
                <span className={adminLabel}>Initial PIN * (minimum 6 characters)</span>
                <input name="pin" required minLength={6} maxLength={100} className={`mt-1.5 ${adminInput}`} placeholder="Share securely with the learner" />
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-3 py-2.5 text-xs font-semibold text-[#475569]">
                <input type="checkbox" name="active" defaultChecked className="h-4 w-4 accent-[#0f8a55]" /> Active account
              </label>
            </div>
          </ActionForm>
        </AdminCard>

        <div>
          <div className="rounded-2xl border border-[#e9e0d8] bg-white p-4">
            <form method="get" className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px] flex-1">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input name="q" defaultValue={q} placeholder="Search name, Student ID or guardian" className={`${adminInput} pl-9`} aria-label="Search learners" />
              </div>
              <select name="grade" defaultValue={grade} className={`${adminInput} w-auto`} aria-label="Filter by grade">
                <option value="">All grades</option>
                {["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button type="submit" className="rounded-full bg-[#0f172a] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#24384f]">Filter</button>
              {(q || grade) && <Link href="/admin/learners" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">Clear</Link>}
            </form>
          </div>

          <div className="mt-4 grid gap-3">
            {learners.length === 0 ? (
              <AdminCard>
                <EmptyState title="No learners found" body="Adjust the filters or register a new learner account." />
              </AdminCard>
            ) : (
              learners.map((learner) => (
                <article key={learner.id} className="rounded-xl border border-[#e9e0d8] bg-white p-4 shadow-[0_3px_10px_rgba(15,23,42,.03)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5edff] text-sm font-extrabold text-[#7c3fc0]">
                      {learner.first_name.charAt(0)}{learner.surname.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-[#1e293b]">{learner.first_name} {learner.surname}</div>
                      <div className="text-[10px] font-semibold text-[#94a3b8]">
                        {learner.student_id} · {learner.grade}{learner.class_name ? ` · ${learner.class_name}` : ""}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge tone={learner.active ? "green" : "grey"}>{learner.active ? "Active" : "Inactive"}</Badge>
                      {!learner.has_login && <Badge tone="red">No login</Badge>}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#64748b]">
                    <span>{learner.report_count} report{learner.report_count === 1 ? "" : "s"}</span>
                    <span>{learner.email || "No email"}</span>
                    <span>Joined {formatDate(learner.created_at, { day: "numeric", month: "short", year: "numeric" })}</span>
                    <Link href={`/admin/learners/${learner.id}`} className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-[#0b4f8a] hover:underline">
                      Open record <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
          <p className="mt-3 flex items-center gap-1 text-[10px] text-[#94a3b8]">
            <UserPlus size={12} /> New accounts can sign in immediately at /learner-portal.
          </p>
        </div>
      </div>
    </div>
  );
}
