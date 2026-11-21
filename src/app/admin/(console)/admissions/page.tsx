import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Inbox } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { saveContent } from "@/app/admin/actions";
import { getContent, getPublicDocuments } from "@/lib/site";

export const metadata = { title: "Admissions Info" };

export default function AdminAdmissionsPage() {
  const content = getContent();
  const documents = getPublicDocuments().filter((doc) => doc.category.toLowerCase() === "admissions");

  return (
    <div>
      <AdminPageHeader
        eyebrow="School"
        title="Admissions information"
        body="Edit the requirements, application procedure, important dates and notice shown on the public admissions page."
        actions={
          <Link href="/admin/applications" className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#24384f]">
            <Inbox size={14} /> Review applications
          </Link>
        }
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <AdminCard title="Admissions page content" description="Saved to the database and published immediately.">
          <ActionForm action={saveContent} submitLabel="Save admissions content" tone="coral">
            <div className="grid gap-4">
              <label className="block">
                <span className={adminLabel}>Page heading</span>
                <input name="admissions.intro_title" defaultValue={content["admissions.intro_title"]} className={`mt-1.5 ${adminInput}`} />
              </label>
              <label className="block">
                <span className={adminLabel}>Introduction</span>
                <textarea name="admissions.intro_body" rows={4} defaultValue={content["admissions.intro_body"]} className={`mt-1.5 ${adminInput}`} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={adminLabel}>Requirements — one per line</span>
                  <textarea name="admissions.requirements" rows={7} defaultValue={content["admissions.requirements"]} className={`mt-1.5 ${adminInput}`} />
                </label>
                <label className="block">
                  <span className={adminLabel}>Procedure — one step per line</span>
                  <textarea name="admissions.procedure" rows={7} defaultValue={content["admissions.procedure"]} className={`mt-1.5 ${adminInput}`} />
                </label>
              </div>
              <label className="block">
                <span className={adminLabel}>Important dates — Label | Date | Note (one per line)</span>
                <textarea name="admissions.dates" rows={5} defaultValue={content["admissions.dates"]} className={`mt-1.5 ${adminInput}`} />
                <span className="mt-1 block text-[10px] text-[#94a3b8]">
                  Example: Applications open | 12 January 2027 | Confirm with the office
                </span>
              </label>
              <label className="block">
                <span className={adminLabel}>Admissions notice</span>
                <textarea name="admissions.note" rows={3} defaultValue={content["admissions.note"]} className={`mt-1.5 ${adminInput}`} />
              </label>
            </div>
          </ActionForm>
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard title="Downloadable documents" description="Public admission documents appear on the admissions page.">
            {documents.length === 0 ? (
              <p className="rounded-xl bg-[#f8fafc] p-4 text-xs leading-5 text-[#64748b]">
                No public documents are tagged “Admissions”. Upload one from Documents.
              </p>
            ) : (
              <div className="grid gap-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] p-3">
                    <FileText size={15} className="shrink-0 text-[#0b4f8a]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-[#1e293b]">{doc.title}</div>
                      <div className="text-[10px] text-[#94a3b8]">{doc.category}</div>
                    </div>
                    <Badge tone={doc.audience === "learner" ? "purple" : "blue"}>{doc.audience}</Badge>
                  </div>
                ))}
              </div>
            )}
            <Link href="/admin/documents" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b4f8a] hover:underline">
              Manage documents <ArrowRight size={12} />
            </Link>
          </AdminCard>

          <AdminCard title="Key dates">
            <div className="flex items-start gap-3 rounded-xl bg-[#f7f3ee] p-4">
              <CalendarDays size={18} className="mt-0.5 shrink-0 text-[#0d6db7]" />
              <p className="text-[11px] leading-5 text-[#64748b]">
                Dates are currently placeholders. Update them with confirmed dates before promoting admissions. The online
                application form records every submission in the Applications inbox.
              </p>
            </div>
            <Link href="/admin/applications" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b4f8a] hover:underline">
              Open applications inbox <ArrowRight size={12} />
            </Link>
          </AdminCard>

          <AdminCard title="Related content">
            <div className="grid gap-2 text-[11px]">
              {[
                ["Admissions notice bar", "/admin/content", "Homepage → Announcement bar"],
                ["Admissions fee rows", "/admin/fees", "Fee structures"],
                ["Admission news stories", "/admin/news", "News & events"],
                ["Boarding information", "/admin/content", "Boarding group"],
              ].map(([label, href, hint]) => (
                <Link key={label} href={href} className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-2.5 font-bold text-[#475569] hover:border-[#f2c4ad]">
                  <span>
                    {label}
                    <span className="ml-2 font-normal text-[#94a3b8]">{hint}</span>
                  </span>
                  <ArrowRight size={12} className="text-[#0b4f8a]" />
                </Link>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
