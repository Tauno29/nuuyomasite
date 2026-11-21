import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "Admin", template: "%s | NSSS Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const unread = (db.prepare("SELECT COUNT(*) AS n FROM messages WHERE is_read = 0").get() as { n: number }).n;

  return (
    <div className="min-h-screen bg-[#f7f3ee]">
      <AdminSidebar name={user.name} unread={unread} />
      <div className="pt-16 lg:pl-[270px] lg:pt-0">
        <header className="sticky top-0 z-30 hidden h-14 items-center gap-3 border-b border-[#e9e0d8] bg-white/90 px-8 backdrop-blur lg:flex">
          <div className="text-xs font-bold text-[#0f172a]">School Administration</div>
          <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#94a3b8]">/ Nuuyoma Senior Secondary School</span>
          <div className="ml-auto flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9faf1] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#0f8a55]">
              <ShieldCheck size={12} /> Secure session
            </span>
            <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0b4f8a] hover:underline">
              View website <ExternalLink size={12} />
            </Link>
          </div>
        </header>
        <main className="p-5 sm:p-7 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
