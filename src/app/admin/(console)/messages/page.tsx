import { Inbox, Mail, MailOpen, Phone } from "lucide-react";
import { AdminCard, AdminPageHeader, Badge, EmptyState } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site";
import Link from "next/link";

export const metadata = { title: "Messages" };

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
};

const filters = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
] as const;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: rawFilter } = await searchParams;
  const filter = filters.some((f) => f.key === rawFilter) ? (rawFilter as "all" | "unread" | "read") : "all";

  const counts = db
    .prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) AS unread FROM messages")
    .get() as { total: number; unread: number | null };
  const unread = counts.unread ?? 0;

  const messages = db
    .prepare(
      filter === "all"
        ? "SELECT * FROM messages ORDER BY is_read ASC, created_at DESC"
        : "SELECT * FROM messages WHERE is_read = ? ORDER BY created_at DESC",
    )
    .all(...(filter === "all" ? [] : [filter === "read" ? 1 : 0])) as Message[];

  return (
    <div>
      <AdminPageHeader
        eyebrow="Office"
        title="Office inbox"
        body="Messages sent through the public contact form. Reply directly to the sender's email address."
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {filters.map((f) => {
          const count = f.key === "all" ? counts.total : f.key === "unread" ? unread : counts.total - unread;
          return (
            <Link
              key={f.key}
              href={f.key === "all" ? "/admin/messages" : `/admin/messages?filter=${f.key}`}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.08em] transition ${
                filter === f.key
                  ? "border-[#0f172a] bg-[#0f172a] text-white"
                  : "border-[#e7ddd5] bg-white text-[#475569] hover:border-[#0f172a]/30"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${filter === f.key ? "bg-white/20" : "bg-[#f4eee8]"}`}>{count}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-5">
        {messages.length === 0 ? (
          <AdminCard>
            <EmptyState
              icon={<Inbox size={22} />}
              title={filter === "unread" ? "No unread messages" : "No messages here"}
              body="Messages sent through the website contact form will appear in this inbox."
            />
          </AdminCard>
        ) : (
          <div className="grid gap-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-2xl border bg-white p-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,.5)] ${
                  message.is_read ? "border-[#e2e8f0]" : "border-[#0d6db7]/25"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        message.is_read ? "bg-[#f4eee8] text-[#64748b]" : "bg-[#e8f3fb] text-[#0d6db7]"
                      }`}
                    >
                      {message.is_read ? <MailOpen size={17} /> : <Mail size={17} />}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-extrabold text-[#0f172a]">{message.subject}</h2>
                        {!message.is_read && <Badge tone="blue">Unread</Badge>}
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-[#475569]">
                        {message.name} · <a href={`mailto:${message.email}`} className="font-bold text-[#0d6db7] hover:underline">{message.email}</a>
                        {message.phone ? (
                          <>
                            {" "}· <a href={`tel:${message.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 text-[#0d6db7] hover:underline"><Phone size={10} /> {message.phone}</a>
                          </>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.06em] text-[#94a3b8]">{formatDate(message.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                      className="inline-flex h-8 items-center rounded-lg border border-[#e7ddd5] px-3 text-[10px] font-bold text-[#0f172a] transition hover:border-[#0f172a]/40"
                    >
                      Reply by email
                    </a>
                    <ActionForm action={setMessageRead} submitLabel={message.is_read ? "Mark unread" : "Mark read"} tone="navy" compact>
                      <input type="hidden" name="id" value={message.id} />
                      <input type="hidden" name="read" value={message.is_read ? "0" : "1"} />
                    </ActionForm>
                    <ActionForm action={deleteMessage} submitLabel="Delete" tone="danger" compact confirm="Delete this message permanently?">
                      <input type="hidden" name="id" value={message.id} />
                    </ActionForm>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line rounded-xl bg-[#f8fafc] p-4 text-[11px] leading-6 text-[#475569]">{message.message}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <p className="mt-5 text-[10px] leading-5 text-[#94a3b8]">
        Tip: never send learner PINs or personal records by email. Use the learner portal for secure communication.
      </p>
    </div>
  );
}
