import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, FileText, Megaphone, ShieldCheck } from "lucide-react";
import LearnerLoginForm from "@/components/portal/LearnerLoginForm";
import { getSessionUser } from "@/lib/auth";
import { getContent } from "@/lib/site";

export const metadata = { title: "Sign in" };

export default async function LearnerLoginPage() {
  const user = await getSessionUser();
  if (user?.role === "learner") redirect("/learner-portal/dashboard");
  const content = getContent();

  return (
    <section className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-[1020px]">
        <div className="grid overflow-hidden rounded-[2rem] border border-[#e2e8f0] bg-white shadow-[0_24px_60px_rgba(15,23,42,.12)] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0f172a] p-9 text-white lg:flex">
            <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#60a5fa]/25" />
            <div aria-hidden className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#0d6db7]/20" />
            <div className="relative">
              <img src="/assets/school-crest.webp" alt="NSSS crest" className="h-16 w-16 rounded-full border-2 border-white/30" />
              <div className="mt-7 text-xs font-extrabold uppercase tracking-[.2em] text-[#0d6db7]">Secure access</div>
              <h1 className="display mt-3 text-4xl leading-tight">Welcome back to your portal.</h1>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Sign in with the Student ID and PIN issued by the school to access notices, learning resources and your
                published term reports.
              </p>
              <ul className="mt-8 grid gap-4 text-sm">
                {[
                  [Megaphone, "School announcements and notices"],
                  [BookOpen, "Learning resources and documents"],
                  [FileText, "Term reports published by the school"],
                  [ShieldCheck, "Your own private learner record"],
                ].map(([Icon, label]) => {
                  const Component = Icon as React.ComponentType<{ size?: number; className?: string }>;
                  return (
                    <li key={String(label)} className="flex items-center gap-3 text-white/80">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#ffd7c5]">
                        <Component size={16} />
                      </span>
                      {label as string}
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="relative mt-10 text-[11px] leading-5 text-white/40">
              Access is monitored. Only the learner named on the account may use these credentials.
            </p>
          </div>

          <div className="p-7 sm:p-10">
            <div className="lg:hidden">
              <div className="flex items-center gap-3">
                <img src="/assets/school-crest.webp" alt="NSSS crest" className="h-12 w-12 rounded-full" />
                <div>
                  <div className="display text-xl text-[#0f172a]">{content["site.short_name"]}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[.14em] text-[#0b4f8a]">Learner Portal</div>
                </div>
              </div>
            </div>
            <div className="eyebrow mt-6 lg:mt-0">Learner sign-in</div>
            <h2 className="display mt-3 text-3xl text-[#0f172a]">Enter your school credentials</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Use the Student ID and PIN provided by the school office. Both are needed to open your portal.
            </p>
            <div className="mt-7">
              <LearnerLoginForm />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e8f0] pt-5 text-[11px]">
              <Link href="/" className="font-bold text-[#0b4f8a] hover:underline">← Back to school website</Link>
              <Link href="/admin/login" className="text-[#94a3b8] hover:text-[#475569]">School staff login</Link>
            </div>
          </div>
        </div>
        <p className="mt-5 text-center text-[11px] leading-5 text-[#94a3b8]">
          Portal access is real and protected by the school database. For a lost PIN, contact the school office on{" "}
          {content["site.phone"]} (placeholder number).
        </p>
      </div>
    </section>
  );
}
