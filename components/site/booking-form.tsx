"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { bookingAction } from "@/app/actions/forms";
import { initialFormState } from "@/lib/validation/schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Honeypot, SubmitButton } from "./form-primitives";

export function BookingForm({
  artistOptions = [],
  onDone,
}: {
  /** Artist stage names for the optional picker (from Airtable). */
  artistOptions?: string[];
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState(bookingAction, initialFormState);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold" />
        <p className="text-sm text-muted-foreground">{state.message}</p>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Close
          </button>
        )}
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
        <Field name="name" label="Your name" required error={state.errors?.name}>
          {(p) => <Input {...p} autoComplete="name" />}
        </Field>
        <Field name="email" label="Email" required error={state.errors?.email}>
          {(p) => <Input {...p} type="email" autoComplete="email" />}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="phone" label="Phone (optional)" error={state.errors?.phone}>
          {(p) => <Input {...p} type="tel" autoComplete="tel" />}
        </Field>
        <Field
          name="artistRequested"
          label="Artist requested"
          error={state.errors?.artistRequested}
        >
          {(p) =>
            artistOptions.length > 0 ? (
              <Select name={p.name}>
                <SelectTrigger id={p.id}>
                  <SelectValue placeholder="Any / not sure" />
                </SelectTrigger>
                <SelectContent>
                  {artistOptions.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input {...p} placeholder="Artist name (optional)" />
            )
          }
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="eventDate" label="Event date" error={state.errors?.eventDate}>
          {(p) => <Input {...p} type="date" />}
        </Field>
        <Field
          name="venueCity"
          label="Venue / city"
          error={state.errors?.venueCity}
        >
          {(p) => <Input {...p} placeholder="e.g. The Continental Club, Houston" />}
        </Field>
      </div>

      <Field name="budget" label="Budget range (optional)" error={state.errors?.budget}>
        {(p) => <Input {...p} placeholder="Helps us plan — not a quote" />}
      </Field>

      <Field name="details" label="Details" error={state.errors?.details}>
        {(p) => (
          <Textarea {...p} rows={4} placeholder="Tell us about the show." />
        )}
      </Field>

      <Honeypot />
      <SubmitButton className="w-full">Send booking request</SubmitButton>
    </form>
  );
}
