"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { submitApplication, type FormState } from "@/app/actions/public";

const initialState: FormState = { ok: false, message: "" };

const steps = [
  { title: "Learner's Particulars", hint: "Tell us about the learner." },
  { title: "Guardian Details", hint: "Who should we contact?" },
  { title: "Declaration", hint: "Review and submit." },
];

const inputClass =
  "w-full rounded-xl border border-[#e5dbd3] bg-white px-4 py-3 text-sm text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#076db2] focus:ring-2 focus:ring-[#076db2]/15";
const labelClass = "text-xs font-bold uppercase tracking-[.08em] text-[#7c7168]";
const errorClass = "mt-1 text-xs font-semibold text-[#c0392b]";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="pill inline-flex items-center gap-2 bg-[#0d6db7] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(13,109,183,.25)] transition hover:bg-[#ff9b79] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
      {pending ? "Sending application…" : "Submit application"}
    </button>
  );
}

function Field({
  label,
  name,
  error,
  required,
  children,
  className = "",
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>
        {label} {required && <span className="text-[#c0392b]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className={errorClass}>{error}</span>}
      <span className="sr-only" id={`${name}-error`}>{error}</span>
    </label>
  );
}

export default function ApplicationForm() {
  const [state, formAction] = useActionState(submitApplication, initialState);
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.ok) toast.error(state.message);
    if (state.ok) toast.success("Application sent to the school office.");
  }, [state]);

  useEffect(() => {
    if (state.errors && Object.keys(state.errors).length > 0) {
      const first = Object.keys(state.errors)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      toast.error("Please check the highlighted fields.");
    }
  }, [state.errors]);

  function goNext() {
    const current = formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (!current) return;
    const required = Array.from(current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[required]"));
    const invalid = required.find((input) => !input.value.trim());
    if (invalid) {
      invalid.focus();
      setStepError("Please complete the required fields before continuing.");
      toast.error("Please complete the required fields.");
      return;
    }
    const email = current.querySelector<HTMLInputElement>('input[type="email"]');
    if (email && email.value && !email.checkValidity()) {
      email.focus();
      setStepError("Please enter a valid email address.");
      return;
    }
    setStepError("");
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  if (state.ok) {
    return (
      <div className="rounded-[1.6rem] border border-[#cdeadd] bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,.06)] sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9faf1] text-[#0f8a55]">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="display mt-5 text-3xl text-[#0f172a]">Application received</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#5d6977]">{state.message}</p>
        <div className="mx-auto mt-6 max-w-lg rounded-xl bg-[#f8fafc] p-4 text-left text-xs leading-6 text-[#7c7168]">
          <strong className="text-[#1e293b]">What happens next?</strong> The school office reviews every application.
          Placement is subject to available places and the school&apos;s admission policy. Keep your contact number reachable
          and prepare the required documents listed on this page.
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="pill bg-[#0f172a] px-6 py-3 text-sm font-bold text-white hover:bg-[#24384f]">
            Back to homepage
          </Link>
          <Link href="/admissions" className="pill border border-[#e5dbd3] px-6 py-3 text-sm font-bold text-[#475569] hover:border-[#0b4f8a]">
            Admissions information
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-[#e2e8f0] bg-white shadow-[0_14px_34px_rgba(15,23,42,.07)]">
      <div className="border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="eyebrow">Online application</div>
            <h2 className="display mt-2 text-2xl text-[#0f172a] sm:text-3xl">Application for Admission</h2>
          </div>
          <span className="pill bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#0b4f8a] shadow-sm">
            Grades 8 – 12
          </span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {steps.map((item, index) => {
            const isActive = index === step;
            const isDone = index < step;
            return (
              <div key={item.title} className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition ${
                    isDone ? "bg-[#4bc878] text-white" : isActive ? "bg-[#0f172a] text-white" : "bg-[#efe6df] text-[#a39a93]"
                  }`}
                >
                  {isDone ? "✓" : index + 1}
                </span>
                <div className="min-w-0">
                  <div className={`truncate text-xs font-bold ${isActive || isDone ? "text-[#1e293b]" : "text-[#9a9089]"}`}>{item.title}</div>
                  <div className="truncate text-[10px] text-[#94a3b8]">{item.hint}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#efe6df]">
          <div className="h-full rounded-full bg-[#4bc878] transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <form ref={formRef} action={formAction} noValidate className="px-6 py-7 sm:px-8">
        {/* honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <div data-step="0" hidden={step !== 0} className="grid gap-4 sm:grid-cols-2">
          <Field label="Learner's first name" name="learner_first_name" required error={state.errors?.learner_first_name}>
            <input name="learner_first_name" required maxLength={80} autoComplete="given-name" className={inputClass} placeholder="e.g. Maria" />
          </Field>
          <Field label="Learner's surname" name="learner_surname" required error={state.errors?.learner_surname}>
            <input name="learner_surname" required maxLength={80} autoComplete="family-name" className={inputClass} placeholder="e.g. Shikongo" />
          </Field>
          <Field label="Date of birth" name="date_of_birth" error={state.errors?.date_of_birth}>
            <input type="date" name="date_of_birth" className={inputClass} />
          </Field>
          <Field label="Gender" name="gender" error={state.errors?.gender}>
            <select name="gender" className={inputClass} defaultValue="">
              <option value="">Select…</option>
              <option>Female</option>
              <option>Male</option>
              <option>Prefer not to say</option>
            </select>
          </Field>
          <Field label="Grade applying for" name="grade" required error={state.errors?.grade}>
            <select name="grade" required className={inputClass} defaultValue="Grade 8">
              {["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </select>
          </Field>
          <Field label="Home language" name="home_language" error={state.errors?.home_language}>
            <input name="home_language" maxLength={80} className={inputClass} placeholder="e.g. Oshindonga" />
          </Field>
          <Field label="Postal address" name="postal_address" className="sm:col-span-2" error={state.errors?.postal_address}>
            <input name="postal_address" maxLength={200} autoComplete="street-address" className={inputClass} placeholder="P.O. Box / village / town" />
          </Field>
        </div>

        <div data-step="1" hidden={step !== 1} className="grid gap-4 sm:grid-cols-2">
          <Field label="Guardian's full name" name="guardian_name" required className="sm:col-span-2" error={state.errors?.guardian_name}>
            <input name="guardian_name" required maxLength={120} autoComplete="name" className={inputClass} placeholder="Parent or guardian" />
          </Field>
          <Field label="Guardian's phone number" name="guardian_phone" required error={state.errors?.guardian_phone}>
            <input name="guardian_phone" required maxLength={30} type="tel" autoComplete="tel" className={inputClass} placeholder="+264 …" />
          </Field>
          <Field label="Guardian's email (optional)" name="guardian_email" error={state.errors?.guardian_email}>
            <input name="guardian_email" type="email" maxLength={160} autoComplete="email" className={inputClass} placeholder="name@example.com" />
          </Field>
          <Field label="Previous school" name="previous_school" error={state.errors?.previous_school}>
            <input name="previous_school" maxLength={160} className={inputClass} placeholder="Name of last school attended" />
          </Field>
          <Field label="Transport arrangements" name="transport" error={state.errors?.transport}>
            <select name="transport" className={inputClass} defaultValue="">
              <option value="">Select…</option>
              <option>School bus</option>
              <option>Private transport</option>
              <option>Hostel / boarding</option>
              <option>Not yet decided</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <span className={labelClass}>Does the learner require boarding?</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {[
                ["no", "No, day learner"],
                ["yes", "Yes, hostel"],
              ].map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#e5dbd3] bg-white px-4 py-2.5 text-sm text-[#475569] has-[:checked]:border-[#076db2] has-[:checked]:bg-[#f0f8ff]">
                  <input type="radio" name="boarding" value={value} defaultChecked={value === "no"} className="accent-[#076db2]" />
                  {label}
                </label>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-[#94a3b8]">Boarding is subject to availability. See the Boarding page for information.</p>
          </div>
        </div>

        <div data-step="2" hidden={step !== 2} className="grid gap-4">
          <Field label="Additional information (optional)" name="notes" error={state.errors?.notes}>
            <textarea name="notes" rows={4} maxLength={2000} className={inputClass} placeholder="Anything the school should know about the learner or the application." />
          </Field>
          <div className="rounded-xl bg-[#f8fafc] p-4 text-xs leading-6 text-[#7c7168]">
            <strong className="text-[#1e293b]">Declaration.</strong> I confirm that the information in this application is
            true and complete. I understand that submitting this form does not guarantee a place at Nuuyoma Senior Secondary
            School and that admission is subject to the school&apos;s admission policy and available places.
          </div>
          <label className={`flex items-start gap-3 rounded-xl border p-4 ${state.errors?.consent ? "border-[#c0392b] bg-[#fff5f4]" : "border-[#e5dbd3] bg-white"}`}>
            <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#076db2]" />
            <span className="text-xs leading-5 text-[#475569]">
              I agree to the declaration and consent to the school contacting me about this application.
              <span className="text-[#c0392b]"> *</span>
            </span>
          </label>
          {state.errors?.consent && <p className={errorClass}>{state.errors.consent}</p>}
        </div>

        {(stepError || (state.message && !state.ok)) && (
          <p className="mt-4 rounded-xl bg-[#fff5f4] px-4 py-3 text-sm font-semibold text-[#b03a2e]" role="alert">
            {stepError || state.message}
          </p>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e8f0] pt-5">
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => {
                  setStepError("");
                  setStep((s) => Math.max(0, s - 1));
                }}
                className="pill inline-flex items-center gap-2 border border-[#e5dbd3] px-5 py-3 text-sm font-bold text-[#475569] hover:border-[#0b4f8a]"
              >
                <ArrowLeft size={15} /> Back
              </button>
            )}
            <span className="self-center text-[11px] font-semibold text-[#94a3b8]">
              Step {step + 1} of {steps.length}
            </span>
          </div>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="pill inline-flex items-center gap-2 bg-[#0f172a] px-6 py-3 text-sm font-bold text-white hover:bg-[#24384f]"
            >
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <SubmitButton />
          )}
        </div>
        <p className="mt-3 text-[11px] leading-5 text-[#94a3b8]">
          Required fields are marked *. This form is protected against automated submissions. Do not include identity numbers
          or payment details.
        </p>
      </form>
    </div>
  );
}
