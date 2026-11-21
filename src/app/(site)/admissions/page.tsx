import Link from "next/link";
import { ArrowDown, ArrowRight, CalendarDays, CheckCircle2, Download, FileText, Info, ListChecks, Phone } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import RichText from "@/components/site/RichText";
import ApplicationForm from "@/components/site/ApplicationForm";
import { formatDate, getContent, getPublicDocuments, parseLines } from "@/lib/site";

export const metadata = {
  title: "Admissions",
  description:
    "Admissions information for Nuuyoma Senior Secondary School — requirements, application procedure, important dates, downloadable documents and the online application form.",
};

export default function AdmissionsPage() {
  const content = getContent();
  const requirements = parseLines(content["admissions.requirements"]);
  const procedure = parseLines(content["admissions.procedure"]);
  const dates = parseLines(content["admissions.dates"]).map((line) => {
    const [label, date, note] = line.split("|").map((part) => part.trim());
    return { label, date: date || "To be confirmed", note };
  });
  const documents = getPublicDocuments();

  return (
    <div className="bg-[#f8fafc]">
      <PageHero
        eyebrow="Admissions"
        title={content["admissions.intro_title"]}
        body="Everything you need to apply for a place in Grades 8 to 12 — requirements, dates and the online application form."
        breadcrumb="Admissions"
      >
        <div className="flex flex-wrap gap-3">
          <a href="#application" className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-6 py-3 text-sm font-bold text-white hover:-translate-y-0.5">
            Apply online <ArrowDown size={15} />
          </a>
          <a href="#dates" className="pill border border-[#0f172a]/15 bg-white px-6 py-3 text-sm font-bold text-[#0f172a] hover:border-[#0f172a]/35">
            Key dates
          </a>
        </div>
      </PageHero>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1160px]">
          <div className="rounded-[1.4rem] border border-[#f3d3bf] bg-[#fff4ec] p-6">
            <div className="flex items-start gap-3">
              <Info size={20} className="mt-0.5 shrink-0 text-[#0b4f8a]" />
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-[.1em] text-[#0b4f8a]">Before you apply</h2>
                <p className="mt-2 text-sm leading-6 text-[#6a5142]">{content["admissions.note"]}</p>
                <RichText text={content["admissions.intro_body"]} className="mt-2 text-sm text-[#6a5142]" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
            {/* REQUIREMENTS */}
            <div className="rounded-[1.5rem] border border-[#e2e8f0] bg-white p-7 shadow-[0_8px_22px_rgba(15,23,42,.05)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f4ff] text-[#0b4f8a]"><ListChecks size={20} /></span>
                <h2 className="display text-2xl text-[#0f172a]">Admission requirements</h2>
              </div>
              <ul className="mt-5 grid gap-3">
                {requirements.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#475569]">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#08a86b]" /> {item}
                  </li>
                ))}
                {requirements.length === 0 && <li className="text-sm text-[#7c7168]">Requirements will be published here by the school office.</li>}
              </ul>
            </div>

            {/* PROCEDURE */}
            <div className="rounded-[1.5rem] border border-[#e2e8f0] bg-white p-7 shadow-[0_8px_22px_rgba(15,23,42,.05)]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3edff] text-[#7c3fc0]"><FileText size={20} /></span>
                <h2 className="display text-2xl text-[#0f172a]">How to apply</h2>
              </div>
              <ol className="mt-5 grid gap-4">
                {procedure.map((item, index) => (
                  <li key={item} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0f172a] text-[11px] font-extrabold text-white">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-sm leading-6 text-[#475569]">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* DATES */}
          <div id="dates" className="mt-12 scroll-mt-24">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f7ff] text-[#0d6db7]"><CalendarDays size={20} /></span>
              <div>
                <h2 className="display text-2xl text-[#0f172a]">Important dates</h2>
                <p className="text-xs text-[#64748b]">Dates are placeholders until confirmed by the school office.</p>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-[1.3rem] border border-[#e2e8f0] bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#e9f4ff] text-[10px] font-extrabold uppercase tracking-[.14em] text-[#0b4f8a]">
                    <th className="px-5 py-3.5">Stage</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="hidden px-5 py-3.5 sm:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {dates.map((row) => (
                    <tr key={row.label} className="border-t border-[#f2ebe5]">
                      <td className="px-5 py-4 font-bold text-[#1e293b]">{row.label}</td>
                      <td className="px-5 py-4 text-[#6a625b]">{row.date}</td>
                      <td className="hidden px-5 py-4 text-xs text-[#64748b] sm:table-cell">{row.note}</td>
                    </tr>
                  ))}
                  {dates.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-5 py-6 text-center text-sm text-[#7c7168]">
                        No dates have been published yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* DOWNLOADS */}
          <div className="mt-12 rounded-[1.5rem] bg-[#0f172a] p-7 text-white sm:p-9">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[.18em] text-[#0d6db7]">Downloads</div>
                <h2 className="display mt-2 text-3xl">Application documents</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                  Download the documents you need. If you apply online, the school office will contact you about supporting documents.
                </p>
              </div>
              <Link href="/contact" className="pill inline-flex shrink-0 items-center gap-2 border border-white/25 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10">
                <Phone size={14} /> Ask the office
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.file_url}
                  className="group flex items-center gap-3 rounded-xl bg-white/10 p-4 transition hover:bg-white/15"
                  download
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0d6db7] text-white"><Download size={17} /></span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{doc.title}</span>
                    <span className="block truncate text-[11px] text-white/55">{doc.description || doc.category}</span>
                  </span>
                  <ArrowRight size={15} className="ml-auto shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" />
                </a>
              ))}
              {documents.length === 0 && (
                <p className="text-sm text-white/60">No documents are published yet. Please contact the school office.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section id="application" className="scroll-mt-24 bg-white px-5 py-20">
        <div className="mx-auto grid max-w-[1160px] items-start gap-10 lg:grid-cols-[.62fr_1fr]">
          <div className="lg:sticky lg:top-28">
            <div className="eyebrow">Apply Online</div>
            <h2 className="display mt-4 text-4xl leading-tight text-[#0f172a] sm:text-5xl">Start your application</h2>
            <p className="mt-4 text-sm leading-7 text-[#5d6977]">
              Complete the application form in three short steps. Your details are sent securely to the school office and
              reviewed by the admissions team.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-[#475569]">
              {[
                "Three steps, about five minutes.",
                "You will see a confirmation once it is sent.",
                "The school will contact you after review.",
                "Applying online does not guarantee placement.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#08a86b]" /> {line}
                </li>
              ))}
            </ul>
            <div className="mt-7 rounded-2xl bg-[#f8fafc] p-5 text-xs leading-6 text-[#7c7168]">
              <strong className="text-[#1e293b]">Need help?</strong> Contact the school office during office hours:
              <div className="mt-1 font-bold text-[#0b4f8a]">{content["site.phone"]}</div>
              <div>{content["site.email"]}</div>
              <div className="mt-1 text-[11px] text-[#94a3b8]">Contact details are placeholders pending confirmation.</div>
            </div>
          </div>
          <ApplicationForm />
        </div>
      </section>

      <div className="px-5 pb-20">
        <div className="mx-auto max-w-[1160px] rounded-[1.5rem] border border-[#e2e8f0] bg-white px-7 py-6 text-xs leading-6 text-[#64748b]">
          Last updated by the school administration. Admission is subject to available places and the admission policy of
          Nuuyoma Senior Secondary School and the Ministry of Education, Arts and Culture.
        </div>
      </div>
    </div>
  );
}
