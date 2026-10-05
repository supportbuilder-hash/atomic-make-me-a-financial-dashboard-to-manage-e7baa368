"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { Home, Square, Activity, Heart, Lock, ArrowUpDown, Circle, ArrowUp, ArrowDown, AlertTriangle, Calendar, ChevronRight, Sparkles, Plus, Info } from 'lucide-react';
type IconType = React.ComponentType<{ className?: string }>;

interface StatItem {
  value: string;
  label: string;
}
interface CategoryItem {
  key: string;
  name: string;
  spent: number;
  budget: number;
}
interface TransactionItem {
  merchant: string;
  categoryKey: string;
  categoryName: string;
  date: string;
  amount: number;
  statusKey: string;
  status: string;
}
interface InsightItem {
  title: string;
  description: string;
}
interface QuickActionItem {
  label: string;
  description: string;
  href: string;
}

const CATEGORY_META: { key: string; icon: IconType }[] = [
  { key: "rent", icon: Home },
  { key: "groceries", icon: Square },
  { key: "gym", icon: Activity },
  { key: "dineIn", icon: Heart },
  { key: "savings", icon: Lock },
  { key: "travel", icon: ArrowUpDown },
];

const INSIGHT_ICONS: IconType[] = [AlertTriangle, Sparkles, Calendar];
const QUICK_ACTION_ICONS: IconType[] = [Plus, ArrowUpDown, Info];
const DAILY_BUDGET_TARGET = 95;

function getCategoryIcon(key: string): IconType {
  return CATEGORY_META.find((c) => c.key === key)?.icon ?? Circle;
}

function formatUSD(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function DashboardOverviewPage() {
  const t = useTranslations();

  const stats = Array.isArray(t.raw("dashboardOverview.stats"))
    ? (t.raw("dashboardOverview.stats") as StatItem[])
    : [];

  const weekdays = Array.isArray(t.raw("dashboardOverview.chart.weekdays"))
    ? (t.raw("dashboardOverview.chart.weekdays") as string[])
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const categories = Array.isArray(t.raw("dashboardOverview.categories.items"))
    ? (t.raw("dashboardOverview.categories.items") as CategoryItem[])
    : [];

  const transactions = Array.isArray(t.raw("dashboardOverview.transactions.items"))
    ? (t.raw("dashboardOverview.transactions.items") as TransactionItem[])
    : [];

  const insights = Array.isArray(t.raw("dashboardOverview.insights.items"))
    ? (t.raw("dashboardOverview.insights.items") as InsightItem[])
    : [];

  const quickActions = Array.isArray(t.raw("dashboardOverview.quickActions.items"))
    ? (t.raw("dashboardOverview.quickActions.items") as QuickActionItem[])
    : [];

  const spendingTrend = weekdays.map((day, i) => ({
    day,
    spending: Math.round(55 + 35 * Math.abs(Math.sin((i + 1) / 2)) + (i >= 5 ? 40 : 0)),
    budget: DAILY_BUDGET_TARGET,
  }));

  const spendingLabel = t("dashboardOverview.chart.spendingLabel");
  const budgetLabel = t("dashboardOverview.chart.budgetLabel");

  const maxSpending = Math.max(...spendingTrend.map((d) => d.spending), DAILY_BUDGET_TARGET, 1);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {t("dashboardOverview.eyebrow")}
            </span>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("dashboardOverview.title")}
            </h1>
            <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              {t("dashboardOverview.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {t("dashboardOverview.period")}
            </span>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("dashboardOverview.addExpense")}
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal delay={0.05} className="mt-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = i === 1 ? ArrowUp : i === 2 ? ArrowDown : i === 3 ? Lock : Home;
            return (
              <div
                key={s.label}
                className="surface-elevated rounded-2xl border border-border bg-card p-5 transition-all duration-300 ease-out"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4 text-2xl font-bold font-display text-foreground sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Chart */}
      <Reveal delay={0.08} className="mt-10">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t("dashboardOverview.chart.title")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("dashboardOverview.chart.subtitle")}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                {spendingLabel}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-muted-foreground" aria-hidden="true" />
                {budgetLabel}
              </span>
            </div>
          </div>
          <div className="mt-6 w-full">
            <div className="flex h-[240px] items-end gap-3 sm:gap-4">
              {spendingTrend.map((d) => {
                const heightPercent = Math.max(4, Math.round((d.spending / maxSpending) * 100));
                const budgetPercent = Math.max(0, Math.round((d.budget / maxSpending) * 100));
                const isOverBudget = d.spending > d.budget;
                return (
                  <div key={d.day} className="group relative flex flex-1 flex-col items-center justify-end gap-2">
                    <div className="relative flex h-full w-full max-w-10 flex-col justify-end overflow-hidden rounded-t-lg bg-muted">
                      <div
                        className="absolute left-0 right-0 border-t border-dashed border-muted-foreground"
                        style={{ bottom: `${budgetPercent}%` }}
                        aria-hidden="true"
                      />
                      <div
                        className={cn("w-full rounded-t-lg transition-all duration-300 ease-out", isOverBudget ? "bg-accent" : "bg-primary")}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{d.day}</span>
                    <div className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-card px-3 py-2 text-xs opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-opacity duration-200 group-hover:opacity-100">
                      <span className="font-medium text-foreground">{spendingLabel}: {formatUSD(d.spending)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Category breakdown */}
      <Reveal delay={0.1} className="mt-10">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {t("dashboardOverview.categories.title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("dashboardOverview.categories.subtitle")}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.key);
              const budget = cat.budget || 1;
              const rawPercent = (cat.spent / budget) * 100;
              const isOver = rawPercent > 100;
              const barWidth = Math.min(100, Math.max(0, rawPercent));
              return (
                <div key={cat.key} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-right">
                      {isOver && <AlertTriangle className="h-3.5 w-3.5 text-accent" aria-hidden="true" />}
                      <span className={cn("text-sm font-semibold", isOver ? "text-foreground" : "text-foreground")}>
                        {formatUSD(cat.spent)}
                      </span>
                      <span className="text-sm text-muted-foreground">/ {formatUSD(cat.budget)}</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", isOver ? "bg-accent" : "bg-primary")}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Transactions */}
      <Reveal delay={0.12} className="mt-10">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {t("dashboardOverview.transactions.title")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("dashboardOverview.transactions.subtitle")}</p>
            </div>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {t("dashboardOverview.transactions.viewAll")}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">{t("dashboardOverview.transactions.headers.merchant")}</th>
                  <th className="p-4 font-medium">{t("dashboardOverview.transactions.headers.category")}</th>
                  <th className="p-4 font-medium">{t("dashboardOverview.transactions.headers.date")}</th>
                  <th className="p-4 font-medium">{t("dashboardOverview.transactions.headers.amount")}</th>
                  <th className="p-4 font-medium">{t("dashboardOverview.transactions.headers.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => {
                  const Icon = getCategoryIcon(tx.categoryKey);
                  const badgeClass =
                    tx.statusKey === "completed"
                      ? "bg-primary/10 text-primary"
                      : tx.statusKey === "pending"
                      ? "bg-muted text-muted-foreground"
                      : "bg-accent text-foreground";
                  return (
                    <tr key={`${tx.merchant}-${tx.date}`}>
                      <td className="p-4 font-medium text-foreground">{tx.merchant}</td>
                      <td className="p-4 text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          {tx.categoryName}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{tx.date}</td>
                      <td className="p-4 font-medium text-foreground">{formatUSD(tx.amount)}</td>
                      <td className="p-4">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", badgeClass)}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Insights & quick actions */}
      <Reveal delay={0.14} className="mt-10">
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {t("dashboardOverview.insights.title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("dashboardOverview.insights.subtitle")}</p>
            <ul className="mt-6 space-y-4">
              {insights.map((item, i) => {
                const Icon = INSIGHT_ICONS[i % INSIGHT_ICONS.length];
                return (
                  <li key={item.title} className="flex gap-3 rounded-xl border border-border bg-background p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-brand p-6 text-primary-foreground lg:col-span-2">
            <h2 className="text-xl font-semibold tracking-tight">{t("dashboardOverview.quickActions.title")}</h2>
            <div className="mt-6 space-y-3">
              {quickActions.map((action, i) => {
                const Icon = QUICK_ACTION_ICONS[i % QUICK_ACTION_ICONS.length];
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="glass-strong flex items-center justify-between gap-3 rounded-xl p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background/20">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{action.label}</p>
                        <p className="mt-0.5 text-xs text-primary-foreground/80">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
}