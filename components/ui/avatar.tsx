// FIXED FILE — do not edit. Avatar: image when `src` is set, else initials of `alt`.
import { cn } from "@/lib/utils";

export interface AvatarProps {
  alt: string;
  src?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base" };

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

export function Avatar({ alt, src, fallback, size = "md", className }: AvatarProps) {
  const box = cn("relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted", SIZES[size], className);
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={cn(box, "object-cover")} />;
  }
  return (
    <span role="img" aria-label={alt} className={cn(box, "items-center justify-center font-semibold text-muted-foreground")}>
      {fallback ?? initials(alt)}
    </span>
  );
}

export default Avatar;
