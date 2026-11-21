import { ImagePlus, Images, Upload } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { addGallery, deleteGallery, updateGallery } from "@/app/admin/actions";
import { getGallery } from "@/lib/site";

export const metadata = { title: "Gallery" };

const defaultCategories = ["Campus", "Classrooms", "Academics", "Sports", "Culture", "Events", "Learners", "Teachers"];

export default function AdminGalleryPage() {
  const items = getGallery(true);
  const categories = Array.from(new Set([...defaultCategories, ...items.map((item) => item.category)]));

  return (
    <div>
      <AdminPageHeader
        eyebrow="Website"
        title="Gallery media"
        body="Upload and organise the photographs shown in the public gallery and homepage preview. Images are stored in the school's uploads folder."
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[.75fr_1.25fr]">
        <AdminCard title="Upload photographs" description="Select one or more images. Uploads remain unpublished until you tick “Published”.">
          <ActionForm action={addGallery} submitLabel="Add to gallery" pendingLabel="Uploading…" tone="coral" resetOnSuccess>
            <div className="grid gap-4">
              <label className="block">
                <span className={adminLabel}>Title *</span>
                <input name="title" required maxLength={140} className={`mt-1.5 ${adminInput}`} placeholder="e.g. Science laboratory" />
              </label>
              <label className="block">
                <span className={adminLabel}>Category *</span>
                <select name="category" className={`mt-1.5 ${adminInput}`} defaultValue="Campus">
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={adminLabel}>Files *</span>
                <div className="mt-1.5 rounded-xl border-2 border-dashed border-[#d9cfc7] bg-[#f8fafc] p-4 text-center">
                  <ImagePlus size={22} className="mx-auto text-[#0b4f8a]" />
                  <input type="file" name="images" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="mt-2 w-full text-[11px] text-[#475569]" />
                  <p className="mt-1 text-[10px] text-[#94a3b8]">JPG, PNG, WEBP or GIF · max 8 MB each</p>
                </div>
              </label>
              <label className="block">
                <span className={adminLabel}>Or image URL</span>
                <input name="image_url" maxLength={500} className={`mt-1.5 ${adminInput}`} placeholder="/assets/gallery/campus.webp" />
              </label>
              <label className="block">
                <span className={adminLabel}>Caption (optional)</span>
                <input name="caption" maxLength={300} className={`mt-1.5 ${adminInput}`} placeholder="Shown in the image viewer" />
              </label>
              <label className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-4 py-3 text-xs font-semibold text-[#475569]">
                <input type="checkbox" name="published" defaultChecked className="h-4 w-4 accent-[#0f8a55]" /> Publish immediately
              </label>
            </div>
          </ActionForm>
        </AdminCard>

        <AdminCard
          title={`Gallery items (${items.length})`}
          description="Drag-free ordering: set the sort number to control the gallery order."
          action={<span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#94a3b8]"><Images size={12} /> {items.filter((item) => item.category).length} items</span>}
        >
          {items.length === 0 ? (
            <EmptyState title="No photographs yet" body="Upload your first photograph using the form on the left." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
                  <div className="relative">
                    <img src={item.image_url} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                    <span className="absolute left-2 top-2">
                      <Badge tone={item.published ? "green" : "amber"}>{item.published ? "Live" : "Draft"}</Badge>
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <Badge tone="coral">{item.category}</Badge>
                      <span className="text-[9px] font-bold text-[#94a3b8]">#{item.sort_order}</span>
                    </div>
                    <h3 className="mt-1.5 truncate text-xs font-bold text-[#1e293b]">{item.title}</h3>
                    {item.caption && <p className="mt-0.5 line-clamp-1 text-[10px] text-[#94a3b8]">{item.caption}</p>}

                    <details className="group mt-2 border-t border-[#e2e8f0] pt-2">
                      <summary className="cursor-pointer list-none text-[10px] font-extrabold uppercase tracking-[.08em] text-[#0d6db7]">
                        Edit details ▾
                      </summary>
                      <ActionForm action={updateGallery} submitLabel="Save" tone="navy" compact className="mt-2">
                        <input type="hidden" name="id" value={item.id} />
                        <div className="grid gap-2">
                          <input name="title" defaultValue={item.title} required maxLength={140} className={adminInput} aria-label="Title" />
                          <select name="category" defaultValue={item.category} className={adminInput} aria-label="Category">
                            {categories.map((category) => (
                              <option key={category}>{category}</option>
                            ))}
                          </select>
                          <input name="caption" defaultValue={item.caption ?? ""} maxLength={300} className={adminInput} placeholder="Caption" aria-label="Caption" />
                          <div className="flex items-center gap-3">
                            <input type="number" name="sort_order" defaultValue={item.sort_order} min={0} className={`${adminInput} w-24`} aria-label="Sort order" />
                            <label className="flex items-center gap-1.5 text-[10px] font-semibold text-[#475569]">
                              <input type="checkbox" name="published" defaultChecked={Boolean(item.published)} className="h-3.5 w-3.5 accent-[#0f8a55]" /> Published
                            </label>
                          </div>
                        </div>
                      </ActionForm>
                    </details>

                    <div className="mt-2">
                      <ActionForm action={deleteGallery} submitLabel="Delete" tone="danger" compact confirm={`Delete “${item.title}”? The image will be removed.`}>
                        <input type="hidden" name="id" value={item.id} />
                      </ActionForm>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      <p className="mt-5 flex items-center gap-2 text-[10px] leading-5 text-[#94a3b8]">
        <Upload size={12} /> Uploaded files are validated by type and size. On serverless hosting, use a persistent object store for
        long-term media storage.
      </p>
    </div>
  );
}
