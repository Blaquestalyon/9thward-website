"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { newsletterAction } from "@/app/actions/forms";
import { initialFormState } from "@/lib/validation/schemas";
import { Input } from "@/components/ui/input";
import { Honeypot, SubmitButton } from "./form-primitives";

export function NewsletterForm() {
  const [state, formAction] = useActionState(newsletterAction, initialFormState);

  if (state.status === "success") {
    return (
      <p className="flex items-center gap-2 text-sm text-foreground">
        <CheckCircle2 className="h-4 w-4 text-gold" />
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={Boolean(state.errors?.email)}
          className="bg-background"
          required
        />
        <Honeypot />
        <SubmitButton size="default" className="shrink-0">
          Subscribe
        </SubmitButton>
      </div>
      {state.errors?.email && (
        <p className="text-xs font-medium text-destructive">
          {state.errors.email}
        </p>
      )}
      {state.status === "error" && !state.errors?.email && state.message && (
        <p className="text-xs font-medium text-destructive">{state.message}</p>
      )}
    </form>
  );
}
