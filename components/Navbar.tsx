"use client";

// FIXED FILE — do not edit. Data-driven from content/site.json via @/lib/data;
// labels come from messages/<locale>.json ("nav.<key>", "cta.<key>").
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import SiteLink from "@/components/SiteLink";
import { BRAND, NAVBAR_VARIANT, navLinks, primaryCta } from "@/lib/data";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <SiteLink href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-foreground">
      {BRAND.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={BRAND.logoUrl} alt={BRAND.name} className="h-8 w-auto" />
      ) : (
        <span>{BRAND.name}</span>
      )}
    </SiteLink>
  );
}

export default function Navbar() {
  // Typed as a plain (key) => string: keys come from site.json, not literals.
  const tNav: (key: string) => string = useTranslations("nav");
  const tCta: (key: string) => string = useTranslations("cta");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const minimal = NAVBAR_VARIANT === "minimal";
  const centered = NAVBAR_VARIANT === "centered";

  const links = navLinks.map((link) => (
    <SiteLink
      key={link.key}
      href={link.href}
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {tNav(link.key)}
    </SiteLink>
  ));

  const renderCta = (onNavigate?: () => void) => (
    <SiteLink
      href={primaryCta.href}
      onNavigate={onNavigate}
      className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {tCta(primaryCta.key)}
    </SiteLink>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center gap-6 px-6 py-4",
          centered ? "flex-col md:gap-3" : "justify-between",
        )}
        aria-label="Main"
      >
        <div className={cn("flex w-full items-center justify-between", !centered && "md:w-auto", centered && "md:justify-center")}>
          <Logo />
          <button
            type="button"
            className={cn("rounded-md p-2 text-foreground hover:bg-muted", !minimal && "md:hidden")}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {!minimal && (
          <div className={cn("hidden items-center gap-8 md:flex", centered && "justify-center")}>
            {links}
            {!centered && renderCta()}
          </div>
        )}
        {centered && <div className="hidden md:block">{renderCta()}</div>}
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn("overflow-hidden border-t border-border bg-background", !minimal && "md:hidden")}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <SiteLink
                  key={link.key}
                  href={link.href}
                  onNavigate={close}
                  className="text-base font-medium text-foreground hover:text-primary"
                >
                  {tNav(link.key)}
                </SiteLink>
              ))}
              <div>{renderCta(close)}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
