"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalRouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc] px-5 py-16">
      <div className="w-full max-w-lg rounded-[1.6rem] border border-[#dbeafe] bg-white p-8 text-center shadow-[0_14px_34px_rgba(15,23,42,.07)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e9f4ff] text-[#c25a00]">
          <AlertTriangle size={26} />
        </div>
        <h1 className="display mt-4 text-3xl text-[#0f172a]">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-[#5d6977]">
          The page could not be loaded. Please try again. If the problem continues, contact the school office.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-6 py-3 text-sm font-bold text-white hover:bg-[#ff9b79]"
          >
            <RotateCcw size={15} /> Try again
          </button>
          <Link href="/" className="pill inline-flex items-center gap-2 border border-[#e5dbd3] px-6 py-3 text-sm font-bold text-[#475569] hover:border-[#0b4f8a]">
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
