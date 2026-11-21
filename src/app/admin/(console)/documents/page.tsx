import { Download, FileText, Upload } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { deleteDocument, saveDocument, toggleDocument } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { formatDate, type DocumentItem } from "@/lib/site";

export const metadata = { title: "Documents" };

const categories = ["Admissions", "Policies", "Learner Resources", "Examinations", "Forms", "Newsletters", "General"];

export default function AdminDocumentsPage() {
  const documents = db.prepare("SELECT * FROM documents ORDER BY created_at DESC").all() as DocumentItem[];

  return (
    <div>
      <AdminPageHeader
        eyebrow="School"
        title="Documents & resources"
        body="Upload public forms, policies and learner resources. Learner-only documents appear in the portal for the selected grade."
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <AdminCard title="Add a document" description="PDFs and images up to 8 MB. A document URL can be used instead of uploading.">
          <ActionForm action={saveDocument} submitLabel="Add document" pendingLabel="Uploading…" tone="coral" resetOnSuccess>
            <div className="grid gap-3">
              <label className="block">
                <span className={adminLabel}>Title *</span>
                <input name="title" required maxLength={160} className={`mt-1.5 ${adminInput}`} placeholder="e.g. 2027 admission requirements" />
              </label>
              <label className="block">
                <span className={adminLabel}>Description</span>
                <input name="description" maxLength={400} className={`mt-1.5 ${adminInput}`} placeholder="Short explanation for the document" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={adminLabel}>Category *</span>
                  <select name="category" className={`mt-1.5 ${adminInput}`} defaultValue="General">
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={adminLabel}>Audience *</span>
                  <select name="audience" className={`mt-1.5 ${adminInput}`} defaultValue="public">
                    <option value="public">Public website</option>
                    <option value="learner">Learner portal</option>
                    <option value="both">Both</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className={adminLabel}>Grade (for learner resources)</span>
                <select name="grade" className={`mt-1.5 ${adminInput}`} defaultValue="">
                  <option value="">All grades / not grade-specific</option>
                  {["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((grade) => (
                    <option key={grade}>{grade}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={adminLabel}>File upload</span>
                <input type="file" name="file" accept="application/pdf,image/jpeg,image/png,image/webp" className={`mt-1.5 ${adminInput} py-1.5`} />
              </label>
              <label className="block">
                <span className={adminLabel}>Or document URL</span>
                <input name="file_url" className={`mt-1.5 ${adminInput}`} placeholder="/api/application-form.pdf or https://…" />
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-3 py-2.5 text-xs font-semibold text-[#475569]">
                <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-[#0f8a55]" /> Publish immediately
              </label>
            </div>
          </ActionForm>
        </AdminCard>

        <AdminCard title={`Library (${documents.length})`} description="Edit, hide or remove documents at any time.">
          {documents.length === 0 ? (
            <EmptyState title="No documents yet" body="Upload the first school document using the form on the left." />
          ) : (
            <div className="grid gap-3">
              {documents.map((doc) => (
                <article key={doc.id} className="rounded-xl border border-[#e2e8f0] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e9f4ff] text-[#0b4f8a]">
                      <FileText size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone={doc.published ? "green" : "amber"}>{doc.published ? "Live" : "Hidden"}</Badge>
                        <Badge tone={doc.audience === "public" ? "blue" : doc.audience === "learner" ? "purple" : "coral"}>{doc.audience}</Badge>
                        <Badge tone="grey">{doc.category}</Badge>
                        {doc.grade ? <Badge tone="grey">{doc.grade}</Badge> : null}
                      </div>
                      <h3 className="mt-1.5 text-xs font-bold text-[#1e293b]">{doc.title}</h3>
                      {doc.description && <p className="mt-0.5 line-clamp-2 text-[10px] leading-5 text-[#64748b]">{doc.description}</p>}
                      <div className="mt-1 flex items-center gap-2 text-[9px] font-semibold text-[#94a3b8]">
                        Added {formatDate(doc.created_at)}
                        <a href={doc.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-[#0d6db7] hover:underline">
                          <Download size={10} /> Open
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#e2e8f0] pt-3">
                    <details className="min-w-[180px] flex-1">
                      <summary className="cursor-pointer text-[10px] font-extrabold uppercase tracking-[.08em] text-[#0d6db7]">Edit details ▾</summary>
                      <div className="mt-2">
                        <ActionForm action={saveDocument} submitLabel="Save document" tone="navy" compact>
                          <input type="hidden" name="id" value={doc.id} />
                          <div className="grid gap-2">
                            <input name="title" required defaultValue={doc.title} maxLength={160} className={adminInput} aria-label="Title" />
                            <input name="description" defaultValue={doc.description ?? ""} maxLength={400} className={adminInput} placeholder="Description" aria-label="Description" />
                            <div className="grid grid-cols-2 gap-2">
                              <select name="category" defaultValue={doc.category} className={adminInput} aria-label="Category">
                                {categories.map((category) => (
                                  <option key={category}>{category}</option>
                                ))}
                                {!categories.includes(doc.category) && <option>{doc.category}</option>}
                              </select>
                              <select name="audience" defaultValue={doc.audience} className={adminInput} aria-label="Audience">
                                <option value="public">Public website</option>
                                <option value="learner">Learner portal</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <select name="grade" defaultValue={doc.grade ?? ""} className={adminInput} aria-label="Grade">
                                <option value="">All grades</option>
                                {["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((grade) => (
                                  <option key={grade}>{grade}</option>
                                ))}
                              </select>
                              <label className="flex items-center gap-1.5 text-[10px] font-semibold text-[#475569]">
                                <input type="checkbox" name="published" defaultChecked={Boolean(doc.published)} className="h-3.5 w-3.5 accent-[#0f8a55]" /> Published
                              </label>
                            </div>
                            <input type="file" name="file" accept="application/pdf,image/jpeg,image/png,image/webp" className={`${adminInput} py-1.5`} aria-label="Replace file" />
                            <input name="file_url" defaultValue={doc.file_url} className={adminInput} aria-label="Document URL" />
                            <p className="text-[9px] text-[#94a3b8]">Uploading a new file replaces the existing document file.</p>
                          </div>
                        </ActionForm>
                      </div>
                    </details>
                    <ActionForm action={toggleDocument} submitLabel={doc.published ? "Hide" : "Publish"} tone="navy" compact>
                      <input type="hidden" name="id" value={doc.id} />
                    </ActionForm>
                    <ActionForm action={deleteDocument} submitLabel="Delete" tone="danger" compact confirm={`Delete “${doc.title}”?`}>
                      <input type="hidden" name="id" value={doc.id} />
                    </ActionForm>
                  </div>
                </article>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      <p className="mt-5 flex items-center gap-2 text-[10px] leading-5 text-[#94a3b8]">
        <Upload size={12} /> Public documents appear on the admissions page. Learner documents appear in the portal, filtered by grade.
      </p>
    </div>
  );
}
