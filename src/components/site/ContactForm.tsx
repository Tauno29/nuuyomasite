"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { sendMessage, type FormState } from "@/app/actions/public";

const initialState: FormState = { ok: false, message: "" };

const inputClass =
  "w-full rounded-xl border border-[#e5dbd3] bg-white px-4 py-3 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#076db2] focus:ring-2 focus:ring-[#076db2]/15";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,109,183,.25)] hover:bg-[#ff9b79] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function ContactForm({ subjects }: { subjects: string[] }) {
  const [state, formAction] = useActionState(sendMessage, initialState);

  useEffect(() => {
    if (state.message && state.ok) toast.success(state.message);
    if (state.message && !state.ok) toast.error(state.message);
  }, [state]);

  if (state.ok) {
    return (
      <div className="rounded-[1.5rem] border border-[#cdeadd] bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9faf1] text-[#0f8a55]">
          <CheckCircle2 size={28} />
        </div>
        <h3 className="display mt-4 text-2xl text-[#0f172a]">Message sent</h3>
        <p className="mt-2 text-sm leading-6 text-[#5d6977]">{state.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="pill mt-5 border border-[#e5dbd3] px-5 py-2.5 text-xs font-bold text-[#475569] hover:border-[#0b4f8a]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[.08em] text-[#7c7168]">Your name *</span>
        <input name="name" required maxLength={120} autoComplete="name" className={`mt-1.5 ${inputClass}`} placeholder="Full name" />
        {state.errors?.name && <span className="mt-1 block text-xs font-semibold text-[#c0392b]">{state.errors.name}</span>}
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[.08em] text-[#7c7168]">Email address *</span>
        <input name="email" type="email" required maxLength={160} autoComplete="email" className={`mt-1.5 ${inputClass}`} placeholder="name@example.com" />
        {state.errors?.email && <span className="mt-1 block text-xs font-semibold text-[#c0392b]">{state.errors.email}</span>}
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[.08em] text-[#7c7168]">Phone (optional)</span>
        <input name="phone" type="tel" maxLength={30} autoComplete="tel" className={`mt-1.5 ${inputClass}`} placeholder="+264 …" />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[.08em] text-[#7c7168]">Subject *</span>
        <select name="subject" required className={`mt-1.5 ${inputClass}`} defaultValue="">
          <option value="" disabled>Select a subject…</option>
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
        {state.errors?.subject && <span className="mt-1 block text-xs font-semibold text-[#c0392b]">{state.errors.subject}</span>}
      </label>
      <label className="block sm:col-span-2">
        <span className="text-xs font-bold uppercase tracking-[.08em] text-[#7c7168]">Message *</span>
        <textarea name="message" required rows={6} maxLength={4000} className={`mt-1.5 ${inputClass}`} placeholder="How can the school office help you?" />
        {state.errors?.message && <span className="mt-1 block text-xs font-semibold text-[#c0392b]">{state.errors.message}</span>}
      </label>
      <p className="text-[11px] leading-5 text-[#94a3b8] sm:col-span-2">
        Do not send identity numbers, report cards or payment details through this form. Required fields are marked *.
      </p>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SubmitButton />
        <span className="text-[11px] text-[#94a3b8]">Messages are stored securely for the school office.</span>
      </div>
    </form>
  );
}
