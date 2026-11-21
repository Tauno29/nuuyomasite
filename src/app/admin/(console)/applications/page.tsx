import Link from "next/link";
import { CalendarDays, Mail, Phone } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { deleteApplication, updateApplicationStatus } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { formatDate, type Application } from "@/lib/site";

export const metadata = { title: "Applications" };

const statuses = ["New", "Reviewing", "Accepted", "Waiting list", "Declined"];

const toneFor = (status: string) =>
  status === "New" ? "coral" : status === "Accepted" ? "green" : status === "Declined" ? "red" : status === "Waiting list" ? "amber" : "blue";

export default async function AdminApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const filter: string = params.status && statuses.includes(params.status) ? params.status : "All";
  const all = db
    .prepare("SELECT * FROM applications ORDER BY created_at DESC")
    .all() as Application[];
  const applications = filter === "All" ? all : all.filter((application) => application.status === filter);

  return (
    <div>
      <AdminPageHeader
        eyebrow="School"
        title="Applications"
        body="Every online application submitted through the public admissions form. Move applications through review and contact guardians directly."
      />

      <div className="mt-5 flex flex-wrap gap-2">
        {["All", ...statuses].map((status) => {
          const active = filter === status;
          const n = status === "All" ? all.length : all.filter((application) => application.status === status).length;
          return (
            <Link
              key={status}
              href={status === "All" ? "/admin/applications" : `/admin/applications?status=${encodeURIComponent(status)}`}
              className={`rounded-full px-4 py-2 text-[11px] font-bold transition ${
                active ? "bg-[#0f172a] text-white" : "border border-[#e0d6ce] bg-white text-[#475569] hover:border-[#0b4f8a]"
              }`}
            >
              {status} <span className={active ? "text-white/50" : "text-[#94a3b8]"}>({n})</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-6">
        {applications.length === 0 ? (
          <AdminCard>
            <EmptyState
              title={filter === "All" ? "No applications yet" : `No ${filter.toLowerCase()} applications`}
              body="Applications submitted from the public admissions form will appear here in real time."
              action={{ href: "/admissions#application", label: "Open the public application form" }}
            />
          </AdminCard>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {applications.map((application) => (
              <article key={application.id} className="rounded-2xl border border-[#e9e0d8] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,.04)]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#0f172a]">
                      {application.learner_first_name} {application.learner_surname}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge tone="blue">{application.grade}</Badge>
                      <Badge tone={toneFor(application.status)}>{application.status}</Badge>
                      {application.boarding ? <Badge tone="purple">Boarding</Badge> : <Badge tone="grey">Day learner</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-[#94a3b8]">
                    <CalendarDays size={11} /> {formatDate(application.created_at)}
                  </div>
                </div>

                <dl className="mt-4 grid gap-2 rounded-xl bg-[#f8fafc] p-3 text-[11px] sm:grid-cols-2">
                  {[
                    ["Guardian", application.guardian_name],
                    ["Guardian phone", application.guardian_phone],
                    ["Guardian email", application.guardian_email || "Not provided"],
                    ["Date of birth", application.date_of_birth || "Not provided"],
                    ["Home language", application.home_language || "Not provided"],
                    ["Previous school", application.previous_school || "Not provided"],
                    ["Transport", application.transport || "Not provided"],
                    ["Postal address", application.postal_address || "Not provided"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[9px] font-extrabold uppercase tracking-[.08em] text-[#94a3b8]">{label}</dt>
                      <dd className="mt-0.5 break-words font-semibold text-[#4f4a45]">{value}</dd>
                    </div>
                  ))}
                </dl>

                {application.notes && (
                  <p className="mt-2 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[11px] leading-5 text-[#6a625b]">
                    <span className="font-bold text-[#1e293b]">Notes:</span> {application.notes}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <a href={`tel:${application.guardian_phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1 rounded-full border border-[#e0d6ce] px-3 py-1.5 font-bold text-[#475569] hover:border-[#0b4f8a]">
                    <Phone size={11} /> Call guardian
                  </a>
                  {application.guardian_email && (
                    <a href={`mailto:${application.guardian_email}`} className="inline-flex items-center gap-1 rounded-full border border-[#e0d6ce] px-3 py-1.5 font-bold text-[#475569] hover:border-[#0b4f8a]">
                      <Mail size={11} /> Email guardian
                    </a>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-[#e2e8f0] pt-3">
                  <ActionForm action={updateApplicationStatus} submitLabel="Update status" tone="navy" compact>
                    <input type="hidden" name="id" value={application.id} />
                    <select name="status" defaultValue={application.status} className="rounded-lg border border-[#e0d6ce] bg-white px-3 py-2 text-xs font-semibold text-[#1e293b]" aria-label="Application status">
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </ActionForm>
                  <ActionForm action={deleteApplication} submitLabel="Delete" tone="danger" compact confirm={`Delete the application from ${application.learner_first_name} ${application.learner_surname}?`}>
                    <input type="hidden" name="id" value={application.id} />
                  </ActionForm>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
