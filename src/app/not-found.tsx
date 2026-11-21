import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-5 py-16 text-center">
      <img src="/assets/school-crest.webp" alt="Nuuyoma Senior Secondary School crest" className="h-24 w-24 rounded-full shadow-lg" />
      <div className="eyebrow mt-6">Page not found</div>
      <h1 className="display mt-3 text-5xl text-[#0f172a]">404</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#5d6977]">
        We couldn&apos;t find that page. It may have moved, or the address may be incorrect.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-6 py-3 text-sm font-bold text-white hover:bg-[#ff9b79]">
          Back to homepage <ArrowRight size={15} />
        </Link>
        <Link href="/contact" className="pill inline-flex items-center gap-2 border border-[#e5dbd3] bg-white px-6 py-3 text-sm font-bold text-[#475569] hover:border-[#0b4f8a]">
          <Compass size={15} /> Contact the school
        </Link>
      </div>
      <nav className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-bold text-[#0b4f8a]">
        {[
          ["About", "/about"],
          ["Academics", "/academics"],
          ["Admissions", "/admissions"],
          ["Gallery", "/gallery"],
          ["News", "/news"],
          ["Learner Portal", "/learner-portal"],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="hover:underline">{label}</Link>
        ))}
      </nav>
    </div>
  );
}
