"use client";

import * as React from "react";
import { CalendarCheck } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookingForm } from "./booking-form";

export function BookingDialog({
  artistOptions,
  label = "Book an artist",
  variant = "default",
  size = "default",
  className,
}: {
  artistOptions?: string[];
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <CalendarCheck className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Book an artist</DialogTitle>
          <DialogDescription>
            Tell us about your event and we&apos;ll follow up to lock in details.
          </DialogDescription>
        </DialogHeader>
        <BookingForm
          artistOptions={artistOptions}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
