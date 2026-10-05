// FIXED FILE — do not edit. Every page gets the Navbar + Footer from here;
// brand/metadata come from content/site.json, fonts from lib/fonts.ts.
import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import LanguageToggle from "@/components/LanguageToggle";
import LocaleProvider from "@/components/LocaleProvider";
import Navbar from "@/components/Navbar";
import { BRAND } from "@/lib/data";
import { fontDisplay, fontSans } from "@/lib/fonts";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: BRAND.name,
  description: BRAND.tagline,
  ...(BRAND.logoUrl ? { icons: { icon: BRAND.logoUrl } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body>
        <LocaleProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <LanguageToggle />
        </LocaleProvider>
      </body>
    </html>
  );
}
