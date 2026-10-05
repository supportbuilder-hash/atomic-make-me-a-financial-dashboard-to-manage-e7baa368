"use client";

// FIXED FILE — do not edit. One link, rendered by type so it works from ANY page:
//  - "/route"      -> plain Next.js <Link>
//  - "#section"    -> on "/" smooth-scrolls; elsewhere navigates to "/#section"
//  - "https://..." -> external <a> in a new tab
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

export default function SiteLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onNavigate}>
        {children}
      </a>
    );
  }

  if (href.startsWith("#")) {
    const onHome = pathname === "/";
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onNavigate?.();
      if (!onHome) return;
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };
    return (
      <Link href={onHome ? href : "/" + href} className={className} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}
