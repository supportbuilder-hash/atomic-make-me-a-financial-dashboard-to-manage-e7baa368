"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { Home, FileText, Activity, Star, Lock, ArrowUpDown, AlertTriangle, Check, Save, type LucideIcon } from 'lucide-react';

type CategoryId = "rent" | "groceries" | "gym" | "dineIn" | "savings" | "travelFuel";

type BudgetRow = { id: CategoryId; label: string; limit: number; spent: number };

const CATEGORY_ORDER: CategoryId[] = ["rent", "groceries", "gym", "dineIn", "savings", "travelFuel"];

const DEFAULT_CATEGORY: CategoryId = "rent";

const INITIAL_BUDGETS: Record<CategoryId, { limit: number; spent: number }> = {
  rent: { limit: 1500, spent: 1500 },
  groceries: { limit: 450, spent: 380 },
  gym: { limit: 60, spent: 60 },
  dineIn: { limit: 250, spent: 310 },
  savings: { limit: 600, spent: 600 },
  travelFuel: { limit: 200, spent: 145 },
};

const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  rent: Home,
  groceries: FileText,
  gym: Activity,
  dineIn: Star,
  savings: Lock,
  travelFuel: ArrowUpDown,
};

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatCard({ label, value, warning }: { label: string; value: string; warning?: string }) {
  return (
    <div className="glass rounded-lg p-5">
      <p className="text-sm text-foreground/70">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
        {warning && (
          <span className="flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {warning}
          </span>
        )}
      </div>
    </div>
  );
}

type BudgetCardProps = {
  label: string;
  limit: number;
  spent: number;
  icon: LucideIcon;
  overLabel: string;
  usedLabel: string;
  leftLabel: string;
  overAmountLabel: string;
};

function BudgetCard({
  label,
  limit,
  spent,
  icon: Icon,
  overLabel,
  usedLabel,
  leftLabel,
  overAmountLabel,
}: BudgetCardProps) {
  const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const over = spent > limit;
  const remaining = limit - spent;
  return (
    <div className="surface-elevated rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-base font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">
              {formatUSD(spent)} / {formatUSD(limit)}
            </p>
          </div>
        </div>
        {over && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {overLabel}
          </span>
        )}
      </div>
      <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", over ? "bg-foreground" : "bg-primary")}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {pct}% {usedLabel}
        </span>
        <span className={cn(remaining < 0 && "font-semibold text-foreground")}>
          {remaining >= 0
            ? `${formatUSD(remaining)} ${leftLabel}`
            : `${formatUSD(Math.abs(remaining))} ${overAmountLabel}`}
        </span>
      </div>
    </div>
  );
}

function ComparisonBar({
  label,
  budget,
  actual,
  maxValue,
  budgetLabel,
  actualLabel,
}: {
  label: string;
  budget: number;
  actual: number;
  maxValue: number;
  budgetLabel: string;
  actualLabel: string;
}) {
  const budgetPct = maxValue > 0 ? Math.min(100, (budget / maxValue) * 100) : 0;
  const actualPct = maxValue > 0 ? Math.min(100, (actual / maxValue) * 100) : 0;
  const over = actual > budget;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">
          {formatUSD(actual)} / {formatUSD(budget)}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">{budgetLabel}</span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-muted-foreground/50"
              initial={{ width: 0 }}
              whileInView={{ width: `${budgetPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">{actualLabel}</span>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn("h-full rounded-full", over ? "bg-foreground" : "bg-primary")}
              initial={{ width: 0 }}
              whileInView={{ width: `${actualPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BudgetsPage() {
  const t = useTranslations();
  const categoryLabels = Array.isArray(t.raw("budgets.categoryLabels"))
    ? (t.raw("budgets.categoryLabels") as string[])
    : [];

  const [budgets, setBudgets] = useState<BudgetRow[]>(() =>
    CATEGORY_ORDER.map((id, i) => ({
      id,
      label: categoryLabels[i] ?? id,
      limit: INITIAL_BUDGETS[id].limit,
      spent: INITIAL_BUDGETS[id].spent,
    })),
  );

  const [selectedId, setSelectedId] = useState<CategoryId>(DEFAULT_CATEGORY);
  const [limitInput, setLimitInput] = useState<string>(String(INITIAL_BUDGETS[DEFAULT_CATEGORY].limit));
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleCategoryChange = (id: CategoryId) => {
    setSelectedId(id);
    const row = budgets.find((b) => b.id === id);
    setLimitInput(row ? String(row.limit) : "");
    setSavedMessage(null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = Number(limitInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    const target = budgets.find((b) => b.id === selectedId);
    setBudgets((prev) => prev.map((b) => (b.id === selectedId ? { ...b, limit: parsed } : b)));
    setSavedMessage(target?.label ?? selectedId);
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const maxValue = budgets.reduce((max, b) => Math.max(max, b.limit, b.spent), 0);

  return (
    <main className="bg-background">
      <Reveal>
        <section className="relative overflow-hidden border-b border-border bg-mesh px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("budgets.hero.eyebrow")}
            </span>
            <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t("budgets.hero.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("budgets.hero.subtitle")}
            </p>
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label={t("budgets.stats.totalBudget")} value={formatUSD(totalBudget)} />
              <StatCard label={t("budgets.stats.totalSpent")} value={formatUSD(totalSpent)} />
              <StatCard
                label={t("budgets.stats.remaining")}
                value={formatUSD(remaining)}
                warning={remaining < 0 ? t("budgets.stats.overLabel") : undefined}
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section id="categories" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {t("budgets.grid.title")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{t("budgets.grid.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {budgets.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.06}>
                <BudgetCard
                  label={b.label}
                  limit={b.limit}
                  spent={b.spent}
                  icon={CATEGORY_ICONS[b.id]}
                  overLabel={t("budgets.card.overBudget")}
                  usedLabel={t("budgets.card.used")}
                  leftLabel={t("budgets.card.left")}
                  overAmountLabel={t("budgets.card.overAmount")}
                />
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section id="manage" className="border-t border-border bg-muted/40 px-6 py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-8 shadow-glow">
              <h2 className="font-display text-2xl font-semibold text-foreground">{t("budgets.form.title")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("budgets.form.subtitle")}</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-foreground">
                    {t("budgets.form.categoryLabel")}
                  </label>
                  <select
                    id="category"
                    value={selectedId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => handleCategoryChange(e.target.value as CategoryId)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {budgets.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="limit" className="mb-1.5 block text-sm font-medium text-foreground">
                    {t("budgets.form.limitLabel")}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <input
                      id="limit"
                      type="number"
                      min={1}
                      step={1}
                      value={limitInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setLimitInput(e.target.value)}
                      required
                      className="w-full rounded-lg border border-border bg-background py-2 pl-7 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {t("budgets.form.submit")}
                </button>
                {savedMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                    {t("budgets.form.success", { category: savedMessage })}
                  </motion.p>
                )}
              </form>
            </div>

            <div className="rounded-lg border border-border bg-card p-8 shadow-glow">
              <h2 className="font-display text-2xl font-semibold text-foreground">{t("budgets.chart.title")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("budgets.chart.subtitle")}</p>
              <div className="mt-6 space-y-6">
                {budgets.map((b) => (
                  <ComparisonBar
                    key={b.id}
                    label={b.label}
                    budget={b.limit}
                    actual={b.spent}
                    maxValue={maxValue}
                    budgetLabel={t("budgets.chart.budgetLabel")}
                    actualLabel={t("budgets.chart.actualLabel")}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
