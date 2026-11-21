import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import Logo from "@/components/site/Logo";
import { getSessionUser } from "@/lib/auth";
import { getContent } from "@/lib/site";
import { learnerLogout } from "./actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "Learner Portal", template: "%s | Learner Portal" },
  robots: { index: false, follow: false },
};

export default async function LearnerPortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const content = getContent();
  const learnerSignedIn = user?.role === "learner";

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1160px] items-center gap-4 px-5">
          <Logo name={content["site.name"]} shortName={content["site.short_name"]} href="/learner-portal" />
          <span className="hidden rounded-full bg-[#f5edff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#7c3fc0] sm:inline-block">
            Learner Portal
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-[#e9dcd2] px-4 py-2 text-xs font-bold text-[#6a5c52] transition hover:border-[#0b4f8a] hover:text-[#0b4f8a] sm:inline-flex"
            >
              <ArrowLeft size={13} /> School website
            </Link>
            {learnerSignedIn && (
              <form action={learnerLogout}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0f172a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#24384f]"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[#e2e8f0] bg-white px-5 py-6">
        <div className="mx-auto flex max-w-[1160px] flex-col items-center justify-between gap-3 text-center text-[11px] text-[#64748b] sm:flex-row sm:text-left">
          <p>
            {content["site.name"]} · {content["site.tagline"]}
          </p>
          <p>
            Need help? Contact the school office: <span className="font-bold text-[#475569]">{content["site.phone"]}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
