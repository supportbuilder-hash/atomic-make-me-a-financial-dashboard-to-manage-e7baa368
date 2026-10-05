"use client";

// FIXED FILE — do not edit. Data-driven from content/site.json via @/lib/data;
// labels come from messages/<locale>.json ("footer.*", "nav.<key>").
// Generic icons only: lucide-react removed brand icons (see build_validator._LUCIDE_REMOVED).
import { Briefcase, Camera, Code2, Globe, MessageCircle, Play, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import SiteLink from "@/components/SiteLink";
import { BRAND, FOOTER_VARIANT, footerColumns, navLinks, socialLinks } from "@/lib/data";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  twitter: MessageCircle,
  x: MessageCircle,
  github: Code2,
  linkedin: Briefcase,
  facebook: Globe,
  instagram: Camera,
  youtube: Play,
};

function Socials() {
  if (socialLinks.length === 0) return null;
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((s) => {
        const Icon = SOCIAL_ICONS[s.platform.toLowerCase()] ?? Globe;
        return (
          <a
            key={s.platform + s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.platform}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}

export default function Footer() {
  // Typed as a plain (key) => string: keys come from site.json, not literals.
  const tFooter: (key: string) => string = useTranslations("footer");
  const tNav: (key: string) => string = useTranslations("nav");
  const linkClass = "text-sm text-muted-foreground transition-colors hover:text-foreground";

  if (FOOTER_VARIANT === "simple" || footerColumns.length === 0) {
    return (
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          <span className="font-display text-base font-semibold text-foreground">{BRAND.name}</span>
          <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer">
            {navLinks.map((link) => (
              <SiteLink key={link.key} href={link.href} className={linkClass}>
                {tNav(link.key)}
              </SiteLink>
            ))}
          </nav>
          <Socials />
        </div>
        <p className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          © {BRAND.name}. {tFooter("rights")}
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <span className="font-display text-lg font-semibold">{BRAND.name}</span>
          <p className="max-w-xs text-sm text-muted-foreground">{tFooter("tagline")}</p>
          <Socials />
        </div>
        {footerColumns.map((col) => (
          <div key={col.key} className="space-y-3">
            <h3 className="text-sm font-semibold">{tFooter("columns." + col.key)}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.key}>
                  <SiteLink href={link.href} className={linkClass}>
                    {tFooter("links." + link.key)}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {BRAND.name}. {tFooter("rights")}
      </p>
    </footer>
  );
}
