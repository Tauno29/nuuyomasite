"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryItem } from "@/lib/site";

export default function GalleryGrid({ items, categories }: { items: GalleryItem[]; categories: string[] }) {
  const [active, setActive] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((item) => item.category === active)),
    [active, items],
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback(
    (direction: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const next = (current + direction + filtered.length) % filtered.length;
        return next;
      });
    },
    [filtered.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, move]);

  const current = openIndex !== null ? filtered[openIndex] : null;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery categories">
        {["All", ...categories].map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={active === category}
            onClick={() => {
              setActive(category);
              setOpenIndex(null);
            }}
            className={`pill px-5 py-2.5 text-xs font-bold transition ${
              active === category
                ? "bg-[#0f172a] text-white shadow-md"
                : "border border-[#e9dcd2] bg-white text-[#6a5c52] hover:border-[#0b4f8a] hover:text-[#0b4f8a]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-[#d9cfc7] bg-white p-10 text-center text-sm text-[#7c7168]">
          No photographs have been published in this category yet.
        </p>
      ) : (
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative overflow-hidden rounded-[1.5rem] bg-[#f4eee9] text-left shadow-[0_8px_20px_rgba(15,23,42,.06)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0d6db7]/30"
              aria-label={`View ${item.title}`}
            >
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.05]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/35 to-transparent px-5 pb-4 pt-16">
                <span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#ffd7c5]">{item.category}</span>
                <span className="display block text-xl text-white">{item.title}</span>
              </span>
              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#0f172a] opacity-0 shadow transition group-hover:opacity-100">
                <Expand size={16} />
              </span>
            </button>
          ))}
        </div>
      )}
      <p className="mt-6 text-center text-[11px] text-[#94a3b8]">
        {filtered.length} photograph{filtered.length === 1 ? "" : "s"} shown. Photographs are managed by the school administration.
      </p>

      {current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1522]/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close image viewer"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(-1);
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous photograph"
          >
            <ChevronLeft size={22} />
          </button>
          <figure className="max-h-[88vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={current.image_url}
              alt={current.title}
              className="mx-auto max-h-[76vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="mx-auto mt-4 max-w-2xl text-center text-white">
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#ffd7c5]">{current.category}</div>
              <div className="display mt-1 text-xl">{current.title}</div>
              {current.caption && <div className="mt-1 text-sm text-white/65">{current.caption}</div>}
              <div className="mt-1 text-[11px] text-white/40">
                {(openIndex ?? 0) + 1} / {filtered.length}
              </div>
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              move(1);
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next photograph"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
