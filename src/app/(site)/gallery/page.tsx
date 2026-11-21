import Link from "next/link";
import { ArrowRight, Camera, Images } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import GalleryGrid from "@/components/site/GalleryGrid";
import { getContent, getGallery, getGalleryCategories } from "@/lib/site";

export const metadata = {
  title: "Gallery",
  description:
    "Explore school life at Nuuyoma Senior Secondary School — buildings, classrooms, learners, teachers, sport, culture, academics and celebrations.",
};

export default function GalleryPage() {
  const content = getContent();
  const items = getGallery();
  const categories = getGalleryCategories();

  return (
    <div className="bg-[#f8fafc]">
      <PageHero
        eyebrow="Gallery"
        title={content["gallery.intro_title"]}
        body={content["gallery.intro_body"]}
        breadcrumb="Gallery"
      >
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#6a5c52]">
          <span className="pill inline-flex items-center gap-2 bg-white px-4 py-2 shadow-sm">
            <Camera size={14} className="text-[#0b4f8a]" /> {items.length} photographs published
          </span>
          <span className="pill inline-flex items-center gap-2 bg-white px-4 py-2 shadow-sm">
            <Images size={14} className="text-[#0d6db7]" /> {categories.length} categories
          </span>
        </div>
      </PageHero>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-[1160px]">
          <GalleryGrid items={items} categories={categories} />
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[2.2rem] bg-[#0d6db7] px-8 py-12 text-white sm:px-16">
          <div aria-hidden className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-16 right-[40%] h-40 w-40 rounded-full bg-[#0d6db7]/30" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="display text-4xl leading-tight sm:text-5xl">See It All For Yourself</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/85">
                Photographs only tell part of the story. Visit the school, meet our community and experience a school day
                first-hand. Contact the office to arrange a visit.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/contact" className="pill inline-flex items-center gap-2 bg-white px-7 py-3.5 text-sm font-bold text-[#0d6db7] hover:-translate-y-0.5">
                Arrange a visit <ArrowRight size={16} />
              </Link>
              <Link href="/admissions" className="pill border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/15">
                Admissions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="px-5 pb-16">
        <p className="mx-auto max-w-[1160px] rounded-xl border border-[#e2e8f0] bg-white px-5 py-4 text-[11px] leading-5 text-[#64748b]">
          The photographs currently shown are illustrative placeholders. Official school photographs can be uploaded and
          managed by the administration in Admin → Gallery, and will replace these images automatically.
        </p>
      </div>
    </div>
  );
}
