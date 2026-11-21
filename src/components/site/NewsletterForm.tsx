"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { subscribe, type FormState } from "@/app/actions/public";

const initial: FormState = { ok: false, message: "" };

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribe, initial);

  useEffect(() => {
    if (state.message) {
      if (state.ok) toast.success(state.message);
      else toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="mt-6 flex overflow-hidden rounded-xl border border-white/15 bg-white/5">
      <label htmlFor="newsletter-email" className="sr-only">
        Email Address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email Address"
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1 bg-[#0d6db7] px-4 text-sm font-bold text-white hover:bg-[#0b5a9e] disabled:opacity-70"
      >
        {pending ? "..." : "Subscribe"}
        <ArrowRight size={15} aria-hidden />
      </button>
    </form>
  );
}
