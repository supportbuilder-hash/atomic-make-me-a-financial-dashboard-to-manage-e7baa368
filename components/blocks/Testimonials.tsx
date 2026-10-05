// FIXED FILE — do not edit. Testimonials block; all copy comes in via props.
import { Quote } from 'lucide-react';
import { Section, SectionHeader } from "@/components/blocks/shared";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type TestimonialItem = { quote: string; name: string; role?: string; avatar?: string };

export interface TestimonialsProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items: TestimonialItem[];
  /** grid: card grid | single: one large featured quote (first item) | masonry: staggered columns
   *  | glass: premium — frosted glass quote cards on a gradient-mesh backdrop */
  variant?: "grid" | "single" | "masonry" | "glass";
}

function Author({ item }: { item: TestimonialItem }) {
  return (
    <figcaption className="mt-6 flex items-center gap-3">
      <Avatar alt={item.name} src={item.avatar} />
      <div>
        <p className="text-sm font-semibold">{item.name}</p>
        {item.role && <p className="text-sm text-muted-foreground">{item.role}</p>}
      </div>
    </figcaption>
  );
}

export default function Testimonials({ id, eyebrow, title, subtitle, items, variant = "grid" }: TestimonialsProps) {
  const list = items ?? [];
  const first = list[0];

  if (variant === "single" && first) {
    return (
      <Section id={id} className="bg-muted/40">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
        <figure className="mx-auto max-w-3xl text-center">
          <Quote aria-hidden="true" className="mx-auto h-10 w-10 text-primary" />
          <blockquote className="mt-6 font-display text-2xl font-medium leading-snug md:text-3xl">{first.quote}</blockquote>
          <div className="flex justify-center">
            <Author item={first} />
          </div>
        </figure>
      </Section>
    );
  }

  const glass = variant === "glass";
  return (
    <Section id={id} className={cn(glass && "bg-mesh")}>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className={cn(variant === "masonry" ? "gap-6 md:columns-2 lg:columns-3" : "grid gap-6 md:grid-cols-2 lg:grid-cols-3")}>
        {list.map((item, i) => (
          <figure
            key={i}
            className={cn(
              glass
                ? "glass rounded-2xl p-7 text-card-foreground transition duration-200 hover:-translate-y-1 hover:shadow-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                : "rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              variant === "masonry" && "mb-6 break-inside-avoid",
            )}
          >
            {glass && <Quote aria-hidden="true" className="mb-4 h-7 w-7 text-primary" />}
            <blockquote className="leading-relaxed text-foreground/90">&ldquo;{item.quote}&rdquo;</blockquote>
            <Author item={item} />
          </figure>
        ))}
      </div>
    </Section>
  );
}
