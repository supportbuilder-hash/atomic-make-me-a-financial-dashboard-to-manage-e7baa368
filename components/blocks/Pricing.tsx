// FIXED FILE — do not edit. Pricing block; all copy comes in via props.
import { Check } from 'lucide-react';
import { CtaButton, Section, SectionHeader, type CtaLink } from "@/components/blocks/shared";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PricingPlan = {
  name: string;
  /** Pre-formatted, e.g. "$29". */
  price: string;
  /** e.g. "/month". */
  period?: string;
  description?: string;
  features: string[];
  cta: CtaLink;
  highlighted?: boolean;
  badge?: string;
};

export interface PricingProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  /** cards: side-by-side cards | bordered: joined columns | minimal: plain list rows
   *  | glass: premium — frosted glass tiers on a gradient-mesh backdrop; the highlighted tier gets a glowing gradient border */
  variant?: "cards" | "bordered" | "minimal" | "glass";
}

function Features({ features }: { features: string[] }) {
  return (
    <ul className="mt-6 space-y-3 text-sm">
      {(features ?? []).map((f, i) => (
        <li key={i} className="flex gap-2">
          <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Pricing({ id, eyebrow, title, subtitle, plans, variant = "cards" }: PricingProps) {
  const list = plans ?? [];

  if (variant === "minimal") {
    return (
      <Section id={id}>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <div className="mx-auto max-w-4xl divide-y divide-border border-y border-border">
          {list.map((plan, i) => (
            <div key={i} className="grid items-center gap-6 py-8 md:grid-cols-[1fr_auto_auto]">
              <div>
                <h3 className="font-display text-xl font-semibold">
                  {plan.name} {plan.badge && <Badge className="ml-2 align-middle">{plan.badge}</Badge>}
                </h3>
                {plan.description && <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>}
              </div>
              <p className="text-2xl font-bold">
                {plan.price}
                {plan.period && <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>}
              </p>
              <CtaButton cta={plan.cta} size="default" variant={plan.highlighted ? "default" : "outline"} />
            </div>
          ))}
        </div>
      </Section>
    );
  }

  const bordered = variant === "bordered";
  const glass = variant === "glass";
  return (
    <Section id={id} className={glass ? "bg-mesh" : "bg-muted/40"}>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div
        className={cn(
          "mx-auto grid max-w-6xl md:grid-cols-2 lg:grid-cols-3",
          bordered ? "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card md:divide-x md:divide-y-0" : "gap-6",
        )}
      >
        {list.map((plan, i) => {
          const tier = (
          <div
            key={i}
            className={cn(
              "relative flex flex-col p-8 text-card-foreground",
              glass && (plan.highlighted ? "glass-strong h-full rounded-2xl" : "glass rounded-2xl"),
              glass && "transition duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              !bordered && !glass && "rounded-lg border bg-card shadow-sm",
              !bordered && !glass && (plan.highlighted ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"),
              bordered && plan.highlighted && "bg-primary/5",
            )}
          >
            {plan.badge && <Badge className="absolute right-6 top-6">{plan.badge}</Badge>}
            <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
            {plan.description && <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>}
            <p className="mt-6 text-4xl font-bold tracking-tight">
              {plan.price}
              {plan.period && <span className="text-base font-normal text-muted-foreground">{plan.period}</span>}
            </p>
            <Features features={plan.features} />
            <div className="mt-auto pt-8">
              <CtaButton cta={plan.cta} size="default" variant={plan.highlighted ? "default" : "outline"} className="w-full" />
            </div>
          </div>
          );
          // Gradient border: a 2px brand-gradient frame around the highlighted glass tier.
          return glass && plan.highlighted ? (
            <div key={i} className="rounded-2xl bg-gradient-to-br from-primary via-accent to-primary p-0.5 shadow-glow">
              {tier}
            </div>
          ) : (
            tier
          );
        })}
      </div>
    </Section>
  );
}
