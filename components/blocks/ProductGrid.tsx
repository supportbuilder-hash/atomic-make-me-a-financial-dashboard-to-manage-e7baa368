// FIXED FILE — do not edit. Product grid block (ProductCard per item); all copy via props.
import ProductCard, { type ProductCardProps } from "@/components/blocks/ProductCard";
import { Section, SectionHeader } from "@/components/blocks/shared";
import { cn } from "@/lib/utils";

export interface ProductGridProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  products: Omit<ProductCardProps, "variant">[];
  columns?: 2 | 3 | 4;
  /** Card style applied to every product. */
  variant?: ProductCardProps["variant"];
}

const COLS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };

export default function ProductGrid({ id, eyebrow, title, subtitle, products, columns = 3, variant = "default" }: ProductGridProps) {
  return (
    <Section id={id}>
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className={cn("grid gap-6", variant === "compact" ? "md:grid-cols-2" : COLS[columns])}>
        {(products ?? []).map((p, i) => (
          <ProductCard key={i} {...p} variant={variant} />
        ))}
      </div>
    </Section>
  );
}
