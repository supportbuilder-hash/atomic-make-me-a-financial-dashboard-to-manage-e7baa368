// FIXED FILE — do not edit. Types + layout helpers shared by every section block.
import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import SiteLink from "@/components/SiteLink";
import { buttonVariants, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** A link rendered as a button. `href`: "/route", "#section" or "https://...". */
export type CtaLink = { label: string; href: string };
/** Any image URL (remote https or /public path). */
export type BlockImage = { src: string; alt: string };

export function Section({
  id,
  className,
  compact,
  children,
}: {
  id?: string;
  /** Background/text classes only — vertical padding comes from `compact`. */
  className?: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn(compact ? "py-12 md:py-16" : "py-20 md:py-28", className)}>
      <Reveal className="mx-auto max-w-7xl px-6">{children}</Reveal>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  if (!eyebrow && !title && !subtitle) return null;
  return (
    <div className={cn("mb-12 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
      {title && <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>}
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function CtaButton({
  cta,
  variant = "default",
  size = "lg",
  className,
}: {
  cta: CtaLink;
  variant?: ButtonVariant;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  return (
    <SiteLink href={cta.href} className={buttonVariants({ variant, size, className })}>
      {cta.label}
    </SiteLink>
  );
}

/** Plain <img>: works for any URL without next/image host/size config. */
export function BlockImg({ image, className, eager }: { image: BlockImage; className?: string; eager?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image.src} alt={image.alt} loading={eager ? "eager" : "lazy"} className={cn("object-cover", className)} />;
}
