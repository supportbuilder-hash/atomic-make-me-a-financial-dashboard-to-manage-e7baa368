// FIXED FILE — do not edit. Typed re-exports of content/site.json, the ONLY
// per-site data file (navigation, brand, CTA, footer, socials, variants).
// To change navigation, edit content/site.json and messages/<locale>.json.
import site from "@/content/site.json";

export type NavLink = { key: string; href: string };
export type FooterColumn = { key: string; links: NavLink[] };
export type SocialLink = { platform: string; href: string };
export type Brand = { name: string; tagline: string; logoUrl: string | null };
export type NavbarVariant = "split" | "centered" | "minimal";
export type FooterVariant = "columns" | "simple";
export type MotionConfig = { intensity: number };

const NAVBAR_VARIANTS: readonly string[] = ["split", "centered", "minimal"];
const FOOTER_VARIANTS: readonly string[] = ["columns", "simple"];

export const BRAND: Brand = {
  name: site.brand.name,
  tagline: site.brand.tagline,
  logoUrl: site.brand.logoUrl ?? null,
};
export const navLinks: NavLink[] = site.navLinks;
export const primaryCta: NavLink = site.primaryCta;
export const footerColumns: FooterColumn[] = site.footerColumns;
export const socialLinks: SocialLink[] = site.socialLinks;
export const MOTION: MotionConfig = { intensity: Math.min(10, Math.max(1, Number(site.motion.intensity) || 5)) };
export const NAVBAR_VARIANT: NavbarVariant = NAVBAR_VARIANTS.includes(site.navbarVariant)
  ? (site.navbarVariant as NavbarVariant)
  : "split";
export const FOOTER_VARIANT: FooterVariant = FOOTER_VARIANTS.includes(site.footerVariant)
  ? (site.footerVariant as FooterVariant)
  : "columns";
