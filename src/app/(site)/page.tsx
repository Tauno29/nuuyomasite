import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Pin,
  Quote,
  Sparkles,
} from "lucide-react";
import { getAnnouncements, getContent, getGallery, getNews, getStats, formatDate } from "@/lib/site";
import RichText from "@/components/site/RichText";

export const metadata = {
  title: "Home",
  description:
    "Welcome to Nuuyoma Senior Secondary School — a state secondary school in Oshikuku, Omusati Region, Namibia, serving Grades 8 to 12.",
};

const streams = [
  ["🗣️", "Languages & Literacy", "GRADES 8–12", "English and Namibian languages, literature and confident communication.", "#ff4b88", "#fff1f7"],
  ["🔬", "Mathematics & Sciences", "GRADES 8–12", "Mathematics, physical science, biology and practical scientific investigation.", "#9755ec", "#faf2ff"],
  ["💼", "Commerce & Enterprise", "GRADES 10–12", "Business studies, accounting and economics for the world of work.", "#32a9dd", "#eff8ff"],
  ["🌍", "Humanities", "GRADES 8–12", "Geography, history and the social sciences that explain our world.", "#f0a400", "#fff8e8"],
  ["💻", "Technology & Vocational", "GRADES 8–12", "ICT, agriculture and practical subjects that build real-world skills.", "#08be74", "#effff6"],
];

const quickActions = [
  ["Admissions", "Requirements, dates and the online application form.", "/admissions", "bg-[#fff1f7] text-[#c81d5c]"],
  ["Academics", "Subjects, programmes and examination information.", "/academics", "bg-[#f5edff] text-[#7c3fc0]"],
  ["Boarding", "Hostel facilities, routine and boarding information.", "/boarding", "bg-[#e9faf6] text-[#00766e]"],
];

export default function HomePage() {
  const content = getContent();
  const stats = getStats();
  const announcements = getAnnouncements(3);
  const news = getNews(3);
  const gallery = getGallery().slice(0, 3);
  const principalName = content["site.principal_name"] || "School Principal";
  const principalTitle = content["site.principal_title"] || "Principal";

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc] text-[#3d3732]">
      {/* HERO */}
      <section className="mx-auto grid min-h-[680px] max-w-[1160px] items-center gap-10 px-5 py-14 lg:grid-cols-[.9fr_1.1fr] lg:py-20">
        <div className="reveal">
          <div className="eyebrow">{content["home.hero_eyebrow"]}</div>
          <h1 className="display mt-6 max-w-[520px] text-[50px] leading-[.9] text-[#0f172a] sm:text-[68px]">
            {content["home.hero_line1"]}
            <br />
            <span className="text-[#60a5fa]">{content["home.hero_highlight1"]}</span>
            <br />
            {content["home.hero_line2"]}
            <br />
            <span className="text-[#0d6db7]">{content["home.hero_highlight2"]}</span>
            <br />
            {content["home.hero_line3"]}
          </h1>
          <p className="mt-7 max-w-[430px] text-[15px] leading-7 text-[#5d6977]">{content["home.hero_body"]}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={content["home.hero_cta_url"] || "/admissions"}
              className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_20px_rgba(13,109,183,.25)] hover:-translate-y-1"
            >
              {content["home.hero_cta_label"]} <ArrowRight size={17} />
            </Link>
            <Link href="/about" className="pill inline-flex items-center gap-2 border-2 border-[#0f172a]/15 bg-white px-7 py-3.5 text-sm font-bold text-[#0f172a] hover:border-[#0f172a]/30">
              About the school <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-[#8b7d73]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#08be74]" /> State secondary school
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#9755ec]" /> Grades 8–12
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#f0a400]" /> Boarding available
            </span>
          </div>
        </div>

        <div className="relative flex min-h-[420px] items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-x-3 inset-y-10 rounded-[48%] bg-[radial-gradient(ellipse_at_center,#fff_0%,#fce7fb_35%,#dae8fa_65%,transparent_74%)]"
          />
          <div className="relative z-10 flex h-[300px] w-[300px] items-center justify-center rounded-full bg-white p-4 shadow-[0_18px_40px_rgba(44,48,86,.12)] sm:h-[410px] sm:w-[410px]">
            <img
              src="/assets/school-crest.webp"
              alt="Nuuyoma Senior Secondary School crest"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <span className="float-slow absolute left-[12%] top-[14%] z-20 rounded-2xl border border-white bg-white/90 px-4 py-2 text-xs font-bold text-[#0f172a] shadow-lg sm:left-[16%]">
            <Sparkles size={13} className="mr-1 inline text-[#60a5fa]" /> Est. {content["site.founded"]}
          </span>
          <span className="float-slow absolute bottom-[16%] right-[6%] z-20 rounded-2xl border border-white bg-white/90 px-4 py-2 text-xs font-bold text-[#0f172a] shadow-lg sm:right-[10%]">
            <MapPin size={13} className="mr-1 inline text-[#0d6db7]" /> Oshikuku
          </span>
          <span className="absolute left-[20%] top-[26%] z-20 text-3xl" aria-hidden>🎓</span>
          <span className="absolute bottom-[22%] right-[16%] z-20 text-3xl" aria-hidden>📚</span>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto grid max-w-[1160px] gap-5 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="rounded-[1.25rem] bg-white px-6 py-7 text-center shadow-[0_10px_20px_rgba(43,39,33,.08)]">
            <div className="display text-3xl text-[#0f172a]">{stat.value}</div>
            <div className="mt-1 text-sm text-[#79818a]">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* STREAMS */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-[1160px] text-center">
          <div className="eyebrow">{content["home.offer_eyebrow"]}</div>
          <h2 className="display mt-4 text-4xl leading-[1.05] text-[#0f172a] sm:text-5xl">
            {content["home.offer_title"]}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#697584]">{content["home.offer_body"]}</p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {streams.map(([icon, name, level, description, color, bg]) => (
              <div
                key={name}
                className="flex min-h-[380px] flex-col rounded-[1.45rem] border-2 px-5 py-6 text-center shadow-[0_8px_16px_rgba(48,44,39,.04)]"
                style={{ borderColor: color, backgroundColor: bg }}
              >
                <div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-md"
                  style={{ backgroundColor: color }}
                  aria-hidden
                >
                  {icon}
                </div>
                <h3 className="display mt-5 text-[23px] leading-[.98]" style={{ color }}>
                  {name}
                </h3>
                <div className="mt-2 text-[11px] font-bold tracking-wide text-[#9ba0a5]">{level}</div>
                <p className="mt-5 flex-1 text-sm leading-6 text-[#626d77]">{description}</p>
                <Link
                  href="/academics#streams"
                  className="pill mx-auto mt-4 inline-flex items-center gap-1 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:-translate-y-0.5"
                  style={{ backgroundColor: color }}
                >
                  View programme <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
          <Link
            href="/academics"
            className="pill mt-12 inline-flex items-center gap-2 bg-[#0d6db7] px-8 py-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,109,183,.2)] hover:-translate-y-1"
          >
            Explore all academics <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* IDENTITY */}
      <section className="bg-white px-5 pb-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <div className="eyebrow">{content["home.identity_eyebrow"]}</div>
            <h2 className="display mt-4 text-4xl text-[#0f172a] sm:text-5xl">{content["home.identity_title"]}</h2>
          </div>
          <div className="mt-14 grid items-start gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div className="relative mx-auto w-full max-w-[330px]">
              <div aria-hidden className="absolute -inset-2 rotate-2 rounded-[1.4rem] bg-[#f4d9ef]" />
              <div className="relative overflow-hidden rounded-[1.3rem] border-4 border-white bg-white shadow-xl">
                <img
                  src={content["site.principal_photo"] || "/assets/principal-placeholder.jpg"}
                  alt={`${principalName} — placeholder portrait`}
                  className="h-[430px] w-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent px-6 pb-5 pt-24 text-center text-white">
                  <div className="display text-2xl">{principalName}</div>
                  <div className="text-sm text-white/75">{principalTitle} · Nuuyoma SSS</div>
                </div>
              </div>
              <img
                src="/assets/school-crest.webp"
                alt="NSSS crest"
                className="absolute -right-5 -top-5 h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-lg"
              />
              <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[.12em] text-[#94a3b8]">
                Placeholder portrait — replace in Admin → Website Content
              </p>
            </div>

            <div className="grid gap-6">
              {[
                ["🔭", "OUR VISION", content["home.vision_title"], "#60a5fa"],
                ["🚀", "OUR MISSION", content["home.mission_title"], "#e5a02b"],
                ["⭐", "OUR MOTTO", content["home.motto_title"], "#20b9c3"],
              ].map(([icon, label, text, color]) => (
                <div
                  key={label}
                  className="relative rounded-[1.25rem] border-2 border-white bg-white px-7 py-7"
                  style={{ boxShadow: `0 8px 22px ${color}35` }}
                >
                  <div className="flex items-center gap-3 text-sm font-extrabold tracking-[.12em]" style={{ color }}>
                    <span className="text-2xl" aria-hidden>{icon}</span>
                    {label}
                  </div>
                  <div className="mt-5 text-xl font-extrabold leading-snug" style={{ color }}>
                    {text}
                  </div>
                  <div className="absolute right-5 top-4 flex gap-1" aria-hidden>
                    <span className="h-3 w-3 rounded-full bg-[#ddb1f3]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffb264]" />
                    <span className="h-3 w-3 rounded-full bg-[#7eddf0]" />
                  </div>
                </div>
              ))}
              <blockquote className="rounded-[1.25rem] bg-[#f8fafc] px-7 py-6 text-sm leading-7 text-[#475569]">
                <Quote size={18} className="mb-2 text-[#0d6db7]" aria-hidden />
                {content["site.principal_message"]}
                <footer className="mt-3 text-xs font-bold uppercase tracking-[.1em] text-[#0b4f8a]">
                  — {principalName}, {principalTitle}
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-[1160px] gap-5 md:grid-cols-3">
          {quickActions.map(([title, body, href, tone]) => (
            <Link key={href} href={href} className="group rounded-[1.4rem] border border-[#e2e8f0] bg-white p-7 shadow-[0_6px_18px_rgba(15,23,42,.04)] transition hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,.09)]">
              <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.14em] ${tone}`}>
                Explore
              </span>
              <h3 className="display mt-4 text-2xl text-[#171411]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6a615a]">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0b4f8a]">
                Learn more <ArrowRight size={13} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow">{content["home.gallery_eyebrow"]}</div>
              <h2 className="display mt-3 text-4xl text-[#0f172a] sm:text-5xl">{content["home.gallery_title"]}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#697584]">{content["home.gallery_body"]}</p>
            </div>
            <Link href="/gallery" className="pill inline-flex shrink-0 items-center gap-2 border border-[#e9dcd2] bg-[#f8fafc] px-5 py-3 text-xs font-bold text-[#6a5c52] hover:border-[#0b4f8a] hover:text-[#0b4f8a]">
              View full gallery <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {gallery.length === 0 ? (
              <p className="col-span-3 rounded-2xl bg-[#f8fafc] p-8 text-center text-sm text-[#7c7168]">
                Gallery photographs will appear here once uploaded by the school.
              </p>
            ) : (
              gallery.map((image, i) => (
                <Link key={image.id} href="/gallery" className={`group relative overflow-hidden rounded-[1.5rem] bg-[#f4eee9] ${i === 0 ? "sm:row-span-1" : ""}`}>
                  <img
                    src={image.image_url}
                    alt={image.title}
                    loading="lazy"
                    className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f172a]/85 to-transparent px-5 pb-4 pt-16">
                    <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#ffd7c5]">{image.category}</span>
                    <span className="display block text-xl text-white">{image.title}</span>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* NEWS & ANNOUNCEMENTS */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="text-center">
            <div className="eyebrow">{content["home.news_eyebrow"]}</div>
            <h2 className="display mt-4 text-4xl text-[#0f172a] sm:text-5xl">{content["home.news_title"]}</h2>
          </div>

          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.55fr_.85fr]">
            <div className="grid gap-5 sm:grid-cols-2">
              {news.length === 0 ? (
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 text-sm text-[#7c7168] sm:col-span-2">
                  News stories will appear here once published.
                </div>
              ) : (
                news.map((item, index) => (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-[1.5rem] border border-[#e2e8f0] bg-white shadow-[0_5px_15px_rgba(15,23,42,.05)] ${
                      index === 0 ? "sm:col-span-2" : ""
                    }`}
                  >
                    {item.image_url && (
                      <Link href={`/news/${item.slug}`} className="block overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          className={`w-full object-cover transition duration-500 hover:scale-[1.03] ${index === 0 ? "aspect-[2/1]" : "aspect-[16/10]"}`}
                        />
                      </Link>
                    )}
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.14em]">
                        <span className="rounded-full bg-[#e9f4ff] px-3 py-1 text-[#0b4f8a]">{item.category}</span>
                        <span className="flex items-center gap-1 text-[#9a9089]">
                          <CalendarDays size={12} /> {formatDate(item.event_date || item.created_at)}
                        </span>
                      </div>
                      <Link href={`/news/${item.slug}`}>
                        <h3 className={`display mt-3 text-2xl leading-tight text-[#171411] hover:text-[#0b4f8a] ${index === 0 ? "sm:text-3xl" : ""}`}>
                          {item.title}
                        </h3>
                      </Link>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6a615a]">{item.excerpt}</p>
                      <Link href={`/news/${item.slug}`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0b4f8a]">
                        Read more <ArrowRight size={13} />
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>

            <aside className="rounded-[1.6rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,.06)]">
              <div className="flex items-center justify-between">
                <h3 className="display flex items-center gap-2 text-2xl text-[#0f172a]">
                  <Megaphone size={20} className="text-[#0d6db7]" /> Announcements
                </h3>
                <Link href="/news" className="text-[11px] font-bold text-[#0b4f8a] hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-5 grid gap-3">
                {announcements.length === 0 ? (
                  <p className="rounded-xl bg-[#f8fafc] p-4 text-sm text-[#7c7168]">No announcements have been published yet.</p>
                ) : (
                  announcements.map((item) => (
                    <div key={item.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#0b4f8a]">
                        {item.pinned ? <Pin size={11} /> : null}
                        {item.category}
                        <span className="ml-auto font-semibold text-[#94a3b8]">{formatDate(item.published_at, { day: "numeric", month: "short" })}</span>
                      </div>
                      <h4 className="mt-2 text-sm font-bold leading-5 text-[#1e293b]">{item.title}</h4>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#64748b]">{item.body}</p>
                      {item.link_url && item.link_label && (
                        <Link href={item.link_url} className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b4f8a]">
                          {item.link_label} <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-5 rounded-xl bg-[#0f172a] p-4 text-white">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#0d6db7]">Learner Portal</p>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Sign in with your Student ID to view school announcements, resources and reports.
                </p>
                <Link href="/learner-portal" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#ffd7c5]">
                  Open the portal <ArrowRight size={13} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ADMISSIONS CTA */}
      <section className="px-5 pb-20">
        <div className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[3rem] bg-[#0d6db7] px-8 py-14 text-white sm:px-20 sm:py-16">
          <div aria-hidden className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div aria-hidden className="absolute bottom-0 right-[32%] h-28 w-28 rounded-full bg-[#0d6db7]/30" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_.6fr]">
            <div>
              <span className="pill inline-flex bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[.14em]">
                Admissions open
              </span>
              <h2 className="display mt-5 text-4xl leading-tight sm:text-5xl">{content["home.cta_title"]}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/85">{content["home.cta_body"]}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/admissions#application" className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#ff9b79]">
                  Apply online <ArrowRight size={16} />
                </Link>
                <Link href="/admissions" className="pill border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/15">
                  Admission information
                </Link>
              </div>
            </div>
            <div className="rounded-[1.6rem] bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a7f0df]">Visit us</p>
              <ul className="mt-4 grid gap-3 text-sm text-white/85">
                <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-[#0d6db7]" /> {content["site.location"]}, {content["site.region"]} Region</li>
                <li className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-[#0d6db7]" /> <a href={`tel:${content["site.phone"].replace(/\s+/g, "")}`}>{content["site.phone"]}</a></li>
                <li className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-[#0d6db7]" /> <a href={`mailto:${content["site.email"]}`} className="break-all">{content["site.email"]}</a></li>
              </ul>
              <p className="mt-4 border-t border-white/15 pt-3 text-[11px] leading-5 text-white/55">
                Contact details are placeholders until confirmed by the school office.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
