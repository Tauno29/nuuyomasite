import Link from "next/link";
import { AlertTriangle, ArrowRight, Banknote, Download, Phone, Wallet } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import RichText from "@/components/site/RichText";
import { getContent, getFees } from "@/lib/site";

export const metadata = {
  title: "School Fees",
  description:
    "School fee information for Nuuyoma Senior Secondary School, including registration, boarding and other payment categories. Amounts are placeholders pending the official fee schedule.",
};

export default function FeesPage() {
  const content = getContent();
  const fees = getFees();
  const groups = Array.from(new Set(fees.map((fee) => fee.group_name)));
  const byGroup = (group: string) => fees.filter((fee) => fee.group_name === group);

  return (
    <div className="bg-[#f8fafc]">
      <PageHero
        eyebrow="Fees & Payments"
        title={content["fees.intro_title"]}
        body="A clear overview of the payment categories families may need to plan for."
        tone="orange"
        breadcrumb="Fees"
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[980px]">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["🏫", "State school", "Nuuyoma SSS is a state secondary school."],
              ["🧾", "Confirmed rates", "Official amounts are published once approved."],
              ["🏦", "School banking", "Confirm banking details with the office before paying."],
            ].map(([icon, title, body]) => (
              <div key={title} className="rounded-2xl border border-[#e2e8f0] bg-white p-5 text-center">
                <div className="text-2xl" aria-hidden>{icon}</div>
                <div className="mt-2 text-sm font-bold text-[#1e293b]">{title}</div>
                <p className="mt-1 text-xs leading-5 text-[#64748b]">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[1.5rem] border border-[#f3d3bf] bg-[#fff4ec] p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-[#c25a00]" />
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-[.1em] text-[#0b4f8a]">Important notice</h2>
                <p className="mt-2 text-sm leading-6 text-[#6a5142]">{content["fees.note"]}</p>
              </div>
            </div>
          </div>

          <RichText text={content["fees.intro_body"]} className="mt-8 text-[15px] text-[#5d6977]" />

          <div className="mt-10 grid gap-8">
            {groups.map((group, index) => (
              <section key={group} className="overflow-hidden rounded-[1.5rem] border border-[#e2e8f0] bg-white shadow-[0_8px_22px_rgba(15,23,42,.04)]">
                <div className="flex items-center gap-4 border-b border-[#f2ebe5] bg-[#f8fafc] px-6 py-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff7411] text-sm font-extrabold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="display text-2xl text-[#0f172a]">{group}</h2>
                    <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#94a3b8]">Payment category</p>
                  </div>
                  <Wallet size={20} className="ml-auto text-[#f0a400]" />
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-white text-[10px] font-extrabold uppercase tracking-[.14em] text-[#0b4f8a]">
                      <th className="px-6 py-3">Item</th>
                      <th className="px-6 py-3 text-right">Amount (NAD)</th>
                      <th className="hidden px-6 py-3 sm:table-cell">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byGroup(group).map((fee) => (
                      <tr key={fee.id} className="border-t border-[#f2ebe5]">
                        <td className="px-6 py-4 font-bold text-[#1e293b]">{fee.label}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`pill inline-block px-3 py-1 text-xs font-extrabold ${fee.amount.toLowerCase() === "tbc" ? "bg-[#e9f4ff] text-[#0b4f8a]" : "bg-[#e9faf1] text-[#0f8a55]"}`}>
                            {fee.amount}
                          </span>
                        </td>
                        <td className="hidden px-6 py-4 text-xs leading-5 text-[#64748b] sm:table-cell">{fee.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
            {groups.length === 0 && (
              <p className="rounded-2xl border border-dashed border-[#d9cfc7] bg-white p-8 text-center text-sm text-[#7c7168]">
                Fee information has not been published yet.
              </p>
            )}
          </div>

          <div className="mt-10 rounded-[1.5rem] bg-[#0f172a] p-7 text-white sm:p-9">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="display flex items-center gap-2 text-2xl"><Banknote size={22} className="text-[#0d6db7]" /> Questions about fees?</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                  Never make a payment to an unverified account. Confirm the amount, reference and banking details directly
                  with the school office first.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-6 py-3 text-sm font-bold text-white hover:bg-[#ff9b79]">
                  <Phone size={15} /> Contact the office
                </Link>
                <Link href="/admissions#application" className="pill inline-flex items-center gap-2 border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
                  Admissions <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-[#94a3b8]">
            <Download size={13} /> A downloadable fee schedule will appear here when uploaded by the school administration.
          </p>
        </div>
      </section>
    </div>
  );
}
