"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { emptyFormState, type FormState } from "@/lib/form";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

const tones: Record<string, string> = {
  coral: "bg-[#0d6db7] text-white hover:bg-[#0b5a9e]",
  navy: "bg-[#0f172a] text-white hover:bg-[#334155]",
  green: "bg-[#0f8a55] text-white hover:bg-[#0d7a4b]",
  danger: "bg-[#c0392b] text-white hover:bg-[#a93226]",
};

export default function ActionForm({
  action,
  children,
  submitLabel,
  pendingLabel,
  tone = "coral",
  compact = false,
  className = "",
  confirm,
  resetOnSuccess = false,
  fullWidth = false,
}: {
  action: Action;
  children: React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  tone?: "coral" | "navy" | "green" | "danger";
  compact?: boolean;
  className?: string;
  confirm?: string;
  resetOnSuccess?: boolean;
  fullWidth?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, emptyFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) {
      toast.success(state.message);
      if (resetOnSuccess) formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={className}
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      {children}
      <div className={`flex flex-wrap items-center gap-3 ${compact ? "mt-3" : "mt-5"}`}>
        <button
          type="submit"
          disabled={pending}
          className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition disabled:cursor-wait disabled:opacity-60 ${
            compact ? "px-4 py-2 text-[11px]" : "px-5 py-2.5 text-xs"
          } ${tones[tone]} ${fullWidth ? "w-full" : ""}`}
        >
          {pending ? <Loader2 size={compact ? 12 : 14} className="animate-spin" /> : tone === "danger" ? <Trash2 size={compact ? 12 : 14} /> : <CheckCircle2 size={compact ? 12 : 14} />}
          {pending ? pendingLabel || "Saving…" : submitLabel}
        </button>
      </div>
      {state.message && !state.ok && (
        <p className="mt-2 rounded-lg bg-[#fff5f4] px-3 py-2 text-[11px] font-semibold leading-5 text-[#b03a2e]" role="alert">
          {state.message}
        </p>
      )}
      {state.message && state.ok && (
        <p className="mt-2 text-[11px] font-semibold text-[#0f8a55]" role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
