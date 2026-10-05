// FIXED FILE — do not edit. Hero section block; all copy comes in via props.
import { BlockImg, CtaButton, type BlockImage, type CtaLink } from "@/components/blocks/shared";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export interface HeroProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  image?: BlockImage;
  /** centered: text only, centered | split: text left, image right | background: image behind text
   *  | mesh: premium — colorful gradient-mesh backdrop, gradient headline, image (if any) in a glass frame */
  variant?: "centered" | "split" | "background" | "mesh";
}

export default function Hero({ id, eyebrow, title, subtitle, primaryCta, secondaryCta, image, variant = "centered" }: HeroProps) {
  const mesh = variant === "mesh";
  const split = variant === "split" || mesh ? image : undefined;
  const bg = variant === "background" ? image : undefined;
  const copy = (
    <div className={cn("max-w-3xl", !split && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-4 text-sm font-semibold uppercase tracking-wider text-primary",
            mesh && "glass inline-flex rounded-full px-4 py-1.5 normal-case tracking-normal",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h1 className={cn("font-display text-4xl font-bold tracking-tight md:text-6xl", mesh && "md:text-7xl md:leading-[1.05]")}>
        {mesh ? <span className="text-gradient">{title}</span> : title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">{subtitle}</p>
      )}
      {(primaryCta || secondaryCta) && (
        <div className={cn("mt-10 flex flex-wrap gap-4", !split && "justify-center")}>
          {primaryCta && <CtaButton cta={primaryCta} className={cn(mesh && "shadow-glow")} />}
          {secondaryCta && <CtaButton cta={secondaryCta} variant="outline" className={cn(mesh && "glass")} />}
        </div>
      )}
    </div>
  );

  return (
    <section id={id} className={cn("relative overflow-hidden text-foreground", mesh ? "bg-mesh" : "bg-background")}>
      {bg && (
        <>
          <BlockImg image={bg} eager className="absolute inset-0 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 bg-background/75" />
        </>
      )}
      {mesh && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        </>
      )}
      <Reveal className={cn("relative mx-auto max-w-7xl px-6", bg ? "py-32 md:py-44" : "py-24 md:py-32")}>
        {split ? (
          <div className="grid items-center gap-12 md:grid-cols-2">
            {copy}
            {mesh ? (
              <div className="glass-strong rounded-3xl p-2 motion-safe:animate-float">
                <BlockImg image={split} eager className="aspect-[4/3] w-full rounded-2xl" />
              </div>
            ) : (
              <BlockImg image={split} eager className="aspect-[4/3] w-full rounded-lg shadow-lg" />
            )}
          </div>
        ) : (
          copy
        )}
      </Reveal>
    </section>
  );
}
