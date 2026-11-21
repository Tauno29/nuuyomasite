import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

type FooterContent = {
  name: string;
  about: string;
  location: string;
  email: string;
  phone: string;
  founded: string;
  region: string;
  newsletterText: string;
};

const quickLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Academics", "/academics"],
  ["Admissions", "/admissions"],
  ["Boarding", "/boarding"],
  ["Gallery", "/gallery"],
  ["News & Notices", "/news"],
  ["Fees & Payments", "/fees"],
  ["Contact Us", "/contact"],
  ["Learner Portal", "/learner-portal"],
];

export default function SiteFooter({ content }: { content: FooterContent }) {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="mx-auto grid max-w-[1160px] gap-12 px-5 py-16 md:grid-cols-[1.35fr_1fr_1.1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/school-crest.webp" alt={`${content.name} crest`} className="h-14 w-14 rounded-full object-cover" />
            <div>
              <div className="display text-2xl leading-tight">{content.name}</div>
              <div className="text-xs font-bold uppercase tracking-[.16em] text-[#0d6db7]">Public Secondary School</div>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">{content.about}</p>
          <div className="mt-5 grid gap-2 text-sm text-white/65">
            <span className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#0d6db7]" aria-hidden /> {content.location}, {content.region} Region
            </span>
            <a href={`mailto:${content.email}`} className="flex items-center gap-2 hover:text-white">
              <Mail size={15} className="shrink-0 text-[#0d6db7]" aria-hidden /> {content.email}
            </a>
            <a href={`tel:${content.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-white">
              <Phone size={15} className="shrink-0 text-[#0d6db7]" aria-hidden /> {content.phone}
            </a>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-white/50">
            <span className="rounded-full border border-white/15 px-3 py-1.5">Est. {content.founded}</span>
            <span className="rounded-full border border-white/15 px-3 py-1.5">Grades 8–12</span>
            <span className="rounded-full border border-white/15 px-3 py-1.5">Boarding available</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[.12em] text-white/80">Quick Links</h3>
          <div className="mt-6 grid gap-3 text-sm text-white/65">
            {quickLinks.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-[#0d6db7]">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[.12em] text-white/80">Stay Updated</h3>
          <p className="mt-6 text-sm text-white/65">{content.newsletterText}</p>
          <NewsletterForm />
          <div className="mt-5 flex items-center gap-2 text-xs text-[#77e4b6]">
            <span aria-hidden>🔒</span> We only use your email for school updates.
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <Link
              href="/admin"
              className="text-xs font-semibold uppercase tracking-[.12em] text-white/40 transition hover:text-white/75"
            >
              Staff / Admin login →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        <div className="mx-auto flex max-w-[1160px] flex-col items-center justify-between gap-2 px-5 sm:flex-row">
          <p>© {new Date().getFullYear()} {content.name}. All rights reserved.</p>
          <p>
            Founded {content.founded} · {content.location} · Namibia
          </p>
        </div>
      </div>
    </footer>
  );
}
