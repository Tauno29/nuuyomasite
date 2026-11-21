import Link from "next/link";

export const adminInput =
  "w-full rounded-lg border border-[#e0d6ce] bg-white px-3 py-2 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#0d6db7] focus:ring-2 focus:ring-[#0d6db7]/15";
export const adminLabel = "text-[10px] font-extrabold uppercase tracking-[.1em] text-[#64748b]";

export function AdminPageHeader({
  eyebrow,
  title,
  body,
  actions,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#0b4f8a]">{eyebrow}</div>
        <h1 className="display mt-1.5 text-3xl text-[#0f172a] sm:text-4xl">{title}</h1>
        {body && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">{body}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-[#e9e0d8] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,.04)] sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-extrabold text-[#0f172a]">{title}</h2>}
            {description && <p className="mt-1 text-[11px] leading-5 text-[#64748b]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const tones: Record<string, string> = {
  green: "bg-[#e9faf1] text-[#0f8a55]",
  amber: "bg-[#ffffff] text-[#a86f0a]",
  red: "bg-[#fff1ef] text-[#b03a2e]",
  blue: "bg-[#e9f7ff] text-[#0d6db7]",
  purple: "bg-[#f5edff] text-[#7c3fc0]",
  grey: "bg-[#f4f0ec] text-[#6a625b]",
  coral: "bg-[#e9f4ff] text-[#0b4f8a]",
};

export function Badge({ tone = "grey", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] ${tones[tone] ?? tones.grey}`}>
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[#ddd2c9] bg-[#f8fafc] p-8 text-center">
      {icon && <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b4f8a]">{icon}</div>}
      <p className="text-sm font-bold text-[#475569]">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-[#64748b]">{body}</p>
      {action && (
        <Link href={action.href} className="mt-3 inline-flex text-xs font-bold text-[#0b4f8a] hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  );
}
