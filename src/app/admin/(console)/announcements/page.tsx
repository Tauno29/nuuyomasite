import Link from "next/link";
import { CalendarDays, Pencil, Pin, Plus } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { deleteAnnouncement, saveAnnouncement, toggleAnnouncement } from "@/app/admin/actions";
import { formatDate, getAnnouncements } from "@/lib/site";

export const metadata = { title: "Announcements" };

const categories = ["General", "Admissions", "Academics", "Examinations", "Events", "Learner Portal", "Sports", "Culture"];

export default async function AdminAnnouncementsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const announcements = getAnnouncements(undefined, true);
  const editing = params.edit ? announcements.find((item) => item.id === Number(params.edit)) : undefined;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Website"
        title="Announcements"
        body="Publish school announcements to the homepage, news page and learner dashboard. Pinned announcements appear first."
        actions={
          <Link href="/admin/announcements" className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#24384f]">
            <Plus size={14} /> New announcement
          </Link>
        }
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <AdminCard
          title={editing ? "Edit announcement" : "Create an announcement"}
          description={editing ? "Update the announcement below and save." : "Published announcements appear immediately on the website."}
          action={editing ? <Link href="/admin/announcements" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">Cancel edit</Link> : undefined}
        >
          <ActionForm
            action={saveAnnouncement}
            submitLabel={editing ? "Save changes" : "Create announcement"}
            tone="coral"
            resetOnSuccess={!editing}
            key={editing?.id ?? "new"}
          >
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="grid gap-4">
              <label className="block">
                <span className={adminLabel}>Title *</span>
                <input name="title" required defaultValue={editing?.title ?? ""} maxLength={160} className={`mt-1.5 ${adminInput}`} placeholder="e.g. Term 2 reports now available" />
              </label>
              <label className="block">
                <span className={adminLabel}>Category *</span>
                <select name="category" defaultValue={editing?.category ?? "General"} className={`mt-1.5 ${adminInput}`}>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                  {editing && !categories.includes(editing.category) && <option>{editing.category}</option>}
                </select>
              </label>
              <label className="block">
                <span className={adminLabel}>Announcement text *</span>
                <textarea name="body" required rows={5} defaultValue={editing?.body ?? ""} maxLength={5000} className={`mt-1.5 ${adminInput}`} placeholder="Write the notice exactly as it should appear." />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={adminLabel}>Link label (optional)</span>
                  <input name="link_label" defaultValue={editing?.link_label ?? ""} maxLength={80} className={`mt-1.5 ${adminInput}`} placeholder="Read more" />
                </label>
                <label className="block">
                  <span className={adminLabel}>Link URL (optional)</span>
                  <input name="link_url" defaultValue={editing?.link_url ?? ""} maxLength={400} className={`mt-1.5 ${adminInput}`} placeholder="/admissions" />
                </label>
              </div>
              <div className="flex flex-wrap gap-5 rounded-lg bg-[#f8fafc] px-4 py-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                  <input type="checkbox" name="published" defaultChecked={editing ? Boolean(editing.published) : true} className="h-4 w-4 accent-[#0f8a55]" />
                  Published
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                  <input type="checkbox" name="pinned" defaultChecked={editing ? Boolean(editing.pinned) : false} className="h-4 w-4 accent-[#0b4f8a]" />
                  Pin to top
                </label>
              </div>
            </div>
          </ActionForm>
        </AdminCard>

        <AdminCard title={`All announcements (${announcements.length})`} description="Drafts are visible only in this console.">
          {announcements.length === 0 ? (
            <EmptyState title="No announcements yet" body="Create your first announcement using the form on the left." />
          ) : (
            <div className="grid gap-3">
              {announcements.map((item) => (
                <article key={item.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={item.published ? "green" : "amber"}>{item.published ? "Live" : "Draft"}</Badge>
                    <Badge tone="coral">{item.category}</Badge>
                    {item.pinned ? <Badge tone="purple"><Pin size={10} /> Pinned</Badge> : null}
                    <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-[#94a3b8]">
                      <CalendarDays size={11} /> {formatDate(item.published_at, { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold leading-5 text-[#1e293b]">{item.title}</h3>
                  <p className="mt-1 line-clamp-3 whitespace-pre-line text-xs leading-5 text-[#64748b]">{item.body}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#e2e8f0] pt-3">
                    <Link href={`/admin/announcements?edit=${item.id}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0d6db7] hover:underline">
                      <Pencil size={12} /> Edit
                    </Link>
                    <ActionForm action={toggleAnnouncement} submitLabel={item.published ? "Unpublish" : "Publish"} tone="navy" compact>
                      <input type="hidden" name="id" value={item.id} />
                    </ActionForm>
                    <ActionForm action={deleteAnnouncement} submitLabel="Delete" tone="danger" compact confirm={`Delete “${item.title}”? This cannot be undone.`}>
                      <input type="hidden" name="id" value={item.id} />
                    </ActionForm>
                  </div>
                </article>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
