"use client";

// FIXED FILE — do not edit. Contact form block (no backend): shows `successMessage`
// after submit; pass `onSubmit` to handle the data yourself. All copy via props.
import { useState, type FormEvent } from "react";
import { Section, SectionHeader } from "@/components/blocks/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type ContactFormData = { name: string; email: string; message: string };
export type ContactDetail = { label: string; value: string };

export interface ContactFormProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
  errorMessage?: string;
  /** Contact info shown beside the form (split variant) or under it. */
  details?: ContactDetail[];
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
  /** simple: centered form | split: details left, form right | card: form on a card */
  variant?: "simple" | "split" | "card";
}

export default function ContactForm({
  id,
  eyebrow,
  title,
  subtitle,
  nameLabel,
  emailLabel,
  messageLabel,
  submitLabel,
  successMessage,
  errorMessage,
  details,
  onSubmit,
  variant = "simple",
}: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const split = variant === "split";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: ContactFormData = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    setStatus("sending");
    try {
      await onSubmit?.(data);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const info = (details ?? []).length > 0 && (
    <dl className="space-y-4">
      {(details ?? []).map((d, i) => (
        <div key={i}>
          <dt className="text-sm font-semibold">{d.label}</dt>
          <dd className="text-muted-foreground">{d.value}</dd>
        </div>
      ))}
    </dl>
  );

  const form =
    status === "sent" ? (
      <p role="status" className="rounded-lg border border-border bg-muted p-6 text-center font-medium">
        {successMessage}
      </p>
    ) : (
      <form
        onSubmit={handleSubmit}
        className={cn("space-y-5", variant === "card" && "rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm")}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${id ?? "contact"}-name`}>{nameLabel}</Label>
            <Input id={`${id ?? "contact"}-name`} name="name" autoComplete="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id ?? "contact"}-email`}>{emailLabel}</Label>
            <Input id={`${id ?? "contact"}-email`} name="email" type="email" autoComplete="email" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id ?? "contact"}-message`}>{messageLabel}</Label>
          <Textarea id={`${id ?? "contact"}-message`} name="message" rows={5} required />
        </div>
        {status === "error" && errorMessage && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </form>
    );

  return (
    <Section id={id} className={variant === "card" ? "bg-muted/40" : undefined}>
      {split ? (
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" />
            {info}
          </div>
          {form}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {form}
          {info && <div className="mt-10">{info}</div>}
        </div>
      )}
    </Section>
  );
}
