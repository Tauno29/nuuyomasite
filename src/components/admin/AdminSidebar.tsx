"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  FolderOpen,
  GraduationCap,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { adminLogout } from "@/app/admin/actions";

const groups: { label: string; items: { href: string; label: string; icon: typeof LayoutDashboard }[] }[] = [
  {
    label: "Console",
    items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/content", label: "Website Content", icon: FolderOpen },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/admin/news", label: "News & Events", icon: Newspaper },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
    ],
  },
  {
    label: "School",
    items: [
      { href: "/admin/academics", label: "Academics", icon: GraduationCap },
      { href: "/admin/admissions", label: "Admissions Info", icon: Inbox },
      { href: "/admin/applications", label: "Applications", icon: Users },
      { href: "/admin/learners", label: "Learner Registry", icon: Users },
      { href: "/admin/documents", label: "Documents", icon: FolderOpen },
      { href: "/admin/fees", label: "Fee Structures", icon: Wallet },
    ],
  },
  {
    label: "Office",
    items: [
      { href: "/admin/messages", label: "Messages", icon: Mail },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({ name, unread }: { name: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-3 border-b border-[#e3d9d0] bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e3d9d0] text-[#0f172a]"
          aria-label="Open admin menu"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/assets/school-crest.webp" alt="" className="h-8 w-8 rounded-full" />
          <div>
            <div className="display text-sm leading-tight text-[#0f172a]">Nuuyoma SSS</div>
            <div className="text-[8px] font-extrabold uppercase tracking-[.16em] text-[#0b4f8a]">Admin Console</div>
          </div>
        </div>
        <Link href="/" className="ml-auto flex items-center gap-1 text-[11px] font-bold text-[#0b4f8a]">
          Website <ExternalLink size={12} />
        </Link>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-[#08111d]/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-[#081a31] text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <img src="/assets/school-crest.webp" alt="NSSS crest" className="h-11 w-11 rounded-full border-2 border-white/15" />
          <div className="min-w-0">
            <div className="display truncate text-lg leading-tight">Nuuyoma SSS</div>
            <div className="text-[9px] font-extrabold uppercase tracking-[.18em] text-[#0d6db7]">Admin Console</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="thin-scroll flex-1 overflow-y-auto px-3 py-5">
          {groups.map((group) => (
            <div key={group.label} className="mb-5">
              <div className="px-3 text-[9px] font-extrabold uppercase tracking-[.2em] text-white/30">{group.label}</div>
              <div className="mt-2 grid gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition ${
                        active ? "bg-[#0d6db7]/15 text-[#ffc2ae]" : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={17} className={active ? "text-[#0d6db7]" : "text-white/35"} />
                      <span className="flex-1">{item.label}</span>
                      {item.href === "/admin/messages" && unread > 0 && (
                        <span className="rounded-full bg-[#0d6db7] px-2 py-0.5 text-[10px] font-extrabold text-white">{unread}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#6fe0b4]">
              <ShieldCheck size={13} /> Secure session
            </div>
            <div className="mt-1.5 truncate text-xs font-bold text-white/80">{name}</div>
            <div className="text-[10px] text-white/35">Signed in as administrator</div>
          </div>
          <div className="mt-3 grid gap-1.5">
            <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold text-white/45 hover:bg-white/5 hover:text-white">
              <ExternalLink size={13} /> View public website
            </Link>
            <form action={adminLogout}>
              <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold text-[#ff9d8a] hover:bg-[#0d6db7]/10">
                <LogOut size={13} /> Lock exit / sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
