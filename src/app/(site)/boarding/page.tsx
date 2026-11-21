import Link from "next/link";
import { ArrowRight, BedDouble, BookOpenCheck, Clock, HeartHandshake, Quote, ShieldCheck, Sparkles, Utensils } from "lucide-react";
import RichText from "@/components/site/RichText";
import { getContent } from "@/lib/site";

export const metadata = {
  title: "Boarding",
  description:
    "Boarding information for Nuuyoma Senior Secondary School — hostel accommodation, routines, meals, supervised study, fees and house rules.",
};

const included = [
  ["🛏️", "Accommodation", "Supervised hostel accommodation with shared study spaces and secure grounds."],
  ["🍲", "Meals", "Daily meals prepared on campus, with routines that support a healthy school day."],
  ["📚", "Supervised study", "Structured evening study time supported by boarding staff."],
  ["🛡️", "Pastoral care", "House routines, guidance and a safe environment that supports every learner."],
  ["⏰", "Routine", "Clear daily schedules for waking, meals, study, recreation and rest."],
  ["🤝", "Community", "A boarding community that builds responsibility, respect and friendship."],
];

const rules = [
  "Respect for staff, fellow learners and school property is expected at all times.",
  "Learners follow the hostel routine, including study and lights-out times.",
  "Visitors are received through the school office during published visiting hours.",
  "Personal items and electronics are managed according to school policy.",
  "Any concern about safety or wellbeing should be reported to hostel staff immediately.",
];

export default function BoardingPage() {
  const content = getContent();
  const principalName = content["site.principal_name"] || "School Principal";
  const principalTitle = content["site.principal_title"] || "Principal";

  return (
    <div className="bg-[#f8fafc]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0d6db7] px-5 pb-20 pt-16 text-white">
        <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div aria-hidden className="absolute -bottom-24 left-[8%] h-64 w-64 rounded-full bg-[#ffd7c5]/10" />
        <div className="relative mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[.2em] text-[#9ff0e2]">Boarding & Hostel</div>
            <h1 className="display mt-4 text-5xl leading-[.95] sm:text-6xl">{content["boarding.hero_title"]}</h1>
            <div className="mt-6 max-w-xl border-l-4 border-[#ffd7c5] pl-5 text-[15px] leading-7 text-white/85">
              <RichText text={content["boarding.hero_body"]} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/admissions#application" className="pill inline-flex items-center gap-2 bg-[#60a5fa] px-7 py-3.5 text-sm font-bold text-[#123d40] hover:bg-[#ffb18d]">
                Apply for boarding <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="pill border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/15">
                Ask about availability
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/70">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Supervised campus</span>
              <span className="flex items-center gap-1.5"><Utensils size={14} /> Meals included</span>
              <span className="flex items-center gap-1.5"><BookOpenCheck size={14} /> Evening study</span>
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/gallery/campus.webp"
              alt="Illustrative placeholder view of the school campus"
              className="aspect-[4/3] w-full rounded-[1.8rem] border-4 border-white/30 object-cover shadow-2xl"
            />
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white p-4 text-[#0f172a] shadow-xl sm:left-10 sm:right-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9faf6] text-[#0d6db7]"><BedDouble size={19} /></span>
                <div>
                  <div className="text-sm font-bold">Hostel accommodation</div>
                  <div className="text-[11px] text-[#64748b]">Availability is confirmed by the school office.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEES */}
      <section className="mx-auto -mt-8 max-w-[1160px] px-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#60a5fa] via-[#ff7411] to-[#ff8700] p-7 text-white shadow-xl">
            <Sparkles size={22} className="text-white/80" />
            <div className="mt-3 text-xs font-extrabold uppercase tracking-[.16em] text-white/80">Registration</div>
            <div className="display mt-1 text-4xl">{content["boarding.fee_registration"]}</div>
            <p className="mt-2 text-sm text-white/85">One-off boarding registration payable on acceptance.</p>
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#0b8f88] to-[#00635d] p-7 text-white shadow-xl">
            <Clock size={22} className="text-white/80" />
            <div className="mt-3 text-xs font-extrabold uppercase tracking-[.16em] text-white/80">Monthly boarding fee</div>
            <div className="display mt-1 text-4xl">{content["boarding.fee_monthly"]}</div>
            <p className="mt-2 text-sm text-white/85">Payable by the 7th of each month while the learner is boarding.</p>
          </div>
        </div>
        <p className="mt-3 rounded-xl bg-[#fff4ec] px-4 py-3 text-xs leading-6 text-[#8a5b3a]">
          {content["boarding.note"]}
        </p>
      </section>

      {/* INCLUDED */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <div className="eyebrow">Life in the Hostel</div>
            <h2 className="display mt-3 text-4xl text-[#0f172a]">What boarding includes</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#697584]">
              Boarding is more than a room — it is a routine, a community and a supported place to study.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {included.map(([icon, title, body]) => (
              <div key={title} className="rounded-[1.4rem] border border-[#d9efe9] bg-white p-6 shadow-[0_6px_18px_rgba(8,126,120,.06)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9faf6] text-2xl" aria-hidden>{icon}</div>
                <h3 className="display mt-4 text-xl text-[#0b6b65]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64706e]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="px-5">
        <div className="mx-auto max-w-[1160px] rounded-[2rem] bg-white p-8 shadow-[0_14px_34px_rgba(15,23,42,.06)] sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
            <img
              src={content["site.principal_photo"] || "/assets/principal-placeholder.webp"}
              alt={`${principalName} — placeholder portrait`}
              className="mx-auto h-40 w-40 rounded-full border-4 border-[#e9faf6] object-cover object-top"
            />
            <div>
              <Quote size={26} className="text-[#0d6db7]" aria-hidden />
              <blockquote className="mt-3 text-lg font-semibold leading-8 text-[#3d4544]">
                &ldquo;Our hostel exists to give every learner a safe, calm and well-ordered place to live and learn.
                Boarding is a partnership between the school and the family.&rdquo;
              </blockquote>
              <div className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-[#0b6b65]">
                — {principalName}, {principalTitle}
              </div>
              <p className="mt-2 text-[11px] text-[#94a3b8]">Placeholder quotation — editable in Admin → Website Content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-[1160px] gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <div className="eyebrow">Hostel Rules</div>
            <h2 className="display mt-3 text-4xl text-[#0f172a]">A shared home, shared responsibility</h2>
            <p className="mt-4 text-sm leading-7 text-[#5d6977]">
              Boarding learners are expected to contribute to a safe and respectful community. The full hostel rules are
              explained during registration.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#e9faf6] p-4 text-sm text-[#0b6b65]">
              <HeartHandshake size={22} className="shrink-0" />
              <span>Pastoral support is available to every boarding learner.</span>
            </div>
          </div>
          <ul className="grid gap-3">
            {rules.map((rule, index) => (
              <li key={rule} className="flex gap-3 rounded-xl border border-[#e7efed] bg-white p-4 text-sm leading-6 text-[#475569]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0d6db7] text-[10px] font-extrabold text-white">
                  {index + 1}
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto flex max-w-[1160px] flex-col items-center justify-between gap-5 rounded-[2rem] bg-[#0f172a] px-8 py-10 text-white sm:flex-row sm:px-12">
          <div>
            <h2 className="display text-3xl">Choosing boarding for your child?</h2>
            <p className="mt-2 text-sm text-white/70">Contact the school office to confirm availability and arrange a visit.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="pill bg-[#60a5fa] px-6 py-3 text-sm font-bold text-[#0f172a] hover:bg-[#ffb18d]">
              Contact the office
            </Link>
            <Link href="/fees" className="pill border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
              View fees
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
