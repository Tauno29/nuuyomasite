import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CalendarDays, Megaphone, Pin } from "lucide-react";
import RichText from "@/components/site/RichText";
import { formatDate, getAnnouncements, getNews, getNewsBySlug } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return { title: "Story not found" };
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: item.image_url ? { images: [{ url: item.image_url }] } : undefined,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const others = getNews(4).filter((entry) => entry.id !== item.id).slice(0, 3);
  const announcements = getAnnouncements(3);

  return (
    <div className="bg-[#f8fafc]">
      <article>
        <header className="relative bg-[#0f172a] px-5 pb-16 pt-14 text-white">
          {item.image_url && (
            <div aria-hidden className="absolute inset-0 opacity-25">
              <img src={item.image_url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]/50" />
            </div>
          )}
          <div className="relative mx-auto max-w-[860px]">
            <Link href="/news" className="inline-flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white">
              <ArrowLeft size={14} /> Back to News & Announcements
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[.16em]">
              <span className="rounded-full bg-[#0d6db7] px-3 py-1 text-white">{item.category}</span>
              <span className="flex items-center gap-1 text-white/60">
                <CalendarDays size={12} /> {formatDate(item.event_date || item.created_at)}
              </span>
              {item.featured ? <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">Featured</span> : null}
            </div>
            <h1 className="display mt-4 text-4xl leading-[1.02] sm:text-5xl">{item.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">{item.excerpt}</p>
          </div>
        </header>

        <div className="mx-auto max-w-[860px] px-5 py-12">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="-mt-24 mb-10 w-full rounded-[1.5rem] border-4 border-white object-cover shadow-xl"
            />
          )}
          <div className="rounded-[1.5rem] border border-[#e2e8f0] bg-white p-7 shadow-[0_10px_26px_rgba(15,23,42,.05)] sm:p-10">
            <RichText text={item.body || item.excerpt} className="text-[15px] text-[#4f4a45]" />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e8f0] pt-6">
              <p className="text-xs text-[#94a3b8]">
                Published by Nuuyoma Senior Secondary School · {formatDate(item.created_at)}
              </p>
              <Link href="/news" className="pill inline-flex items-center gap-2 border border-[#e5dbd3] px-5 py-2.5 text-xs font-bold text-[#475569] hover:border-[#0b4f8a]">
                All news <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-[#fff4ec] px-5 py-4 text-xs leading-6 text-[#8a5b3a]">
            <strong>Note:</strong> Stories and notices are published by the school administration. Please contact the school
            office to confirm any dates or details mentioned in a story.
          </div>
        </div>
      </article>

      <section className="border-t border-[#e2e8f0] bg-white px-5 py-16">
        <div className="mx-auto grid max-w-[1160px] gap-10 lg:grid-cols-[1fr_.55fr]">
          <div>
            <div className="flex items-end justify-between">
              <h2 className="display text-3xl text-[#0f172a]">More from the school</h2>
              <Link href="/news" className="text-xs font-bold text-[#0b4f8a] hover:underline">View all</Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {others.map((other) => (
                <Link key={other.id} href={`/news/${other.slug}`} className="group overflow-hidden rounded-[1.2rem] border border-[#e2e8f0] bg-[#f8fafc]">
                  {other.image_url && (
                    <img src={other.image_url} alt={other.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                  )}
                  <div className="p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[.12em] text-[#0b4f8a]">{other.category}</div>
                    <h3 className="display mt-2 text-lg leading-snug text-[#171411] group-hover:text-[#0b4f8a]">{other.title}</h3>
                  </div>
                </Link>
              ))}
              {others.length === 0 && <p className="text-sm text-[#7c7168]">More stories will appear here soon.</p>}
            </div>
          </div>
          <aside>
            <h2 className="display flex items-center gap-2 text-2xl text-[#0f172a]">
              <Megaphone size={19} className="text-[#0d6db7]" /> Announcements
            </h2>
            <div className="mt-4 grid gap-3">
              {announcements.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#0b4f8a]">
                    {entry.pinned ? <Pin size={11} /> : null}
                    {entry.category}
                  </div>
                  <h3 className="mt-1.5 text-sm font-bold leading-5 text-[#1e293b]">{entry.title}</h3>
                  <p className="mt-1 line-clamp-3 text-xs leading-5 text-[#64748b]">{entry.body}</p>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-sm text-[#7c7168]">No announcements yet.</p>}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
