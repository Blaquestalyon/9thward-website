"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitMusicAction } from "@/app/actions/forms";
import { initialFormState } from "@/lib/validation/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, Honeypot, SubmitButton } from "./form-primitives";

export function SubmitForm() {
  const [state, formAction] = useActionState(
    submitMusicAction,
    initialFormState
  );

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-gold" />
        <h2 className="font-display text-2xl font-semibold">Submission received</h2>
        <p className="max-w-md text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && state.message && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="artistBandName"
          label="Artist / band name"
          required
          error={state.errors?.artistBandName}
        >
          {(p) => <Input {...p} />}
        </Field>
        <Field
          name="contactName"
          label="Contact name"
          required
          error={state.errors?.contactName}
        >
          {(p) => <Input {...p} autoComplete="name" />}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="email" label="Email" required error={state.errors?.email}>
          {(p) => <Input {...p} type="email" autoComplete="email" />}
        </Field>
        <Field name="phone" label="Phone (optional)" error={state.errors?.phone}>
          {(p) => <Input {...p} type="tel" autoComplete="tel" />}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="genre" label="Genre" error={state.errors?.genre}>
          {(p) => <Input {...p} placeholder="e.g. bounce, alt-R&B" />}
        </Field>
        <Field name="city" label="City" error={state.errors?.city}>
          {(p) => <Input {...p} placeholder="Where you're based" />}
        </Field>
      </div>

      <Field
        name="musicLink"
        label="Link to your music"
        required
        hint="Spotify, SoundCloud, YouTube, or a Google Drive link."
        error={state.errors?.musicLink}
      >
        {(p) => <Input {...p} type="url" placeholder="https://" />}
      </Field>

      <Field
        name="socialLinks"
        label="Social links (optional)"
        error={state.errors?.socialLinks}
      >
        {(p) => <Input {...p} placeholder="Instagram, TikTok, etc." />}
      </Field>

      <Field name="message" label="Anything else?" error={state.errors?.message}>
        {(p) => (
          <Textarea
            {...p}
            rows={5}
            placeholder="Tell us about you, your goals, and what you're looking for."
          />
        )}
      </Field>

      <Honeypot />
      <SubmitButton size="lg">Submit your music</SubmitButton>
    </form>
  );
}
