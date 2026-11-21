"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";

export type HeaderContent = {
  name: string;
  shortName: string;
  phone: string;
  email: string;
  location: string;
  registration: string;
  alertEnabled: boolean;
  alertMessage: string;
  alertLabel: string;
  alertUrl: string;
};

const navItems = [
  ["HOME", "/"],
  ["ABOUT", "/about"],
  ["ACADEMICS", "/academics"],
  ["ADMISSIONS", "/admissions"],
  ["BOARDING", "/boarding"],
  ["GALLERY", "/gallery"],
  ["NEWS", "/news"],
  ["FEES", "/fees"],
  ["CONTACT", "/contact"],
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteHeader({ content }: { content: HeaderContent }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(content.alertEnabled);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("nsss-alert-dismissed") === "1");
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const dismissAlert = () => {
    sessionStorage.setItem("nsss-alert-dismissed", "1");
    setDismissed(true);
  };

  return (
    <>
      <div className="bg-[#0d6db7] text-[12px] text-white">
        <div className="mx-auto flex min-h-8 max-w-[1160px] flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 py-1.5">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} aria-hidden /> {content.location}
            </span>
            <span className="opacity-50" aria-hidden>|</span>
            <a href={`tel:${content.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1 hover:text-[#93c5fd]">
              <Phone size={12} aria-hidden /> {content.phone}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${content.email}`} className="hidden items-center gap-1 hover:text-[#93c5fd] sm:inline-flex">
              <Mail size={12} aria-hidden /> {content.email}
            </a>
            <Link href="/learner-portal" className="font-semibold hover:text-[#93c5fd]">
              Learner Portal
            </Link>
            <Link href="/admin" className="hidden font-semibold text-white/70 hover:text-[#93c5fd] sm:inline">
              Admin
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-[#fffdfa]/95 shadow-[0_4px_18px_rgba(15,23,42,.05)] backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1160px] items-center justify-between gap-4 px-5">
          <Logo name={content.name} shortName={content.shortName} />

          <nav className="hidden items-center gap-4 text-[12px] xl:flex" aria-label="Main navigation">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className={`font-extrabold tracking-[.1em] transition ${
                  isActive(pathname, href)
                    ? "text-[#0d6db7]"
                    : "text-[#0f172a] hover:text-[#0d6db7]"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/admissions#application"
              className="pill ml-1 bg-[#0d6db7] px-5 py-3 text-[11.5px] font-extrabold tracking-[.06em] text-white shadow-[0_7px_14px_rgba(13,109,183,.25)] hover:bg-[#0b5a9e]"
            >
              APPLY NOW
            </Link>
          </nav>

          <div className="flex items-center gap-2 xl:hidden">
            <Link
              href="/admissions#application"
              className="pill hidden bg-[#0d6db7] px-4 py-2.5 text-[11px] font-extrabold tracking-[.06em] text-white shadow-[0_5px_11px_rgba(13,109,183,.25)] sm:inline-block"
            >
              APPLY NOW
            </Link>
            <button
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="rounded-xl border border-[#e2e8f0] p-2.5 text-[#334155] transition hover:bg-[#f1f5f9]"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-[#e2e8f0] bg-[#fffdfa] px-5 py-4 xl:hidden" aria-label="Mobile navigation">
            <div className="grid gap-1 text-sm font-semibold text-[#334155]">
              {navItems.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 transition hover:bg-[#f1f5f9] ${
                    isActive(pathname, href) ? "bg-[#eef7ff] text-[#0b4f8a]" : ""
                  }`}
                >
                  {label}
                  <span aria-hidden>→</span>
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#e2e8f0] pt-3">
                <Link href="/learner-portal" className="rounded-xl bg-[#fff4ec] px-4 py-3 text-center text-xs font-bold text-[#0b4f8a]">
                  Learner Portal
                </Link>
                <Link href="/admin" className="rounded-xl bg-[#f2f8fc] px-4 py-3 text-center text-xs font-bold text-[#0b67a5]">
                  Admin Panel
                </Link>
              </div>
              <a
                href={`tel:${content.phone.replace(/\s+/g, "")}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0d6db7] px-4 py-3 text-center text-xs font-bold text-white"
              >
                <Phone size={14} /> {content.phone}
              </a>
            </div>
          </nav>
        )}
      </header>

      {content.alertEnabled && showAlert && !dismissed && (
        <div className="relative bg-gradient-to-r from-[#0d6db7] via-[#93c5fd] to-[#60a5fa] px-10 py-3 text-center text-[12px] font-bold text-white sm:px-12 sm:text-sm">
          <span aria-hidden>📢</span> {content.alertMessage}{" "}
          <Link href={content.alertUrl} className="ml-1 underline underline-offset-4 hover:text-[#fff4d6]">
            {content.alertLabel} →
          </Link>
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={dismissAlert}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-lg leading-none hover:opacity-75"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
}
