import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getSessionUser } from "@/lib/auth";

export const metadata = {
  title: "Administrator Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user?.role === "admin") redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1b2e] px-5 py-12">
      <div aria-hidden className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-[#60a5fa]/15 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -left-24 h-[460px] w-[460px] rounded-full bg-[#0d6db7]/15 blur-3xl" />

      <div className="relative grid w-full max-w-[980px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#101f33]/80 shadow-[0_30px_80px_rgba(0,0,0,.45)] backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-white/10 p-10 lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <img src="/assets/school-crest.webp" alt="NSSS crest" className="h-14 w-14 rounded-full border-2 border-white/20" />
              <div>
                <div className="display text-xl text-white">Nuuyoma SSS</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#0d6db7]">Administration</div>
              </div>
            </div>
            <h1 className="display mt-12 text-5xl leading-[.98] text-white">
              Administrator
              <br />
              <span className="text-[#0d6db7]">login.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
              Manage the public website, learner records, applications and portal resources from one secure console.
            </p>
            <ul className="mt-8 grid gap-3 text-sm text-white/65">
              {[
                "Publish announcements and news instantly",
                "Upload gallery photographs and documents",
                "Review applications and learner accounts",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#6fe0b4]" /> {line}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] leading-5 text-white/30">
            Access is restricted to authorised school staff. All administrative actions are stored in the school database.
          </p>
        </div>

        <div className="p-7 sm:p-10">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <img src="/assets/school-crest.webp" alt="NSSS crest" className="h-11 w-11 rounded-full" />
              <div>
                <div className="display text-lg text-white">Nuuyoma SSS</div>
                <div className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#0d6db7]">Administration</div>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#0d6db7]">Secure console</div>
          <h2 className="display mt-2 text-3xl text-white">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-white/45">Sign in with your administrator account.</p>
          <div className="mt-7">
            <AdminLoginForm />
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[11px]">
            <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-white/50 hover:text-white">
              <ArrowLeft size={13} /> Back to website
            </Link>
            <Link href="/learner-portal" className="text-white/35 hover:text-white/70">Learner portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
