"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, KeyRound, Loader2, LockKeyhole, LogIn, UserRound } from "lucide-react";
import { toast } from "sonner";
import { learnerLogin, type LoginState } from "@/app/learner-portal/actions";

const initialState: LoginState = { ok: false, message: "" };

const inputClass =
  "w-full rounded-xl border border-[#e5dbd3] bg-white py-3 pl-11 pr-4 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#076db2] focus:ring-2 focus:ring-[#076db2]/15";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="pill flex w-full items-center justify-center gap-2 bg-[#0d6db7] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,109,183,.25)] transition hover:bg-[#ff9b79] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
      {pending ? "Signing in…" : "Sign in to the portal"}
    </button>
  );
}

export default function LearnerLoginForm() {
  const [state, formAction] = useActionState(learnerLogin, initialState);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[.08em] text-[#7c7168]">Student ID</span>
        <div className="relative mt-1.5">
          <UserRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            name="student_id"
            required
            autoComplete="username"
            autoCapitalize="characters"
            spellCheck={false}
            className={inputClass}
            placeholder="e.g. NSSS-2026-001"
          />
        </div>
        {state.errors?.student_id && <span className="mt-1 block text-xs font-semibold text-[#c0392b]">{state.errors.student_id}</span>}
      </label>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[.08em] text-[#7c7168]">PIN</span>
        <div className="relative mt-1.5">
          <KeyRound size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            name="pin"
            type={showPin ? "text" : "password"}
            required
            autoComplete="current-password"
            className={`${inputClass} pr-12`}
            placeholder="Your school-issued PIN"
          />
          <button
            type="button"
            onClick={() => setShowPin((value) => !value)}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f6efe9]"
            aria-label={showPin ? "Hide PIN" : "Show PIN"}
            aria-pressed={showPin}
          >
            {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {state.errors?.pin && <span className="mt-1 block text-xs font-semibold text-[#c0392b]">{state.errors.pin}</span>}
      </label>

      {state.message && !state.ok && (
        <p className="rounded-xl bg-[#fff5f4] px-4 py-3 text-xs font-semibold leading-5 text-[#b03a2e]" role="alert">
          {state.message}
        </p>
      )}

      <SubmitButton />

      <div className="flex items-start gap-2 rounded-xl bg-[#f7f2ee] p-3 text-[11px] leading-5 text-[#64748b]">
        <LockKeyhole size={14} className="mt-0.5 shrink-0 text-[#64748b]" />
        <span>
          Your PIN is issued by the school office. Staff will never ask you to share it. If you have lost your PIN, contact the
          office to have it reset.
        </span>
      </div>
    </form>
  );
}
