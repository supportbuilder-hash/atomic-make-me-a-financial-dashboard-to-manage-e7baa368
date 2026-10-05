// FIXED FILE — do not edit. FAQ block (native accordion); all copy comes in via props.
import { Section, SectionHeader } from "@/components/blocks/shared";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type FAQItem = { question: string; answer: string };

export interface FAQProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  /** simple: centered accordion | split: heading left, accordion right | card: accordion on a card */
  variant?: "simple" | "split" | "card";
}

export default function FAQ({ id, eyebrow, title, subtitle, items, variant = "simple" }: FAQProps) {
  const split = variant === "split";
  const accordion = (
    <Accordion className={cn(variant === "card" && "bg-card text-card-foreground shadow-sm")}>
      {(items ?? []).map((item, i) => (
        <AccordionItem key={i}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
  return (
    <Section id={id} className={variant === "card" ? "bg-muted/40" : undefined}>
      {split ? (
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" />
          {accordion}
        </div>
      ) : (
        <div className="mx-auto max-w-3xl">
          <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {accordion}
        </div>
      )}
    </Section>
  );
}
