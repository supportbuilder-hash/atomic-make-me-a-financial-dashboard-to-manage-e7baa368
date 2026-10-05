// FIXED FILE — do not edit. Product card block; all copy comes in via props.
import { BlockImg, type BlockImage } from "@/components/blocks/shared";
import SiteLink from "@/components/SiteLink";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  name: string;
  /** Pre-formatted price string, e.g. "$49" or "49 €". */
  price: string;
  description?: string;
  image?: BlockImage;
  badge?: string;
  href?: string;
  ctaLabel?: string;
  /** default: image on top | compact: small image left | overlay: text over the image */
  variant?: "default" | "compact" | "overlay";
}

export default function ProductCard({ name, price, description, image, badge, href, ctaLabel, variant = "default" }: ProductCardProps) {
  const cta = href && ctaLabel && (
    <SiteLink href={href} className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
      {ctaLabel}
    </SiteLink>
  );

  if (variant === "overlay" && image) {
    return (
      <div className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
        <BlockImg image={image} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-background/90 p-4 text-foreground backdrop-blur">
          {badge && <Badge className="mb-2">{badge}</Badge>}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display font-semibold">{name}</h3>
            <span className="font-semibold text-primary">{price}</span>
          </div>
          {cta}
        </div>
      </div>
    );
  }

  const compact = variant === "compact";
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
        compact && "flex items-center gap-4 p-3",
      )}
    >
      {image && (
        <div className={cn("relative shrink-0 overflow-hidden bg-muted", compact ? "h-20 w-20 rounded-md" : "aspect-square w-full")}>
          <BlockImg image={image} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
          {badge && !compact && <Badge className="absolute left-3 top-3">{badge}</Badge>}
        </div>
      )}
      <div className={cn("min-w-0", !compact && "p-5")}>
        {badge && (compact || !image) && <Badge variant="secondary" className="mb-2">{badge}</Badge>}
        <h3 className="font-display font-semibold">{name}</h3>
        {description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>}
        <p className="mt-2 font-semibold text-primary">{price}</p>
        {cta}
      </div>
    </div>
  );
}
