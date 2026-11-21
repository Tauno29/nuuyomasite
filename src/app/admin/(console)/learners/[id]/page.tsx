import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, FileText, KeyRound, Trash2, UserRound } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { addReport, deleteLearner, deleteReport, resetLearnerPin, saveLearner } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { formatDate, formatDateTime, getLearnerById, getReports } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export default async function AdminLearnerDetailPage({ params }: Props) {
  const { id } = await params;
  const learnerId = Number(id);
  if (!Number.isFinite(learnerId)) notFound();
  const learner = getLearnerById(learnerId);
  if (!learner) notFound();

  const account = db
    .prepare("SELECT id, email, active, last_login_at FROM users WHERE learner_id = ?")
    .get(learnerId) as { id: number; email: string | null; active: number; last_login_at: string | null } | undefined;
  const reports = getReports(learnerId, true);

  return (
    <div>
      <Link href="/admin/learners" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b4f8a] hover:underline">
        <ArrowLeft size={13} /> Back to learner registry
      </Link>

      <div className="mt-4">
        <AdminPageHeader
          eyebrow={`Learner record · ${learner.student_id}`}
          title={`${learner.first_name} ${learner.surname}`}
          body={`${learner.grade}${learner.class_name ? ` · ${learner.class_name}` : ""} · Registered ${formatDate(learner.created_at)}`}
          actions={
            <>
              <Badge tone={learner.active ? "green" : "grey"}>{learner.active ? "Active" : "Inactive"}</Badge>
              {account ? <Badge tone="blue"><UserRound size={10} /> Portal login</Badge> : <Badge tone="red">No login</Badge>}
            </>
          }
        />
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <AdminCard title="Learner details" description="Changes apply to the learner record and portal account immediately.">
          <ActionForm action={saveLearner} submitLabel="Save learner record" tone="coral">
            <input type="hidden" name="id" value={learner.id} />
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={adminLabel}>Student ID *</span>
                  <input name="student_id" required defaultValue={learner.student_id} maxLength={40} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Email</span>
                  <input name="email" type="email" defaultValue={learner.email ?? ""} maxLength={160} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>First name *</span>
                  <input name="first_name" required defaultValue={learner.first_name} maxLength={80} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Surname *</span>
                  <input name="surname" required defaultValue={learner.surname} maxLength={80} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Grade *</span>
                  <select name="grade" defaultValue={learner.grade} className={`mt-1.5 ${adminInput}`}>
                    {["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={adminLabel}>Class</span>
                  <input name="class_name" defaultValue={learner.class_name ?? ""} maxLength={40} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Learner phone</span>
                  <input name="phone" type="tel" defaultValue={learner.phone ?? ""} maxLength={30} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Guardian name</span>
                  <input name="guardian_name" defaultValue={learner.guardian_name ?? ""} maxLength={120} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Guardian phone</span>
                  <input name="guardian_phone" type="tel" defaultValue={learner.guardian_phone ?? ""} maxLength={30} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>New PIN (optional)</span>
                  <input name="pin" minLength={6} maxLength={100} className={`mt-1.5 ${adminInput}`} placeholder="Leave blank to keep current PIN" />
                </label>
              </div>
              <label className="block">
                <span className={adminLabel}>Notes (internal)</span>
                <textarea name="notes" rows={2} defaultValue={learner.notes ?? ""} maxLength={1000} className={`mt-1.5 ${adminInput}`} />
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-3 py-2.5 text-xs font-semibold text-[#475569]">
                <input type="checkbox" name="active" defaultChecked={Boolean(learner.active)} className="h-4 w-4 accent-[#0f8a55]" /> Active account (can sign in)
              </label>
              <p className="text-[10px] leading-5 text-[#94a3b8]">
                Changing the PIN signs the learner out of all existing portal sessions. Share new credentials securely.
              </p>
            </div>
          </ActionForm>
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard title="Portal account">
            <dl className="grid gap-2 text-[11px]">
              {[
                ["Account status", account ? (account.active ? "Active" : "Disabled") : "No portal account"],
                ["Account email", account?.email || "Not set"],
                ["Last sign-in", account?.last_login_at ? formatDateTime(account.last_login_at) : "Never"],
                ["Student ID (login)", learner.student_id],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-[#f1f5f9] pb-2 last:border-0 last:pb-0">
                  <dt className="font-bold uppercase tracking-[.06em] text-[#94a3b8]">{label}</dt>
                  <dd className="text-right font-semibold text-[#4f4a45]">{value}</dd>
                </div>
              ))}
            </dl>
            {account && (
              <details className="mt-4 rounded-lg bg-[#f8fafc] p-3">
                <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[.06em] text-[#0b4f8a]">
                  <KeyRound size={12} /> Reset PIN
                </summary>
                <ActionForm action={resetLearnerPin} submitLabel="Reset PIN" tone="navy" compact>
                  <input type="hidden" name="id" value={learner.id} />
                  <input name="pin" required minLength={6} maxLength={100} className={adminInput} placeholder="New PIN (min 6 characters)" aria-label="New PIN" />
                </ActionForm>
              </details>
            )}
          </AdminCard>

          <AdminCard title="Danger zone">
            <p className="text-[11px] leading-5 text-[#64748b]">
              Deleting this learner removes the portal account, sessions and reports. This cannot be undone.
            </p>
            <ActionForm action={deleteLearner} submitLabel="Delete learner" tone="danger" compact confirm={`Delete ${learner.first_name} ${learner.surname} and their portal account? This cannot be undone.`}>
              <input type="hidden" name="id" value={learner.id} />
            </ActionForm>
          </AdminCard>
        </div>
      </div>

      <div className="mt-6">
        <AdminCard title={`Term reports (${reports.length})`} description="Only published reports can be seen by the learner in the portal.">
          <div className="grid gap-3">
            {reports.length === 0 ? (
              <EmptyState title="No reports yet" body="Publish the first term report for this learner using the form below." />
            ) : (
              reports.map((report) => (
                <div key={report.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5edff] text-[#7c3fc0]"><FileText size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#1e293b]">{report.term} report</span>
                      <Badge tone={report.published ? "green" : "amber"}>{report.published ? "Published" : "Draft"}</Badge>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-5 text-[#64748b]">{report.summary}</p>
                    <div className="text-[9px] font-semibold uppercase tracking-wide text-[#94a3b8]">Updated {formatDate(report.updated_at)}</div>
                  </div>
                  {report.file_url && (
                    <a href={report.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#e0d6ce] bg-white px-3 py-1.5 text-[10px] font-bold text-[#475569]">
                      <Download size={11} /> File
                    </a>
                  )}
                  <ActionForm action={deleteReport} submitLabel="Delete" tone="danger" compact confirm={`Delete the ${report.term} report?`}>
                    <input type="hidden" name="id" value={report.id} />
                  </ActionForm>
                </div>
              ))
            )}
          </div>

          <details className="mt-4 rounded-xl border border-dashed border-[#d9cfc7] bg-[#f8fafc]">
            <summary className="cursor-pointer px-4 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-[#0b4f8a]">+ Publish a report</summary>
            <div className="border-t border-[#e2e8f0] p-4">
              <ActionForm action={addReport} submitLabel="Publish report" tone="coral" compact resetOnSuccess>
                <input type="hidden" name="learner_id" value={learner.id} />
                <div className="grid gap-2">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <select name="term" className={adminInput} defaultValue="Term 1" aria-label="Term">
                      <option>Term 1</option>
                      <option>Term 2</option>
                      <option>Term 3</option>
                    </select>
                    <input name="file_url" className={`${adminInput} sm:col-span-2`} placeholder="Document URL, or upload a file below" aria-label="Document URL" />
                  </div>
                  <input type="file" name="file" accept="application/pdf,image/jpeg,image/png,image/webp" className={`${adminInput} py-1.5`} aria-label="Report file" />
                  <textarea name="summary" required rows={2} maxLength={4000} className={adminInput} placeholder="Short summary shown in the portal" aria-label="Summary" />
                  <label className="flex items-center gap-2 text-[11px] font-semibold text-[#475569]">
                    <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-[#0f8a55]" /> Publish to learner portal
                  </label>
                </div>
              </ActionForm>
            </div>
          </details>
        </AdminCard>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-[10px] text-[#94a3b8]">
        <Trash2 size={11} /> Deleting a learner also deletes their login, sessions and reports.
      </p>
    </div>
  );
}
