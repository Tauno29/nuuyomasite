export type FormState = { ok: boolean; message: string; errors?: Record<string, string> };

export const emptyFormState: FormState = { ok: false, message: "" };
