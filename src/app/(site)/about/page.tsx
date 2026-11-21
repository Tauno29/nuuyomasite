import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarClock, Compass, MapPin, Quote, ShieldCheck, Users } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import RichText from "@/components/site/RichText";
import { getContent, getStats, getValues } from "@/lib/site";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Nuuyoma Senior Secondary School in Oshikuku, Omusati Region — our overview, mission, vision, values, history and leadership.",
};

const valueTones = ["#0d6db7", "#9755ec", "#08be74", "#f0a400", "#2a9fd0", "#e15a97"];

export default function AboutPage() {
  const content = getContent();
  const values = getValues();
  const stats = getStats();
  const principalName = content["site.principal_name"] || "School Principal";
  const principalTitle = content["site.principal_title"] || "Principal";

  return (
    <div className="bg-[#f8fafc]">
      <PageHero
        eyebrow="About Us"
        title={content["about.overview_title"]}
        body="A state senior secondary school serving Grades 8 to 12 in Oshikuku, Omusati Region, Namibia."
        breadcrumb="About"
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/academics" className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-6 py-3 text-sm font-bold text-white hover:-translate-y-0.5">
            Our academics <ArrowRight size={15} />
          </Link>
          <Link href="/contact" className="pill border border-[#0f172a]/15 bg-white px-6 py-3 text-sm font-bold text-[#0f172a] hover:border-[#0f172a]/35">
            Contact the school
          </Link>
        </div>
      </PageHero>

      {/* OVERVIEW */}
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-[1160px] items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="eyebrow">School Overview</div>
            <h2 className="display mt-4 text-3xl leading-tight text-[#0f172a] sm:text-4xl">{content["about.overview_title"]}</h2>
            <RichText text={content["about.overview_body"]} className="mt-5 text-[15px] text-[#5d6977]" />
            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="rounded-2xl border border-[#e2e8f0] bg-white p-4 text-center">
                  <div className="display text-2xl text-[#0f172a]">{stat.value}</div>
                  <div className="mt-1 text-[11px] font-semibold text-[#64748b]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute -inset-3 rotate-[-2deg] rounded-[1.8rem] bg-[#f8e5db]" />
            <img
              src="/assets/gallery/campus.jpg"
              alt="Illustrative placeholder view of a school campus"
              className="relative aspect-[4/3] w-full rounded-[1.5rem] border-4 border-white object-cover shadow-xl"
            />
            <div className="absolute -bottom-6 left-5 right-5 flex items-center gap-3 rounded-2xl bg-[#0f172a] px-5 py-4 text-white shadow-xl sm:left-8 sm:right-8">
              <MapPin size={20} className="shrink-0 text-[#0d6db7]" />
              <div>
                <div className="text-sm font-bold">{content["site.location"]}</div>
                <div className="text-[11px] text-white/60">Placeholder photograph — replace with an official campus photo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION MISSION */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <div className="eyebrow">Vision, Mission & Motto</div>
            <h2 className="display mt-4 text-4xl text-[#0f172a]">{content["home.identity_title"]}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#697584]">{content["about.identity_note"]}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="relative rounded-[1.5rem] border-2 border-[#e7d3f7] bg-[#fbf5ff] p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#60a5fa] text-2xl text-white"><Compass size={24} /></span>
              <h3 className="display mt-5 text-sm font-extrabold uppercase tracking-[.14em] text-[#60a5fa]">Our Vision</h3>
              <p className="mt-3 text-lg font-bold leading-relaxed text-[#3f3350]">{content["home.vision_title"]}</p>
            </article>
            <article className="relative rounded-[1.5rem] border-2 border-[#f5e2b7] bg-[#fffaf0] p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5a02b] text-2xl text-white"><BookOpenCheck size={24} /></span>
              <h3 className="display mt-5 text-sm font-extrabold uppercase tracking-[.14em] text-[#a86f0a]">Our Mission</h3>
              <p className="mt-3 text-lg font-bold leading-relaxed text-[#4a3b1c]">{content["home.mission_title"]}</p>
            </article>
            <article className="relative rounded-[1.5rem] border-2 border-[#bfeef1] bg-[#f0fdff] p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#20b9c3] text-2xl text-white"><ShieldCheck size={24} /></span>
              <h3 className="display mt-5 text-sm font-extrabold uppercase tracking-[.14em] text-[#0a7f87]">Our Motto</h3>
              <p className="mt-3 text-lg font-bold leading-relaxed text-[#123d40]">{content["home.motto_title"]}</p>
            </article>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow">What We Stand For</div>
              <h2 className="display mt-3 text-4xl text-[#0f172a]">Our Core Values</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#697584]">
              These values shape the daily life of our classrooms, hostel and school community.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => {
              const color = valueTones[index % valueTones.length];
              return (
                <div key={value.id} className="group rounded-[1.4rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,.09)]">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: `${color}1a` }}>
                      {value.icon}
                    </span>
                    <span className="text-[10px] font-extrabold tracking-[.16em] text-[#94a3b8]">0{index + 1}</span>
                  </div>
                  <h3 className="display mt-4 text-xl" style={{ color }}>{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#6a625b]">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="bg-[#0d6db7] px-5 py-20 text-white">
        <div className="mx-auto grid max-w-[1160px] gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[.2em] text-[#a7f0df]">Heritage</div>
            <h2 className="display mt-4 text-4xl leading-tight sm:text-5xl">{content["about.history_title"]}</h2>
            <div className="mt-6 border-l-4 border-[#0d6db7] pl-5 text-sm leading-7 text-white/85">
              <RichText text={content["about.history_body"]} />
            </div>
          </div>
          <div className="grid gap-4 self-center">
            {[
              ["1985", "The school was inaugurated and opened its doors to learners from Oshikuku and surrounding communities."],
              ["Today", "NSSS serves Grades 8 to 12, offering academic subjects, boarding facilities and co-curricular life."],
              ["Next chapter", "Milestones, archives and achievements will be published here as they are confirmed by the school."],
            ].map(([label, body], index) => (
              <div key={label} className="flex gap-5 rounded-2xl bg-white/10 p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-extrabold tracking-wide">
                  {index === 0 ? <CalendarClock size={22} /> : index === 1 ? <Users size={22} /> : <Compass size={22} />}
                </div>
                <div>
                  <div className="display text-lg text-[#ffd7c5]">{label}</div>
                  <p className="mt-1 text-sm leading-6 text-white/75">{body}</p>
                </div>
              </div>
            ))}
            <p className="text-[11px] leading-5 text-white/45">
              Placeholder history. The school administration must verify dates and milestones before publication.
            </p>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <div className="eyebrow">Leadership</div>
            <h2 className="display mt-4 text-4xl text-[#0f172a]">{content["about.leadership_title"]}</h2>
          </div>
          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[.42fr_1fr]">
            <div className="rounded-[1.6rem] border border-[#e2e8f0] bg-white p-5 text-center shadow-[0_10px_26px_rgba(15,23,42,.06)]">
              <img
                src={content["site.principal_photo"] || "/assets/principal-placeholder.jpg"}
                alt={`${principalName} — placeholder portrait`}
                className="aspect-[4/5] w-full rounded-[1.2rem] object-cover object-top"
              />
              <div className="display mt-4 text-2xl text-[#0f172a]">{principalName}</div>
              <div className="text-sm text-[#64748b]">{principalTitle}</div>
              <div className="mt-3 inline-flex rounded-full bg-[#e9f4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#0b4f8a]">
                Placeholder portrait
              </div>
            </div>
            <div className="grid gap-6">
              <RichText text={content["about.leadership_body"]} className="text-[15px] text-[#5d6977]" />
              <blockquote className="rounded-[1.4rem] bg-white p-7 shadow-[0_8px_22px_rgba(15,23,42,.05)]">
                <Quote size={22} className="text-[#0d6db7]" aria-hidden />
                <p className="mt-3 text-base leading-7 text-[#475569]">{content["site.principal_message"]}</p>
                <footer className="mt-4 text-xs font-bold uppercase tracking-[.1em] text-[#0b4f8a]">
                  — {principalName}, {principalTitle}
                </footer>
              </blockquote>
              <div className="rounded-[1.4rem] border border-dashed border-[#d9cfc7] bg-[#f8fafc] p-6">
                <h3 className="display text-lg text-[#0f172a]">School governance</h3>
                <p className="mt-2 text-sm leading-6 text-[#6a625b]">
                  The school board, management team and heads of department support the Principal. Official staff names,
                  roles and photographs are not published until they are confirmed by the school administration and added
                  in the admin dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto flex max-w-[1160px] flex-col items-center justify-between gap-5 rounded-[2rem] bg-[#0f172a] px-8 py-10 text-white sm:flex-row sm:px-12">
          <div>
            <h2 className="display text-3xl">Come and see Nuuyoma for yourself.</h2>
            <p className="mt-2 text-sm text-white/70">Book a visit through the school office or start an application online.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admissions#application" className="pill bg-[#0d6db7] px-6 py-3 text-sm font-bold text-white hover:bg-[#ff9b79]">
              Apply online
            </Link>
            <Link href="/contact" className="pill border border-white/25 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
