import { AdminPageHeader, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { saveContent } from "@/app/admin/actions";
import { contentDefinitions, type ContentGroup } from "@/lib/content";
import { getContent } from "@/lib/site";

export const metadata = { title: "Website Content" };

const groupOrder: ContentGroup[] = ["Brand", "Homepage", "About", "Academics", "Admissions", "Boarding", "Gallery", "Fees", "Contact / Footer"];

export default function AdminContentPage() {
  const content = getContent();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Website"
        title="Website content"
        body="Edit the words, headings and contact details that appear on the public website. Changes are saved to the database and publish immediately."
      />

      <div className="mt-5 rounded-xl border border-[#dbeafe] bg-[#fff8f2] px-4 py-3 text-[11px] leading-5 text-[#8a5b3a]">
        Placeholders such as the principal&apos;s name, phone number and fees are intentionally marked for confirmation. Only publish
        information the school has verified. Fields left blank will disappear from the public page.
      </div>

      <div className="mt-6 grid gap-6">
        {groupOrder.map((group) => {
          const fields = contentDefinitions.filter((def) => def.group === group);
          if (fields.length === 0) return null;
          return (
            <section key={group} className="rounded-2xl border border-[#e9e0d8] bg-white shadow-[0_4px_14px_rgba(15,23,42,.04)]">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-sm font-extrabold text-[#0f172a]">{group}</h2>
                  <p className="mt-0.5 text-[11px] text-[#94a3b8]">{fields.length} editable fields</p>
                </div>
                <span className="rounded-full bg-[#f4f0ec] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#64748b]">
                  {group === "Brand" ? "Site-wide" : "Public page"}
                </span>
              </div>
              <div className="px-5 py-5 sm:px-6">
                <ActionForm action={saveContent} submitLabel={`Save ${group}`} pendingLabel="Saving…" tone="navy">
                  <div className="grid gap-4 md:grid-cols-2">
                    {fields.map((field) => {
                      const value = content[field.key] ?? "";
                      const isWide = field.type !== "text";
                      const isAlertToggle = field.key === "alert.enabled";
                      return (
                        <label key={field.key} className={`block ${isWide ? "md:col-span-2" : ""}`}>
                          <span className={adminLabel}>{field.label}</span>
                          {isAlertToggle ? (
                            <select name={field.key} defaultValue={value === "no" ? "no" : "yes"} className={`mt-1.5 ${adminInput}`}>
                              <option value="yes">Show the announcement bar</option>
                              <option value="no">Hide the announcement bar</option>
                            </select>
                          ) : field.type === "text" ? (
                            <input name={field.key} defaultValue={value} maxLength={field.type === "text" ? 500 : undefined} className={`mt-1.5 ${adminInput}`} />
                          ) : (
                            <textarea
                              name={field.key}
                              defaultValue={value}
                              rows={field.type === "longtext" ? 6 : 3}
                              maxLength={20000}
                              className={`mt-1.5 ${adminInput}`}
                            />
                          )}
                          {field.help && <span className="mt-1 block text-[10px] leading-4 text-[#94a3b8]">{field.help}</span>}
                          {field.type !== "text" && (
                            <span className="mt-0.5 block text-[9px] text-[#94a3b8]">Blank lines create new paragraphs. Start a line with “## ” for a heading.</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </ActionForm>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
