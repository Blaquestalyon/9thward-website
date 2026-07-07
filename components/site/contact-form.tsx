"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { contactAction } from "@/app/actions/forms";
import { initialFormState } from "@/lib/validation/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, Honeypot, SubmitButton } from "./form-primitives";

export function ContactForm() {
  const [state, formAction] = useActionState(contactAction, initialFormState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold" />
        <p className="text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.status === "error" && state.message && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" required error={state.errors?.name}>
          {(p) => <Input {...p} autoComplete="name" />}
        </Field>
        <Field name="email" label="Email" required error={state.errors?.email}>
          {(p) => <Input {...p} type="email" autoComplete="email" />}
        </Field>
      </div>

      <Field name="subject" label="Subject" required error={state.errors?.subject}>
        {(p) => <Input {...p} />}
      </Field>

      <Field name="message" label="Message" required error={state.errors?.message}>
        {(p) => <Textarea {...p} rows={5} />}
      </Field>

      <Honeypot />
      <SubmitButton>Send message</SubmitButton>
    </form>
  );
}
