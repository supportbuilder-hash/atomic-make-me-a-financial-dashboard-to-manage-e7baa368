// FIXED FILE — do not edit. Feature grid block; all copy comes in via props.
import type { ReactNode } from "react";
import { Section, SectionHeader } from "@/components/blocks/shared";
import { cn } from "@/lib/utils";

export type FeatureItem = { title: string; description: string; icon?: ReactNode };

export interface FeatureGridProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  /** cards: bordered cards | minimal: icon + text, no box | list: two-column rows with dividers
   *  | glass: premium — frosted glass cards with glowing icons on a gradient-mesh backdrop */
  variant?: "cards" | "minimal" | "list" | "glass";
}

const COLS = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" };

export default function FeatureGrid({ id, eyebrow, title, subtitle, items, columns = 3, variant = "cards" }: FeatureGridProps) {
  const list = items ?? [];
  const glass = variant === "glass";
  return (
    <Section id={id} className={glass ? "bg-mesh" : variant === "cards" ? "bg-muted/40" : "bg-background"}>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className={cn("grid gap-6", variant === "list" ? "md:grid-cols-2 md:gap-x-12" : COLS[columns])}>
        {list.map((item, i) => (
          <div
            key={i}
            className={cn(
              variant === "cards" && "rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              glass && "glass rounded-2xl p-7 text-card-foreground transition duration-200 hover:-translate-y-1 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              variant === "list" && "flex gap-4 border-b border-border pb-6",
            )}
          >
            {item.icon && (
              <div
                className={cn(
                  "mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
                  glass ? "rounded-xl bg-primary text-primary-foreground shadow-glow" : "bg-primary/10 text-primary",
                )}
              >
                {item.icon}
              </div>
            )}
            <div>
              <h3 className="font-display text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
