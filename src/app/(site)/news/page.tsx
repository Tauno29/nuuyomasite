import Link from "next/link";
import { ArrowRight, CalendarDays, Megaphone, Pin } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { formatDate, getAnnouncements, getNews } from "@/lib/site";

export const metadata = {
  title: "News & Announcements",
  description:
    "School news, announcements, events, examination notices and updates from Nuuyoma Senior Secondary School.",
};

export default function NewsPage() {
  const news = getNews();
  const announcements = getAnnouncements();
  const [featured, ...rest] = news;

  return (
    <div className="bg-[#f8fafc]">
      <PageHero
        eyebrow="News & Announcements"
        title="News from Nuuyoma"
        body="School announcements, events, examination notices and stories from our classrooms, fields and community."
        breadcrumb="News"
      />

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-[1160px] items-start gap-10 lg:grid-cols-[1fr_.72fr]">
          <div>
            <div className="flex items-end justify-between">
              <h2 className="display text-3xl text-[#0f172a]">Latest stories</h2>
              <span className="text-xs font-semibold text-[#94a3b8]">{news.length} published</span>
            </div>

            {featured ? (
              <article className="mt-6 overflow-hidden rounded-[1.6rem] border border-[#e2e8f0] bg-white shadow-[0_10px_26px_rgba(15,23,42,.06)]">
                {featured.image_url && (
                  <Link href={`/news/${featured.slug}`} className="block overflow-hidden">
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="aspect-[16/8] w-full object-cover transition duration-500 hover:scale-[1.03]"
                    />
                  </Link>
                )}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.14em]">
                    <span className="rounded-full bg-[#e9f4ff] px-3 py-1 text-[#0b4f8a]">{featured.category}</span>
                    <span className="flex items-center gap-1 text-[#9a9089]">
                      <CalendarDays size={12} /> {formatDate(featured.event_date || featured.created_at)}
                    </span>
                  </div>
                  <Link href={`/news/${featured.slug}`}>
                    <h3 className="display mt-4 text-3xl leading-tight text-[#171411] hover:text-[#0b4f8a] sm:text-4xl">
                      {featured.title}
                    </h3>
                  </Link>
                  <p className="mt-3 text-sm leading-7 text-[#6a615a]">{featured.excerpt}</p>
                  <Link href={`/news/${featured.slug}`} className="pill mt-5 inline-flex items-center gap-2 bg-[#0f172a] px-6 py-3 text-sm font-bold text-white hover:bg-[#24384f]">
                    Read the full story <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-[#d9cfc7] bg-white p-10 text-center text-sm text-[#7c7168]">
                No news stories have been published yet. Check back soon.
              </p>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {rest.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-[1.4rem] border border-[#e2e8f0] bg-white shadow-[0_5px_15px_rgba(15,23,42,.05)]">
                  {item.image_url && (
                    <Link href={`/news/${item.slug}`} className="block overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover transition duration-500 hover:scale-[1.04]"
                      />
                    </Link>
                  )}
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em]">
                      <span className="rounded-full bg-[#e9f4ff] px-2.5 py-1 text-[#0b4f8a]">{item.category}</span>
                      <span className="text-[#9a9089]">{formatDate(item.event_date || item.created_at, { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <Link href={`/news/${item.slug}`}>
                      <h3 className="display mt-3 text-xl leading-snug text-[#171411] hover:text-[#0b4f8a]">{item.title}</h3>
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6a615a]">{item.excerpt}</p>
                    <Link href={`/news/${item.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0b4f8a]">
                      Read more <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[1.6rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_10px_26px_rgba(15,23,42,.06)]">
              <h2 className="display flex items-center gap-2 text-2xl text-[#0f172a]">
                <Megaphone size={20} className="text-[#0d6db7]" /> Announcements
              </h2>
              <div className="mt-5 grid gap-3">
                {announcements.length === 0 ? (
                  <p className="rounded-xl bg-[#f8fafc] p-4 text-sm text-[#7c7168]">No announcements yet.</p>
                ) : (
                  announcements.map((item) => (
                    <div key={item.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#0b4f8a]">
                        {item.pinned ? <Pin size={11} /> : null}
                        {item.category}
                        <span className="ml-auto font-semibold text-[#94a3b8]">{formatDate(item.published_at, { day: "numeric", month: "short" })}</span>
                      </div>
                      <h3 className="mt-2 text-sm font-bold leading-5 text-[#1e293b]">{item.title}</h3>
                      <p className="mt-1 whitespace-pre-line text-xs leading-5 text-[#64748b]">{item.body}</p>
                      {item.link_url && item.link_label && (
                        <Link href={item.link_url} className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b4f8a]">
                          {item.link_label} <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5 rounded-[1.6rem] bg-[#0d6db7] p-6 text-white">
              <h3 className="display text-xl">Never miss a notice</h3>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Subscribe to the school newsletter from the footer, or check the Learner Portal for your notices.
              </p>
              <Link href="/learner-portal" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#a7f0df]">
                Open Learner Portal <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mt-5 rounded-[1.6rem] border border-dashed border-[#d9cfc7] bg-white/60 p-5 text-[11px] leading-5 text-[#64748b]">
              News, announcements and event notices on this page are published by the school administration and stored in the
              school database. Draft items are never shown publicly.
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
