import { Database, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, adminInput, adminLabel } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { updateAdminAccount } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const learnerCount = db.prepare("SELECT COUNT(*) AS n FROM learners WHERE active = 1").get() as { n: number };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Office"
        title="Settings & security"
        body="Manage your administrator credentials and review how the website is secured."
      />

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-2">
        <AdminCard title="Administrator account" description="Signed in with a secure, server-verified session.">
          <dl className="grid gap-2 text-[11px]">
            <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fafc] px-3 py-2.5">
              <dt className="font-semibold text-[#64748b]">Name</dt>
              <dd className="font-bold text-[#0f172a]">{admin.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fafc] px-3 py-2.5">
              <dt className="font-semibold text-[#64748b]">Email</dt>
              <dd className="font-bold text-[#0f172a]">{admin.email ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fafc] px-3 py-2.5">
              <dt className="font-semibold text-[#64748b]">Role</dt>
              <dd><Badge tone="blue">Administrator</Badge></dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fafc] px-3 py-2.5">
              <dt className="font-semibold text-[#64748b]">Website</dt>
              <dd><a href={siteUrl} className="font-bold text-[#0d6db7] hover:underline" target="_blank" rel="noreferrer">{siteUrl.replace(/^https?:\/\//, "")}</a></dd>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fafc] px-3 py-2.5">
              <dt className="font-semibold text-[#64748b]">Active learner accounts</dt>
              <dd className="font-bold text-[#0f172a]">{learnerCount.n}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/admin/export"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e7ddd5] px-3 text-[10px] font-bold text-[#0f172a] transition hover:border-[#0f172a]/40"
            >
              <Database size={13} /> Download database backup
            </a>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e7ddd5] px-3 text-[10px] font-bold text-[#0f172a] transition hover:border-[#0f172a]/40"
            >
              <ShieldCheck size={13} /> View public website
            </a>
          </div>
        </AdminCard>

        <AdminCard title="Change password" description="Use at least 10 characters. Avoid reusing the password from another service.">
          <ActionForm action={updateAdminAccount} submitLabel="Update password" pendingLabel="Updating…" tone="coral" resetOnSuccess>
            <div className="grid gap-3">
              <label className="block">
                <span className={adminLabel}>Current password *</span>
                <input name="current_password" type="password" required autoComplete="current-password" className={`mt-1.5 ${adminInput}`} />
              </label>
              <label className="block">
                <span className={adminLabel}>New password *</span>
                <input name="new_password" type="password" required minLength={10} autoComplete="new-password" className={`mt-1.5 ${adminInput}`} />
              </label>
              <label className="block">
                <span className={adminLabel}>Confirm new password *</span>
                <input name="confirm_password" type="password" required minLength={10} autoComplete="new-password" className={`mt-1.5 ${adminInput}`} />
              </label>
            </div>
          </ActionForm>
        </AdminCard>

        <AdminCard title="How the site is secured" description="Key protections built into this website." className="xl:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: <Lock size={15} />, title: "Role-based access", body: "Administrators and learners sign in separately. Every admin page and server action re-checks the signed-in role on the server." },
              { icon: <KeyRound size={15} />, title: "Hashed credentials", body: "Passwords and learner PINs are stored as bcrypt hashes. Session tokens are stored only as SHA-256 hashes and expire after 7 days." },
              { icon: <ShieldCheck size={15} />, title: "Login protection", body: "Sign-in attempts are rate limited. Login errors do not reveal whether an email address or account exists." },
              { icon: <Database size={15} />, title: "Protected uploads", body: "Uploads are limited to 8 MB and checked by file signature. Only files inside the uploads folder can be replaced or removed." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl border border-[#e2e8f0] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef7f1] text-[#0f8a55]">{item.icon}</span>
                <div>
                  <h3 className="text-xs font-bold text-[#1e293b]">{item.title}</h3>
                  <p className="mt-1 text-[10px] leading-5 text-[#64748b]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-[#fff7ef] px-4 py-3 text-[10px] leading-5 text-[#8a5a20]">
            Before sharing this website publicly, change the default administrator password, review the office contact details in
            <strong> Website Content → Brand &amp; Contact</strong>, and replace all placeholder photographs and fees with the school&apos;s official information.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
