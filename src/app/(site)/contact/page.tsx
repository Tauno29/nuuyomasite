import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import RichText from "@/components/site/RichText";
import ContactForm from "@/components/site/ContactForm";
import { getContent } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description:
    "Contact Nuuyoma Senior Secondary School in Oshikuku, Omusati Region — phone, email, office hours, location and an online contact form.",
};

export default function ContactPage() {
  const content = getContent();
  const contactSubjects = [
    "General enquiry",
    "Admissions",
    "Boarding / hostel",
    "School fees",
    "Learner portal support",
    "Documents or records",
    "Visit the school",
  ];

  const cards = [
    ["📍", "Visit us", content["site.location"], "Oshikuku, Omusati Region, Namibia", MapPin, "#0d6db7"],
    ["📞", "Call the office", content["site.phone"], "Placeholder number — to be confirmed", Phone, "#0d6db7"],
    ["✉️", "Email us", content["site.email"], "Placeholder address — to be confirmed", Mail, "#9755ec"],
    ["🕘", "Office hours", content["site.hours"], "School terms, excluding public holidays", Clock, "#08a86b"],
  ] as const;

  return (
    <div className="bg-[#f8fafc]">
      <PageHero
        eyebrow="Contact"
        title={content["contact.intro_title"]}
        body="Our school office is ready to help learners, parents and guardians."
        breadcrumb="Contact"
      />

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(([emoji, label, value, note, Icon, color]) => (
              <div key={label} className="rounded-[1.4rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,.04)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: `${color}18`, color }} aria-hidden>
                  {emoji}
                </span>
                <div className="mt-4 text-[10px] font-extrabold uppercase tracking-[.14em]" style={{ color }}>{label}</div>
                <div className="mt-1 break-words text-base font-bold text-[#1e293b]">{value}</div>
                <div className="mt-1 text-xs leading-5 text-[#64748b]">{note}</div>
                <Icon size={14} className="mt-3 text-[#94a3b8]" />
              </div>
            ))}
          </div>

          <p className="mt-3 rounded-xl bg-[#fff4ec] px-4 py-3 text-[11px] leading-5 text-[#8a5b3a]">
            Contact details, postal address and office hours shown above are editable placeholders. The school administration
            must confirm them in Admin → Website Content before the site is promoted publicly.
          </p>

          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_.85fr]">
            <div className="rounded-[1.6rem] border border-[#e2e8f0] bg-white p-7 shadow-[0_10px_26px_rgba(15,23,42,.06)] sm:p-8">
              <h2 className="display flex items-center gap-2 text-2xl text-[#0f172a]">
                <MessageSquare size={20} className="text-[#0d6db7]" /> Send a message
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Complete the form and the school office will respond during office hours.
              </p>
              <div className="mt-6">
                <ContactForm subjects={contactSubjects} />
              </div>
            </div>

            <div className="grid gap-5">
              <div className="overflow-hidden rounded-[1.6rem] border border-[#e2e8f0] bg-white">
                <div className="relative flex h-56 items-center justify-center bg-[#e9f2ee]">
                  <div aria-hidden className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(#0b6b65 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <div className="relative text-center">
                    <MapPin size={30} className="mx-auto text-[#0d6db7]" />
                    <div className="display mt-2 text-xl text-[#0f172a]">Oshikuku</div>
                    <div className="text-xs text-[#6a7a74]">Omusati Region, Namibia</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-[#1e293b]">Finding the school</h3>
                  <RichText text={content["contact.intro_body"]} className="mt-2 text-xs text-[#64748b]" />
                  <p className="mt-3 text-[11px] text-[#94a3b8]">
                    A map will be added once the school supplies its confirmed location pin. Please contact the office for
                    directions in the meantime.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.6rem] bg-[#0d6db7] p-6 text-white">
                <h3 className="display flex items-center gap-2 text-xl"><GraduationCap size={19} className="text-[#ffd7c5]" /> Quick links</h3>
                <ul className="mt-4 grid gap-2 text-sm">
                  {[
                    ["Admissions & application", "/admissions"],
                    ["Learner Portal login", "/learner-portal"],
                    ["Boarding information", "/boarding"],
                    ["School fees", "/fees"],
                    ["News & announcements", "/news"],
                  ].map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="flex items-center justify-between rounded-lg px-2 py-2 text-white/80 transition hover:bg-white/10 hover:text-white">
                        {label} <ArrowRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
