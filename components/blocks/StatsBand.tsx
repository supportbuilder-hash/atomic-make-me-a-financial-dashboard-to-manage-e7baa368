// FIXED FILE — do not edit. Stats band block; all copy comes in via props.
import { Section, SectionHeader } from "@/components/blocks/shared";
import { cn } from "@/lib/utils";

export type StatItem = { value: string; label: string };

export interface StatsBandProps {
  id?: string;
  title?: string;
  subtitle?: string;
  items: StatItem[];
  /** plain: numbers on the page background | cards: one card per stat | primary: primary-colored band
   *  | glass: premium — frosted glass stat cards with gradient numbers on a gradient-mesh backdrop */
  variant?: "plain" | "cards" | "primary" | "glass";
}

export default function StatsBand({ id, title, subtitle, items, variant = "plain" }: StatsBandProps) {
  const primary = variant === "primary";
  const glass = variant === "glass";
  return (
    <Section id={id} compact className={primary ? "bg-primary text-primary-foreground" : glass ? "bg-mesh" : "bg-background"}>
      {!primary && <SectionHeader title={title} subtitle={subtitle} />}
      {primary && title && <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-tight">{title}</h2>}
      <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {(items ?? []).map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col-reverse text-center",
              variant === "cards" && "rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm",
              glass && "glass rounded-2xl p-6 text-card-foreground",
            )}
          >
            <dt className={cn("mt-2 text-sm", primary ? "text-primary-foreground/80" : "text-muted-foreground")}>{item.label}</dt>
            <dd className={cn("font-display text-4xl font-bold tracking-tight", !primary && "text-primary")}>
              {glass ? <span className="text-gradient">{item.value}</span> : item.value}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
