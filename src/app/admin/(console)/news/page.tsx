import Link from "next/link";
import { CalendarDays, ImageIcon, Pencil, Plus, Star } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { deleteNews, saveNews } from "@/app/admin/actions";
import { formatDate, getNews } from "@/lib/site";

export const metadata = { title: "News & Events" };

const categories = ["News", "Admissions", "Academics", "Examinations", "Events", "Sports", "Culture"];

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const stories = getNews(undefined, true);
  const editing = params.edit ? stories.find((item) => item.id === Number(params.edit)) : undefined;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Website"
        title="News & events"
        body="Write news stories and event notices. Featured stories are highlighted on the homepage and news page."
        actions={
          <Link href="/admin/news" className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#24384f]">
            <Plus size={14} /> New story
          </Link>
        }
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <AdminCard
          title={editing ? "Edit story" : "Create a story"}
          description={editing ? `Slug: /news/${editing.slug}` : "The slug is generated from the title if left blank."}
          action={editing ? <Link href="/admin/news" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">Cancel edit</Link> : undefined}
        >
          <ActionForm action={saveNews} submitLabel={editing ? "Save changes" : "Publish story"} tone="coral" resetOnSuccess={!editing} key={editing?.id ?? "new"}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="grid gap-4">
              <label className="block">
                <span className={adminLabel}>Headline *</span>
                <input name="title" required defaultValue={editing?.title ?? ""} maxLength={180} className={`mt-1.5 ${adminInput}`} placeholder="Story headline" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={adminLabel}>Category *</span>
                  <select name="category" defaultValue={editing?.category ?? "News"} className={`mt-1.5 ${adminInput}`}>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                    {editing && !categories.includes(editing.category) && <option>{editing.category}</option>}
                  </select>
                </label>
                <label className="block">
                  <span className={adminLabel}>Event date (optional)</span>
                  <input type="date" name="event_date" defaultValue={editing?.event_date?.slice(0, 10) ?? ""} className={`mt-1.5 ${adminInput}`} />
                </label>
              </div>
              <label className="block">
                <span className={adminLabel}>Short summary *</span>
                <textarea name="excerpt" required rows={2} defaultValue={editing?.excerpt ?? ""} maxLength={400} className={`mt-1.5 ${adminInput}`} placeholder="One or two sentences shown on cards." />
              </label>
              <label className="block">
                <span className={adminLabel}>Story *</span>
                <textarea name="body" required rows={8} defaultValue={editing?.body ?? ""} maxLength={30000} className={`mt-1.5 ${adminInput}`} placeholder="Write the full story. Leave a blank line between paragraphs. Use “## ” for a heading." />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={adminLabel}>Image upload</span>
                  <input type="file" name="image_file" accept="image/jpeg,image/png,image/webp,image/gif" className={`mt-1.5 ${adminInput} py-1.5`} />
                  <span className="mt-1 block text-[10px] text-[#94a3b8]">JPG, PNG, WEBP or GIF · max 8 MB</span>
                </label>
                <label className="block">
                  <span className={adminLabel}>Or image URL</span>
                  <input name="image_url" defaultValue={editing?.image_url ?? ""} maxLength={500} className={`mt-1.5 ${adminInput}`} placeholder="/assets/gallery/campus.webp" />
                </label>
              </div>
              {editing?.image_url && (
                <div className="flex items-center gap-3 rounded-lg bg-[#f8fafc] p-3">
                  <img src={editing.image_url} alt="" className="h-14 w-20 rounded object-cover" />
                  <span className="text-[10px] leading-4 text-[#64748b]">Current image. Uploading a new file replaces it.</span>
                </div>
              )}
              <div className="flex flex-wrap gap-5 rounded-lg bg-[#f8fafc] px-4 py-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                  <input type="checkbox" name="published" defaultChecked={editing ? Boolean(editing.published) : true} className="h-4 w-4 accent-[#0f8a55]" />
                  Published
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                  <input type="checkbox" name="featured" defaultChecked={editing ? Boolean(editing.featured) : false} className="h-4 w-4 accent-[#0b4f8a]" />
                  Feature on homepage
                </label>
              </div>
            </div>
          </ActionForm>
        </AdminCard>

        <AdminCard title={`All stories (${stories.length})`} description="Draft stories are hidden from the public website.">
          {stories.length === 0 ? (
            <EmptyState title="No stories yet" body="Create a news story or event notice using the form on the left." />
          ) : (
            <div className="grid gap-3">
              {stories.map((story) => (
                <article key={story.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <div className="flex gap-3">
                    {story.image_url ? (
                      <img src={story.image_url} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#94a3b8]">
                        <ImageIcon size={20} />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone={story.published ? "green" : "amber"}>{story.published ? "Live" : "Draft"}</Badge>
                        {story.featured ? <Badge tone="coral"><Star size={9} /> Featured</Badge> : null}
                        <Badge tone="blue">{story.category}</Badge>
                      </div>
                      <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-5 text-[#1e293b]">{story.title}</h3>
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#94a3b8]">
                        <CalendarDays size={11} /> {formatDate(story.event_date || story.created_at, { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#e2e8f0] pt-3">
                    <Link href={`/admin/news?edit=${story.id}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0d6db7] hover:underline">
                      <Pencil size={12} /> Edit
                    </Link>
                    {story.published ? (
                      <Link href={`/news/${story.slug}`} target="_blank" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">
                        View live
                      </Link>
                    ) : null}
                    <ActionForm action={deleteNews} submitLabel="Delete" tone="danger" compact confirm={`Delete “${story.title}”? This cannot be undone.`}>
                      <input type="hidden" name="id" value={story.id} />
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
