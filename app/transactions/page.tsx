"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Search, Plus, Edit, Trash2, X, ArrowLeft, ArrowRight, Save, Activity, ArrowDown, ArrowUpDown, Star } from 'lucide-react';

type CategoryId = "rent" | "groceries" | "gym" | "dineIn" | "savings" | "travel";

type Transaction = {
  id: string;
  date: string;
  category: CategoryId;
  amount: number;
  notes: string;
};

type FormState = {
  date: string;
  category: CategoryId;
  amount: string;
  notes: string;
};

const CATEGORY_IDS: CategoryId[] = ["rent", "groceries", "gym", "dineIn", "savings", "travel"];

const TEMPLATES: { category: CategoryId; notes: string; amount: number }[] = [
  { category: "rent", notes: "Monthly apartment rent", amount: 1450 },
  { category: "groceries", notes: "Weekly grocery run", amount: 86.42 },
  { category: "gym", notes: "Gym membership fee", amount: 45 },
  { category: "dineIn", notes: "Dinner with friends", amount: 62.3 },
  { category: "savings", notes: "Auto-transfer to savings", amount: 300 },
  { category: "travel", notes: "Gas fill-up", amount: 54.75 },
];

function templateAt(i: number): { category: CategoryId; notes: string; amount: number } {
  const found = TEMPLATES[i % TEMPLATES.length];
  return found ?? { category: "rent", notes: "Expense", amount: 50 };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const BASE_DATE = new Date("2024-06-24T00:00:00.000Z").getTime();
const TOTAL_TRANSACTIONS = 24;
const PAGE_SIZE = 6;

const INITIAL_TRANSACTIONS: Transaction[] = Array.from({ length: TOTAL_TRANSACTIONS }, (_, i) => {
  const template = templateAt(i);
  const dayOffset = i * 3 + Math.floor(i / TEMPLATES.length);
  const variation = Math.round((i % 5) * 150) / 100;
  const amount = Math.round((template.amount + variation) * 100) / 100;
  const date = new Date(BASE_DATE - dayOffset * DAY_MS).toISOString().slice(0, 10);
  return {
    id: `tx-${i + 1}`,
    date,
    category: template.category,
    amount,
    notes: template.notes,
  };
});

function formatUSD(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TransactionsPage() {
  const t = useTranslations();
  const categoryLabels = Array.isArray(t.raw("transactions.categories"))
    ? (t.raw("transactions.categories") as string[])
    : [];

  const labelFor = (id: CategoryId): string => {
    const idx = CATEGORY_IDS.indexOf(id);
    return categoryLabels[idx] ?? id;
  };

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const [modalState, setModalState] = useState<{ mode: "add" | "edit"; id: string | null } | null>(null);
  const [form, setForm] = useState<FormState>({ date: "2024-06-24", category: "rent", amount: "", notes: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const hasActiveFilters = query.trim() !== "" || categoryFilter !== "all" || dateFrom !== "" || dateTo !== "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions
      .filter((tx) => (categoryFilter === "all" ? true : tx.category === categoryFilter))
      .filter((tx) => (dateFrom ? tx.date >= dateFrom : true))
      .filter((tx) => (dateTo ? tx.date <= dateTo : true))
      .filter((tx) => (q ? tx.notes.toLowerCase().includes(q) || labelFor(tx.category).toLowerCase().includes(q) : true))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, categoryFilter, dateFrom, dateTo, query, categoryLabels]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totalSpent = filtered.reduce((sum, tx) => sum + tx.amount, 0);
  const avgTransaction = filtered.length ? totalSpent / filtered.length : 0;
  const topCategoryId = useMemo(() => {
    const totals = new Map<CategoryId, number>();
    filtered.forEach((tx) => totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount));
    let top: CategoryId | null = null;
    let max = -Infinity;
    totals.forEach((value, key) => {
      if (value > max) {
        max = value;
        top = key;
      }
    });
    return top;
  }, [filtered]);

  function resetPageAnd<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  const handleCategoryFilter = resetPageAnd<CategoryId | "all">(setCategoryFilter);
  const handleQuery = resetPageAnd<string>(setQuery);
  const handleDateFrom = resetPageAnd<string>(setDateFrom);
  const handleDateTo = resetPageAnd<string>(setDateTo);

  function clearFilters() {
    setQuery("");
    setCategoryFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  function openAddModal() {
    setForm({ date: new Date().toISOString().slice(0, 10), category: "rent", amount: "", notes: "" });
    setFormError(null);
    setModalState({ mode: "add", id: null });
  }

  function openEditModal(tx: Transaction) {
    setForm({ date: tx.date, category: tx.category, amount: String(tx.amount), notes: tx.notes });
    setFormError(null);
    setModalState({ mode: "edit", id: tx.id });
  }

  function closeModal() {
    setModalState(null);
    setFormError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = parseFloat(form.amount);
    if (!form.date || Number.isNaN(amountNum) || amountNum <= 0) {
      setFormError(t("transactions.modal.validationError"));
      return;
    }
    if (modalState?.mode === "edit" && modalState.id) {
      const targetId = modalState.id;
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === targetId
            ? { ...tx, date: form.date, category: form.category, amount: amountNum, notes: form.notes.trim() || tx.notes }
            : tx,
        ),
      );
    } else {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        date: form.date,
        category: form.category,
        amount: amountNum,
        notes: form.notes.trim() || labelFor(form.category),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
    closeModal();
  }

  function confirmDelete() {
    if (deleteTarget) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">{t("transactions.header.eyebrow")}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {t("transactions.header.title")}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                {t("transactions.header.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("transactions.header.addButton")}
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="surface-elevated rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("transactions.stats.totalSpent")}
                </span>
                <ArrowDown className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-gradient">{formatUSD(totalSpent)}</p>
            </div>
            <div className="surface-elevated rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("transactions.stats.transactionCount")}
                </span>
                <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight">{filtered.length}</p>
            </div>
            <div className="surface-elevated rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("transactions.stats.avgTransaction")}
                </span>
                <ArrowUpDown className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight">{formatUSD(avgTransaction)}</p>
            </div>
            <div className="surface-elevated rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("transactions.stats.topCategory")}
                </span>
                <Star className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight">
                {topCategoryId ? labelFor(topCategoryId) : "—"}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="tx-search" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t("transactions.filters.searchLabel")}
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="tx-search"
                    type="text"
                    value={query}
                    onChange={(e) => handleQuery(e.target.value)}
                    placeholder={t("transactions.filters.searchPlaceholder")}
                    className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryFilter("all")}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    categoryFilter === "all"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={categoryFilter === "all"}
                >
                  {t("transactions.filters.categoryAll")}
                </button>
                {CATEGORY_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleCategoryFilter(id)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      categoryFilter === id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground",
                    )}
                    aria-pressed={categoryFilter === id}
                  >
                    {labelFor(id)}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <label htmlFor="tx-date-from" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("transactions.filters.dateFromLabel")}
                  </label>
                  <input
                    id="tx-date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => handleDateFrom(e.target.value)}
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="tx-date-to" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("transactions.filters.dateToLabel")}
                  </label>
                  <input
                    id="tx-date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => handleDateTo(e.target.value)}
                    className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    {t("transactions.filters.clearButton")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="px-5 py-3.5">
                      {t("transactions.table.date")}
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      {t("transactions.table.category")}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      {t("transactions.table.amount")}
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      {t("transactions.table.notes")}
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      {t("transactions.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                        {t("transactions.table.empty")}
                      </td>
                    </tr>
                  )}
                  {paginated.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/60 transition-colors last:border-b-0 hover:bg-muted/40">
                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                        {new Date(`${tx.date}T00:00:00`).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {labelFor(tx.category)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right font-semibold">-{formatUSD(tx.amount)}</td>
                      <td className="px-5 py-4 text-muted-foreground">{tx.notes}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(tx)}
                            aria-label={t("transactions.table.editLabel")}
                            className="rounded-lg border border-border p-2 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Edit className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(tx)}
                            aria-label={t("transactions.table.deleteLabel")}
                            className="rounded-lg border border-border p-2 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {t("transactions.pagination.showing", {
                  from: filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1,
                  to: Math.min(safePage * PAGE_SIZE, filtered.length),
                  total: filtered.length,
                })}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {t("transactions.pagination.previous")}
                </button>
                <span className="px-2 text-sm text-muted-foreground">
                  {t("transactions.pagination.page", { current: safePage, total: totalPages })}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("transactions.pagination.next")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {modalState && (
          <motion.div
            key="entry-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="entry-modal-title"
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-glow"
            >
              <div className="flex items-center justify-between">
                <h2 id="entry-modal-title" className="text-lg font-semibold tracking-tight">
                  {modalState.mode === "add" ? t("transactions.modal.addTitle") : t("transactions.modal.editTitle")}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label={t("transactions.modal.cancel")}
                  className="rounded-lg p-1.5 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="form-date" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("transactions.modal.dateLabel")}
                  </label>
                  <input
                    id="form-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="form-category" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("transactions.modal.categoryLabel")}
                  </label>
                  <select
                    id="form-category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as CategoryId }))}
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {CATEGORY_IDS.map((id) => (
                      <option key={id} value={id}>
                        {labelFor(id)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="form-amount" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("transactions.modal.amountLabel")}
                  </label>
                  <input
                    id="form-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00"
                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="form-notes" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    {t("transactions.modal.notesLabel")}
                  </label>
                  <textarea
                    id="form-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder={t("transactions.modal.notesPlaceholder")}
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {formError && <p className="text-sm text-destructive">{formError}</p>}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t("transactions.modal.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                    {t("transactions.modal.save")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            key="delete-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-glow"
            >
              <h2 id="delete-modal-title" className="text-lg font-semibold tracking-tight">
                {t("transactions.deleteModal.title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("transactions.deleteModal.description", { notes: deleteTarget.notes })}
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {t("transactions.deleteModal.cancel")}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-destructive px-4 text-sm font-semibold text-destructive-foreground transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {t("transactions.deleteModal.confirm")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}