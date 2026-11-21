import { AdminCard, AdminPageHeader, Badge, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { deleteStat, deleteSubject, deleteValue, saveStat, saveSubject, saveValue } from "@/app/admin/actions";
import { getStats, getSubjects, getValues } from "@/lib/site";

export const metadata = { title: "Academics" };

export default function AdminAcademicsPage() {
  const subjects = getSubjects();
  const stats = getStats();
  const values = getValues();

  return (
    <div>
      <AdminPageHeader
        eyebrow="School"
        title="Academics"
        body="Manage the subjects listed on the academics page, the homepage statistics and the school values shown on the about page."
      />

      <div className="mt-6 grid gap-6">
        <AdminCard
          title={`Subjects on offer (${subjects.length})`}
          description="These subjects appear in the public subject grid. Keep grade ranges accurate and confirmed."
        >
          <details className="mb-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
            <summary className="cursor-pointer px-4 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-[#0b4f8a]">
              + Add a subject
            </summary>
            <div className="border-t border-[#e2e8f0] p-4">
              <ActionForm action={saveSubject} submitLabel="Add subject" tone="coral" compact resetOnSuccess>
                <div className="grid gap-2 sm:grid-cols-4">
                  <input name="name" required maxLength={120} className={`${adminInput} sm:col-span-2`} placeholder="Subject name" aria-label="Subject name" />
                  <input name="level" required maxLength={60} defaultValue="Grades 8–12" className={adminInput} placeholder="Level" aria-label="Level" />
                  <input type="number" name="sort_order" defaultValue={subjects.length} min={0} className={adminInput} placeholder="Order" aria-label="Sort order" />
                  <input name="description" maxLength={400} className={`${adminInput} sm:col-span-4`} placeholder="Short description (optional)" aria-label="Description" />
                </div>
              </ActionForm>
            </div>
          </details>

          <div className="grid gap-2">
            {subjects.map((subject) => (
              <details key={subject.id} className="rounded-xl border border-[#e2e8f0] bg-white">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
                  <span className="text-xs font-bold text-[#1e293b]">{subject.name}</span>
                  <Badge tone="blue">{subject.level}</Badge>
                  <span className="ml-auto text-[10px] font-bold text-[#94a3b8]">#{subject.sort_order}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#0d6db7]">Edit ▾</span>
                </summary>
                <div className="border-t border-[#e2e8f0] p-4">
                  <ActionForm action={saveSubject} submitLabel="Save subject" tone="navy" compact>
                    <input type="hidden" name="id" value={subject.id} />
                    <div className="grid gap-2 sm:grid-cols-4">
                      <input name="name" required maxLength={120} defaultValue={subject.name} className={`${adminInput} sm:col-span-2`} aria-label="Subject name" />
                      <input name="level" required maxLength={60} defaultValue={subject.level} className={adminInput} aria-label="Level" />
                      <input type="number" name="sort_order" defaultValue={subject.sort_order} min={0} className={adminInput} aria-label="Sort order" />
                      <input name="description" maxLength={400} defaultValue={subject.description} className={`${adminInput} sm:col-span-4`} aria-label="Description" />
                    </div>
                  </ActionForm>
                  <ActionForm action={deleteSubject} submitLabel="Remove subject" tone="danger" compact confirm={`Remove ${subject.name} from the website?`}>
                    <input type="hidden" name="id" value={subject.id} />
                  </ActionForm>
                </div>
              </details>
            ))}
          </div>
        </AdminCard>

        <div className="grid items-start gap-6 xl:grid-cols-2">
          <AdminCard title={`Homepage statistics (${stats.length})`} description="Shown as cards beneath the homepage hero. Do not publish unverified figures.">
            <div className="grid gap-2">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <ActionForm action={saveStat} submitLabel="Save" tone="navy" compact>
                    <input type="hidden" name="id" value={stat.id} />
                    <div className="grid grid-cols-[.55fr_1.45fr_.4fr] gap-2">
                      <input name="value" required maxLength={40} defaultValue={stat.value} className={adminInput} aria-label="Value" />
                      <input name="label" required maxLength={80} defaultValue={stat.label} className={adminInput} aria-label="Label" />
                      <input type="number" name="sort_order" defaultValue={stat.sort_order} min={0} className={adminInput} aria-label="Sort order" />
                    </div>
                  </ActionForm>
                  <ActionForm action={deleteStat} submitLabel="Delete" tone="danger" compact confirm={`Delete the “${stat.label}” statistic?`}>
                    <input type="hidden" name="id" value={stat.id} />
                  </ActionForm>
                </div>
              ))}
            </div>
            <details className="mt-4 rounded-xl border border-dashed border-[#d9cfc7] bg-[#f8fafc]">
              <summary className="cursor-pointer px-4 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-[#0b4f8a]">+ Add a statistic</summary>
              <div className="border-t border-[#e2e8f0] p-4">
                <ActionForm action={saveStat} submitLabel="Add statistic" tone="coral" compact resetOnSuccess>
                  <div className="grid grid-cols-[.55fr_1.45fr_.4fr] gap-2">
                    <input name="value" required maxLength={40} className={adminInput} placeholder="Value" aria-label="Value" />
                    <input name="label" required maxLength={80} className={adminInput} placeholder="Label" aria-label="Label" />
                    <input type="number" name="sort_order" defaultValue={stats.length} min={0} className={adminInput} aria-label="Sort order" />
                  </div>
                </ActionForm>
              </div>
            </details>
          </AdminCard>

          <AdminCard title={`School values (${values.length})`} description="Displayed on the about page. Use a single emoji or symbol as the icon.">
            <div className="grid gap-2">
              {values.map((value) => (
                <details key={value.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3">
                    <span className="text-lg" aria-hidden>{value.icon}</span>
                    <span className="text-xs font-bold text-[#1e293b]">{value.title}</span>
                    <span className="ml-auto text-[10px] font-extrabold uppercase tracking-[.08em] text-[#0d6db7]">Edit ▾</span>
                  </summary>
                  <div className="border-t border-[#e2e8f0] p-4">
                    <ActionForm action={saveValue} submitLabel="Save value" tone="navy" compact>
                      <input type="hidden" name="id" value={value.id} />
                      <div className="grid gap-2">
                        <div className="grid grid-cols-[.35fr_1.35fr_.3fr] gap-2">
                          <input name="icon" required maxLength={8} defaultValue={value.icon} className={adminInput} aria-label="Icon" />
                          <input name="title" required maxLength={80} defaultValue={value.title} className={adminInput} aria-label="Title" />
                          <input type="number" name="sort_order" defaultValue={value.sort_order} min={0} className={adminInput} aria-label="Sort order" />
                        </div>
                        <input name="description" required maxLength={300} defaultValue={value.description} className={adminInput} aria-label="Description" />
                      </div>
                    </ActionForm>
                    <ActionForm action={deleteValue} submitLabel="Delete value" tone="danger" compact confirm={`Delete the “${value.title}” value?`}>
                      <input type="hidden" name="id" value={value.id} />
                    </ActionForm>
                  </div>
                </details>
              ))}
            </div>
            <details className="mt-4 rounded-xl border border-dashed border-[#d9cfc7] bg-[#f8fafc]">
              <summary className="cursor-pointer px-4 py-3 text-xs font-extrabold uppercase tracking-[.08em] text-[#0b4f8a]">+ Add a value</summary>
              <div className="border-t border-[#e2e8f0] p-4">
                <ActionForm action={saveValue} submitLabel="Add value" tone="coral" compact resetOnSuccess>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-[.35fr_1.35fr_.3fr] gap-2">
                      <input name="icon" required maxLength={8} defaultValue="⭐" className={adminInput} aria-label="Icon" />
                      <input name="title" required maxLength={80} className={adminInput} placeholder="Value title" aria-label="Title" />
                      <input type="number" name="sort_order" defaultValue={values.length} min={0} className={adminInput} aria-label="Sort order" />
                    </div>
                    <input name="description" required maxLength={300} className={adminInput} placeholder="Short description" aria-label="Description" />
                  </div>
                </ActionForm>
              </div>
            </details>
          </AdminCard>
        </div>

        <div className="rounded-xl border border-[#e9e0e8] bg-[#fff] px-4 py-3 text-[11px] leading-5 text-[#64748b]">
          <strong className="text-[#475569]">Academic results, achievements and exam notices</strong> are managed under
          {" "}<a href="/admin/content" className="font-bold text-[#0d6db7] hover:underline">Website Content → Academics</a> and
          {" "}<a href="/admin/news" className="font-bold text-[#0d6db7] hover:underline">News & Events</a>. Only publish verified results.
        </div>
      </div>
    </div>
  );
}
