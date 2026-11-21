"use client";

import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { adminLogin } from "@/app/admin/actions";
import { emptyFormState } from "@/lib/form";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#0d6db7] focus:bg-white/15";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, emptyFormState);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4">
      <label className="block">
        <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-white/55">Administrator email</span>
        <div className="relative mt-1.5">
          <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
          <input name="email" type="email" required autoComplete="email" className={inputClass} placeholder="admin@nuuyomasss.na" />
        </div>
        {state.errors?.email && <span className="mt-1 block text-[11px] font-semibold text-[#ffb4a6]">{state.errors.email}</span>}
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-white/55">Password</span>
        <div className="relative mt-1.5">
          <LockKeyhole size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            name="password"
            type={show ? "text" : "password"}
            required
            autoComplete="current-password"
            className={`${inputClass} pr-12`}
            placeholder="Your password"
          />
          <button
            type="button"
            onClick={() => setShow((value) => !value)}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/50 hover:bg-white/10"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {state.errors?.password && <span className="mt-1 block text-[11px] font-semibold text-[#ffb4a6]">{state.errors.password}</span>}
      </label>

      {state.message && !state.ok && (
        <p className="rounded-xl border border-[#ff8f7a]/30 bg-[#ff8f7a]/10 px-4 py-3 text-xs font-semibold leading-5 text-[#ffc4b8]" role="alert">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="pill mt-1 flex w-full items-center justify-center gap-2 bg-[#0d6db7] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(13,109,183,.28)] transition hover:bg-[#ff9b79] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
        {pending ? "Signing in…" : "Sign in to the console"}
      </button>
    </form>
  );
}
