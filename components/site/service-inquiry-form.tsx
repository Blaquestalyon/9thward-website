"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { serviceInquiryAction } from "@/app/actions/forms";
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

const SERVICES = ["Production", "Management", "Promotion"] as const;

export function ServiceInquiryForm({
  defaultService,
  onDone,
}: {
  defaultService?: (typeof SERVICES)[number];
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState(
    serviceInquiryAction,
    initialFormState
  );

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

      <Field name="name" label="Your name" required error={state.errors?.name}>
        {(p) => <Input {...p} autoComplete="name" />}
      </Field>

      <Field name="email" label="Email" required error={state.errors?.email}>
        {(p) => <Input {...p} type="email" autoComplete="email" />}
      </Field>

      <Field name="phone" label="Phone (optional)" error={state.errors?.phone}>
        {(p) => <Input {...p} type="tel" autoComplete="tel" />}
      </Field>

      <Field
        name="serviceInterestedIn"
        label="Service you're interested in"
        required
        error={state.errors?.serviceInterestedIn}
      >
        {(p) => (
          <Select name={p.name} defaultValue={defaultService}>
            <SelectTrigger id={p.id} aria-invalid={p["aria-invalid"]}>
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((svc) => (
                <SelectItem key={svc} value={svc}>
                  {svc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      <Field
        name="artistProject"
        label="Artist / project (optional)"
        error={state.errors?.artistProject}
      >
        {(p) => <Input {...p} />}
      </Field>

      <Field
        name="details"
        label="Tell us about your goals"
        error={state.errors?.details}
      >
        {(p) => (
          <Textarea
            {...p}
            rows={4}
            placeholder="Where are you now, and where do you want to go?"
          />
        )}
      </Field>

      <Honeypot />
      <SubmitButton className="w-full">Send inquiry</SubmitButton>
    </form>
  );
}
