import Link from "next/link";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
  children?: React.ReactNode;
  tone?: "cream" | "teal" | "orange" | "navy";
  breadcrumb?: string;
};

const tones = {
  cream: "bg-[radial-gradient(ellipse_at_top_left,#fff1e8_0%,#f8fafc_45%,#f4efff_100%)] text-[#0f172a]",
  teal: "bg-gradient-to-br from-[#0d6db7] via-[#04736e] to-[#00635d] text-white",
  orange: "bg-gradient-to-br from-[#60a5fa] via-[#ff7411] to-[#ff8700] text-white",
  navy: "bg-[#111c2d] text-white",
};

export default function PageHero({ eyebrow, title, body, children, tone = "cream", breadcrumb }: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden px-5 py-16 sm:py-24 ${tones[tone]}`}>
      <div
        aria-hidden
        className={`absolute -right-20 -top-24 h-72 w-72 rounded-full ${tone === "cream" ? "bg-[#f7dfd2]/60" : "bg-white/10"}`}
      />
      <div
        aria-hidden
        className={`absolute -bottom-24 left-[8%] h-56 w-56 rounded-full ${tone === "cream" ? "bg-[#e3d7fb]/60" : "bg-[#0d6db7]/20"}`}
      />
      <div className="relative mx-auto max-w-[900px] text-center">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className={`mb-5 text-xs font-semibold ${tone === "cream" ? "text-[#7c7168]" : "text-white/60"}`}>
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2" aria-hidden>/</span>
            <span>{breadcrumb}</span>
          </nav>
        )}
        <div
          className={`pill inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[.14em] ${
            tone === "cream" ? "bg-[#0f172a] text-white" : "bg-white/15 text-white"
          }`}
        >
          {eyebrow}
        </div>
        <h1 className="display mt-6 text-4xl leading-[1.02] sm:text-6xl">{title}</h1>
        {body && (
          <p className={`mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg ${tone === "cream" ? "text-[#475569]" : "text-white/85"}`}>
            {body}
          </p>
        )}
        {children && <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">{children}</div>}
      </div>
    </section>
  );
}
