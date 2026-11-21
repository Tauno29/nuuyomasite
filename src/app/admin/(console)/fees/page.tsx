import { Coins, Info, Plus } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { deleteFee, saveFee } from "@/app/admin/actions";
import { db } from "@/lib/db";
import type { FeeItem } from "@/lib/site";

export const metadata = { title: "Fee structures" };

export default function AdminFeesPage() {
  const fees = db.prepare("SELECT * FROM fees ORDER BY sort_order, id").all() as FeeItem[];
  const groups = [...new Set(fees.map((fee) => fee.group_name))];
  const groupSuggestions = [...new Set([...groups, "School payments", "Boarding", "School items"])];

  const subtitle = "Amounts marked TBC are shown as “to be confirmed” on the public fees page. Confirm official amounts with the school office before publishing.";

  return (
    <div>
      <AdminPageHeader eyebrow="School" title="Fee structures" body={subtitle} />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[.75fr_1.25fr]">
        <AdminCard title="Add a fee line" description="Group related items (e.g. School payments, Boarding) and order them for display.">
          <ActionForm action={saveFee} submitLabel="Add fee line" pendingLabel="Saving…" tone="coral" resetOnSuccess>
            <div className="grid gap-3">
              <label className="block">
                <span className={adminLabel}>Group *</span>
                <input name="group_name" required list="fee-groups" maxLength={80} className={`mt-1.5 ${adminInput}`} placeholder="School payments" />
                <datalist id="fee-groups">
                  {groupSuggestions.map((group) => (
                    <option key={group} value={group} />
                  ))}
                </datalist>
              </label>
              <label className="block">
                <span className={adminLabel}>Fee label *</span>
                <input name="label" required maxLength={120} className={`mt-1.5 ${adminInput}`} placeholder="e.g. School development fund" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={adminLabel}>Amount *</span>
                  <input name="amount" required maxLength={40} className={`mt-1.5 ${adminInput}`} placeholder="N$ 0.00 or TBC" />
                </label>
                <label className="block">
                  <span className={adminLabel}>Order</span>
                  <input name="sort_order" type="number" min={0} max={9999} defaultValue={fees.length} className={`mt-1.5 ${adminInput}`} />
                </label>
              </div>
              <label className="block">
                <span className={adminLabel}>Note</span>
                <input name="note" maxLength={200} className={`mt-1.5 ${adminInput}`} placeholder="e.g. Payable before the 7th of each month" />
              </label>
            </div>
          </ActionForm>
          <div className="mt-4 flex gap-2 rounded-xl bg-[#fff7ef] p-3 text-[10px] leading-5 text-[#8a5a20]">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p>Use clearly identifiable placeholders rather than inventing amounts. Replace “TBC” once the school confirms its official fee schedule.</p>
          </div>
        </AdminCard>

        <AdminCard title={`Fee schedule (${fees.length})`} description="Changes update the public Fees page and boarding fee cards immediately.">
          {fees.length === 0 ? (
            <EmptyState icon={<Coins size={22} />} title="No fee lines yet" body="Add the first fee line using the form on the left." />
          ) : (
            <div className="grid gap-5">
              {groups.map((group) => {
                const items = fees.filter((fee) => fee.group_name === group);
                return (
                  <section key={group}>
                    <div className="flex items-center justify-between gap-3 border-b border-[#efe7e1] pb-2">
                      <h3 className="text-[11px] font-extrabold uppercase tracking-[.1em] text-[#0f172a]">{group}</h3>
                      <Badge tone="grey">{items.length} {items.length === 1 ? "line" : "lines"}</Badge>
                    </div>
                    <div className="mt-2 grid gap-2">
                      {items.map((fee) => (
                        <details key={fee.id} className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-3">
                          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#1e293b]">
                            <span>{fee.label}</span>
                            <span className="flex items-center gap-2">
                              <span className={`rounded-md px-2 py-1 text-[10px] font-extrabold ${fee.amount.trim().toUpperCase() === "TBC" ? "bg-[#e9f4ff] text-[#0b4f8a]" : "bg-[#eef7f1] text-[#0f8a55]"}`}>
                                {fee.amount}
                              </span>
                              <span className="text-[9px] font-semibold text-[#94a3b8]">#{fee.sort_order}</span>
                            </span>
                          </summary>
                          {fee.note && <p className="mt-1.5 text-[10px] leading-5 text-[#64748b]">{fee.note}</p>}
                          <div className="mt-3 border-t border-[#e2e8f0] pt-3">
                            <ActionForm action={saveFee} submitLabel="Save changes" tone="navy" compact>
                              <input type="hidden" name="id" value={fee.id} />
                              <div className="grid gap-2">
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <input name="group_name" required defaultValue={fee.group_name} maxLength={80} className={adminInput} aria-label="Group" list="fee-groups" />
                                  <input name="label" required defaultValue={fee.label} maxLength={120} className={adminInput} aria-label="Label" />
                                </div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <input name="amount" required defaultValue={fee.amount} maxLength={40} className={adminInput} aria-label="Amount" />
                                  <input name="sort_order" type="number" min={0} max={9999} defaultValue={fee.sort_order} className={adminInput} aria-label="Order" />
                                </div>
                                <input name="note" defaultValue={fee.note ?? ""} maxLength={200} className={adminInput} aria-label="Note" placeholder="Note" />
                              </div>
                            </ActionForm>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <ActionForm action={deleteFee} submitLabel="Remove" tone="danger" compact confirm={`Remove “${fee.label}” from the fee schedule?`}>
                              <input type="hidden" name="id" value={fee.id} />
                            </ActionForm>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                );
              })}
              <p className="flex items-center gap-1.5 text-[10px] text-[#94a3b8]">
                <Plus size={11} /> Open any fee line to edit its details or remove it.
              </p>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
