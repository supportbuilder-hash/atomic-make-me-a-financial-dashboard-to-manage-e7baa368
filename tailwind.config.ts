import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// Every color is a ROLE backed by a CSS variable in app/globals.css (HSL
// triplets, shadcn convention) so the whole site re-themes by editing :root.
const role = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;
const tint = (name: string, alpha: number) => `hsl(var(--${name}) / ${alpha})`;

// Premium surface utilities, built only from the role tokens so every theme
// (light or dark) gets them: glass, glass-strong, bg-mesh, bg-gradient-brand,
// text-gradient, glow, surface-elevated. Shipped as a plugin (not in
// globals.css) so this verbatim file syncs into existing golden projects.
const premium = plugin(({ addComponents }) => {
  const shadow = `0 1px 0 0 ${tint("background", 0.35)} inset, 0 10px 36px -14px ${tint("foreground", 0.22)}`;
  addComponents({
    ".glass": {
      backgroundColor: tint("card", 0.6),
      backdropFilter: "blur(24px) saturate(1.4)",
      WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      border: `1px solid ${tint("foreground", 0.09)}`,
      boxShadow: shadow,
    },
    ".glass-strong": {
      backgroundColor: tint("card", 0.82),
      backdropFilter: "blur(32px) saturate(1.5)",
      WebkitBackdropFilter: "blur(32px) saturate(1.5)",
      border: `1px solid ${tint("foreground", 0.12)}`,
      boxShadow: `0 1px 0 0 ${tint("background", 0.4)} inset, 0 24px 60px -20px ${tint("foreground", 0.3)}`,
    },
    ".bg-mesh": {
      backgroundColor: tint("background", 1),
      backgroundImage: [
        `radial-gradient(at 12% 8%, ${tint("primary", 0.24)} 0px, transparent 50%)`,
        `radial-gradient(at 88% 4%, ${tint("accent", 0.22)} 0px, transparent 45%)`,
        `radial-gradient(at 72% 92%, ${tint("primary", 0.16)} 0px, transparent 50%)`,
        `radial-gradient(at 4% 88%, ${tint("accent", 0.14)} 0px, transparent 45%)`,
      ].join(", "),
    },
    // Primary-dominant band (text in the middle stays on primary, so
    // text-primary-foreground keeps its AA contrast); accent glows at the edges.
    ".bg-gradient-brand": {
      backgroundColor: tint("primary", 1),
      backgroundImage: [
        `radial-gradient(at 0% 0%, ${tint("accent", 0.55)} 0px, transparent 45%)`,
        `radial-gradient(at 100% 100%, ${tint("accent", 0.45)} 0px, transparent 45%)`,
      ].join(", "),
    },
    ".text-gradient": {
      color: tint("primary", 1),
      backgroundImage: `linear-gradient(110deg, ${tint("primary", 1)}, ${tint("accent", 1)})`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    ".glow": { boxShadow: `0 12px 40px -12px ${tint("primary", 0.55)}` },
    ".surface-elevated": {
      backgroundColor: tint("card", 1),
      border: `1px solid ${tint("foreground", 0.07)}`,
      boxShadow: `0 1px 2px ${tint("foreground", 0.05)}, 0 14px 36px -18px ${tint("foreground", 0.22)}`,
      transition: "transform 200ms ease-out, box-shadow 200ms ease-out",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: `0 1px 2px ${tint("foreground", 0.05)}, 0 22px 48px -18px ${tint("primary", 0.35)}`,
      },
      "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
    },
  });
});

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: role("border"),
        input: role("input"),
        ring: role("ring"),
        background: role("background"),
        foreground: role("foreground"),
        primary: { DEFAULT: role("primary"), foreground: role("primary-foreground") },
        secondary: { DEFAULT: role("secondary"), foreground: role("secondary-foreground") },
        accent: { DEFAULT: role("accent"), foreground: role("accent-foreground") },
        muted: { DEFAULT: role("muted"), foreground: role("muted-foreground") },
        card: { DEFAULT: role("card"), foreground: role("card-foreground") },
        popover: { DEFAULT: role("popover"), foreground: role("popover-foreground") },
        destructive: { DEFAULT: role("destructive"), foreground: role("destructive-foreground") },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-serif", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 12px 40px -12px hsl(var(--primary) / 0.55)",
        "glow-accent": "0 12px 40px -12px hsl(var(--accent) / 0.55)",
      },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: { float: "float 6s ease-in-out infinite" },
    },
  },
  plugins: [premium],
};
export default config;
