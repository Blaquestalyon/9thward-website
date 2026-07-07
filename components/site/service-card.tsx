"use client";

import * as React from "react";
import {
  Disc3,
  LineChart,
  Megaphone,
  Music4,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/lib/airtable/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ServiceInquiryForm } from "./service-inquiry-form";

const ICONS: Record<string, LucideIcon> = {
  production: Disc3,
  management: LineChart,
  promotion: Megaphone,
};

type ServiceName = "Production" | "Management" | "Promotion";

function inquiryDefault(slug: string): ServiceName | undefined {
  const s = slug.toLowerCase();
  if (s.includes("production")) return "Production";
  if (s.includes("management")) return "Management";
  if (s.includes("promotion")) return "Promotion";
  return undefined;
}

export function ServiceCard({ service }: { service: Service }) {
  const [open, setOpen] = React.useState(false);
  const Icon = ICONS[service.slug.toLowerCase()] ?? Music4;
  const cta =
    service.slug.toLowerCase().includes("production")
      ? "Start a production inquiry"
      : service.slug.toLowerCase().includes("management")
        ? "Talk to us about management"
        : service.slug.toLowerCase().includes("promotion")
          ? "Ask about promotion"
          : "Inquire";

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="font-display text-xl font-semibold">{service.name}</h3>
      {service.summary && (
        <p className="mt-1 text-sm font-medium text-gold">{service.summary}</p>
      )}
      {service.details && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.details}
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-6 w-full">
            {cta}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{service.name} inquiry</DialogTitle>
            <DialogDescription>
              Tell us where you are and where you want to go. No pricing — we
              start with a conversation.
            </DialogDescription>
          </DialogHeader>
          <ServiceInquiryForm
            defaultService={inquiryDefault(service.slug)}
            onDone={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
