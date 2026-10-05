// FIXED FILE — do not edit. Logo cloud ("trusted by") block; all copy via props.
// A logo without `src` renders its name as a wordmark.
import { Section } from "@/components/blocks/shared";
import { cn } from "@/lib/utils";

export type LogoItem = { name: string; src?: string; href?: string };

export interface LogoCloudProps {
  id?: string;
  title?: string;
  logos: LogoItem[];
  /** row: single centered row | grid: bordered tiles | muted: row on a muted band */
  variant?: "row" | "grid" | "muted";
}

function Logo({ logo }: { logo: LogoItem }) {
  const mark = logo.src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo.src} alt={logo.name} loading="lazy" className="h-8 w-auto max-w-[140px] object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" />
  ) : (
    <span className="font-display text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground">{logo.name}</span>
  );
  return logo.href ? (
    <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
      {mark}
    </a>
  ) : (
    mark
  );
}

export default function LogoCloud({ id, title, logos, variant = "row" }: LogoCloudProps) {
  const grid = variant === "grid";
  return (
    <Section id={id} compact className={cn(variant === "muted" && "bg-muted/50")}>
      {title && <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>}
      <ul
        className={cn(
          grid
            ? "grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3 lg:grid-cols-6"
            : "flex flex-wrap items-center justify-center gap-x-12 gap-y-8",
        )}
      >
        {(logos ?? []).map((logo, i) => (
          <li key={i} className={cn("flex items-center justify-center", grid && "bg-background p-6")}>
            <Logo logo={logo} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
