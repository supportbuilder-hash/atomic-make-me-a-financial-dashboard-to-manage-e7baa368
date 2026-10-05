"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Home, Square, Activity, Heart, Star, ArrowRight, ChevronDown, Sparkles, Check } from 'lucide-react';
import { Reveal } from "@/components/Reveal";

type CategoryItem = {
  icon: string;
  name: string;
  spent: number;
  budget: number;
  status: string;
};
type MonthPoint = { month: string; amount: number };
type StepItem = { title: string; description: string };
type FaqItem = { question: string; answer: string };

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  rent: Home,
  groceries: Square,
  gym: Activity,
  dinein: Heart,
  savings: Star,
  travel: ArrowRight,
};

function formatUSD(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export default function HomePage() {
  const t = useTranslations();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = (
    Array.isArray(t.raw("home.categories.items")) ? t.raw("home.categories.items") : []
  ) as CategoryItem[];
  const months = (
    Array.isArray(t.raw("home.trend.months")) ? t.raw("home.trend.months") : []
  ) as MonthPoint[];
  const steps = (
    Array.isArray(t.raw("home.steps.items")) ? t.raw("home.steps.items") : []
  ) as StepItem[];
  const faqs = (
    Array.isArray(t.raw("home.faq.items")) ? t.raw("home.faq.items") : []
  ) as FaqItem[];

  const totalSpent = categories.reduce((sum, c) => sum + (c.spent ?? 0), 0);
  const latestMonth = months[months.length - 1];

  return (
    <main className="overflow-x-hidden bg-background text-foreground">
      {/* Hero */}
      <Reveal>
        <section id="overview" className="relative overflow-hidden bg-mesh py-24 md:py-32">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                {t("home.hero.eyebrow")}
              </span>
              <h1 className="mt-6 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">See exactly where your paycheck goes every month...</h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("home.hero.subtitle")}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard-overview" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none">Open dashboard...</Link>
                <Link href="/transactions" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-accent motion-reduce:transition-none">
                  {t("home.hero.secondaryCta")}
                </Link>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-6 shadow-glow sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("home.hero.snapshotTitle")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("home.hero.snapshotSubtitle")}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  USD
                </span>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">{t("home.hero.totalLabel")}</p>
              <p className="mt-1 text-4xl font-bold tracking-tight">{formatUSD(totalSpent)}</p>
              <div className="mt-6 space-y-4">
                {categories.slice(0, 4).map((c, i) => {
                  const Icon = CATEGORY_ICON_MAP[c.icon] ?? Square;
                  const pct = Math.min(100, Math.round((c.spent / (c.budget || 1)) * 100));
                  return (
                    <div key={c.name || i} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate font-medium">{c.name}</span>
                          <span className="text-muted-foreground">{formatUSD(c.spent)}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      {/* Category breakdown */}
      <Reveal>
        <section id="categories" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("home.categories.eyebrow")}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("home.categories.title")}
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("home.categories.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, i) => {
                const Icon = CATEGORY_ICON_MAP[c.icon] ?? Square;
                const pct = Math.min(100, Math.round((c.spent / (c.budget || 1)) * 100));
                const featured = i === 0;
                return (
                  <Reveal key={c.name || i} delay={i * 0.06} className={featured ? "sm:col-span-2 lg:col-span-1" : ""}>
                    <div
                      className={cnFeatured(
                        featured,
                        "flex h-full flex-col justify-between rounded-2xl p-6 transition hover:-translate-y-1 motion-reduce:transition-none"
                      )}>
                      <div>
                        <div className="flex items-center justify-between">
                          <span
                            className={
                              featured
                                ? "flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground"
                                : "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                            }>
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span
                            className={
                              featured
                                ? "rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium text-primary-foreground"
                                : "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                            }>
                            {c.status}
                          </span>
                        </div>
                        <h3 className="mt-5 text-lg font-semibold">{c.name}</h3>
                        <p
                          className={
                            featured
                              ? "mt-1 text-sm text-primary-foreground/80"
                              : "mt-1 text-sm text-muted-foreground"
                          }>
                          {formatUSD(c.spent)} {t("home.categories.of")} {formatUSD(c.budget)}
                        </p>
                      </div>
                      <div
                        className={
                          featured
                            ? "mt-6 h-2 w-full overflow-hidden rounded-full bg-primary-foreground/20"
                            : "mt-6 h-2 w-full overflow-hidden rounded-full bg-muted"
                        }>
                        <div className={featured ? "h-full rounded-full bg-primary-foreground" : "h-full rounded-full bg-primary"} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>
      {/* Trend */}
      <Reveal>
        <section id="trends" className="bg-muted/40 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {t("home.trend.eyebrow")}
                </span>
                <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("home.trend.title")}
                </h2>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {t("home.trend.subtitle")}
                </p>
                <div className="mt-8 surface-elevated inline-flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("home.trend.latestLabel")}
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight">
                      {formatUSD(latestMonth?.amount ?? 0)}
                    </p>
                  </div>
                  <span className="h-10 w-px bg-border" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("home.trend.monthsLabel")}
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight">{months.length}</p>
                  </div>
                </div>
              </div>

              <div className="h-72 rounded-2xl border border-border bg-card p-4 text-primary sm:h-80 sm:p-6">
                <svg viewBox="0 0 300 120" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
                  {(() => {
                    const values = months.map((m) => m.amount ?? 0);
                    const max = Math.max(...values, 1);
                    const min = Math.min(...values, 0);
                    const range = max - min || 1;
                    const stepX = values.length > 1 ? 300 / (values.length - 1) : 0;
                    const points = values.map((v, i) => {
                      const x = i * stepX;
                      const y = 110 - ((v - min) / range) * 100;
                      return `${x},${y}`;
                    });
                    const linePath = `M${points.join(" L")}`;
                    const areaPath = `${linePath} L${(values.length - 1) * stepX},120 L0,120 Z`;
                    return (
                      <>
                        <path d={areaPath} fill="currentColor" opacity={0.15} />
                        <path d={linePath} fill="none" stroke="currentColor" strokeWidth={2} />
                      </>
                    );
                  })()}
                </svg>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  {months.map((m, i) => (
                    <span key={m.month || i}>{m.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
      {/* How it works */}
      <Reveal>
        <section id="how-it-works" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("home.steps.eyebrow")}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {t("home.steps.title")}
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("home.steps.subtitle")}
              </p>
            </div>

            <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
              {steps.map((s, i) => (
                <Reveal key={s.title || i} delay={i * 0.08}>
                  <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-8">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{s.title}</h3>
                      <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
      {/* FAQ */}
      <Reveal>
        <section id="faq" className="bg-muted/40 py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                {t("home.faq.eyebrow")}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to know...</h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                {t("home.faq.subtitle")}
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={f.question || i} className="overflow-hidden rounded-2xl border border-border bg-card">
                    <button type="button" onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium transition hover:bg-accent motion-reduce:transition-none">
                      <span>{f.question}</span>
                      <ChevronDown
                        className={cnRotate(isOpen)}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <p className="px-6 pb-5 text-pretty leading-relaxed text-muted-foreground">
                        {f.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>
      {/* Closing CTA */}
      <Reveal>
        <section id="get-started" className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-gradient-brand p-10 text-center shadow-glow sm:p-14 lg:flex-row lg:text-left">
              <div>
                <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                  {t("home.cta.title")}
                </h2>
                <p className="mt-3 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
                  {t("home.cta.subtitle")}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link href="/dashboard-overview" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none">
                  {t("home.cta.primaryLabel")}
                  <Check className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/transactions" className="glass inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 motion-reduce:transition-none">
                  {t("home.cta.secondaryLabel")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function cnFeatured(featured: boolean, base: string): string {
  return featured
    ? `${base} bg-gradient-brand text-primary-foreground shadow-glow`
    : `${base} surface-elevated border border-border bg-card`;
}

function cnRotate(isOpen: boolean): string {
  return isOpen ? "h-5 w-5 shrink-0 rotate-180 text-primary transition-transform" : "h-5 w-5 shrink-0 text-muted-foreground transition-transform";
}