// FIXED FILE — do not edit. Call-to-action block; all copy comes in via props.
import { BlockImg, CtaButton, Section, type BlockImage, type CtaLink } from "@/components/blocks/shared";
import { cn } from "@/lib/utils";

export interface CTAProps {
  id?: string;
  title: string;
  subtitle?: string;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink;
  image?: BlockImage;
  /** banner: full-width primary band | card: rounded card on the page | split: text left, image right
   *  | gradient: premium — glowing brand-gradient panel with a glass secondary button */
  variant?: "banner" | "card" | "split" | "gradient";
}

export default function CTA({ id, title, subtitle, primaryCta, secondaryCta, image, variant = "banner" }: CTAProps) {
  const gradient = variant === "gradient";
  const banner = variant === "banner" || gradient;
  const split = variant === "split" ? image : undefined;
  const body = (
    <div className={cn(!split && "mx-auto max-w-2xl text-center")}>
      <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className={cn("mt-4 text-lg", banner ? "text-primary-foreground/80" : "text-muted-foreground")}>{subtitle}</p>}
      <div className={cn("mt-8 flex flex-wrap gap-4", !split && "justify-center")}>
        <CtaButton cta={primaryCta} variant={banner ? "secondary" : "default"} />
        {secondaryCta && <CtaButton cta={secondaryCta} variant="outline" className={cn(gradient && "glass-strong text-foreground")} />}
      </div>
    </div>
  );

  if (gradient) {
    return (
      <Section id={id}>
        <div className="bg-gradient-brand relative bg-primary overflow-hidden rounded-3xl px-6 py-16 text-primary-foreground shadow-glow md:px-16 md:py-20">
          {body}
        </div>
      </Section>
    );
  }
  if (banner) {
    return (
      <Section id={id} className="bg-gradient-brand bg-primary text-primary-foreground">
        {body}
      </Section>
    );
  }
  return (
    <Section id={id}>
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-10 text-card-foreground shadow-sm md:p-16">
        {split ? (
          <div className="grid items-center gap-10 md:grid-cols-2">
            {body}
            <BlockImg image={split} className="aspect-[4/3] w-full rounded-lg" />
          </div>
        ) : (
          body
        )}
      </div>
    </Section>
  );
}
