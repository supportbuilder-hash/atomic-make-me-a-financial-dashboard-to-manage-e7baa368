"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { Settings as SettingsIcon, Save, Calendar, Bell, Download, Check, Circle, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

type SelectOption = { value: string; label: string };
type CategoryItem = { id: string; name: string; description: string; colorIndex: number };
type NotificationItem = { id: string; label: string; description: string };

const COLOR_SWATCHES: { name: string; swatch: string; ring: string }[] = [
  { name: "rose", swatch: "bg-rose-500", ring: "ring-rose-500" },
  { name: "amber", swatch: "bg-amber-500", ring: "ring-amber-500" },
  { name: "emerald", swatch: "bg-emerald-500", ring: "ring-emerald-500" },
  { name: "sky", swatch: "bg-sky-500", ring: "ring-sky-500" },
  { name: "violet", swatch: "bg-violet-500", ring: "ring-violet-500" },
  { name: "orange", swatch: "bg-orange-500", ring: "ring-orange-500" },
];

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] sm:p-8">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-card-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-card-foreground">{children}</label>;
}

function NativeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform duration-300 ease-out",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function SaveButton({ label, savedLabel, saved, onSave }: { label: string; savedLabel: string; saved: boolean; onSave: () => void }) {
  return (
    <button
      type="button"
      onClick={onSave}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
    >
      {saved ? <Check className="h-4 w-4" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
      <span>{saved ? savedLabel : label}</span>
    </button>
  );
}

function useSavedFlag(): [boolean, () => void] {
  const [saved, setSaved] = useState(false);
  const trigger = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return [saved, trigger];
}

export default function SettingsPage() {
  const t = useTranslations();

  const currencyOptions = (Array.isArray(t.raw("settings.general.currencyOptions"))
    ? t.raw("settings.general.currencyOptions")
    : []) as SelectOption[];
  const dateFormatOptions = (Array.isArray(t.raw("settings.general.dateFormatOptions"))
    ? t.raw("settings.general.dateFormatOptions")
    : []) as SelectOption[];
  const themeOptions = (Array.isArray(t.raw("settings.general.themeOptions"))
    ? t.raw("settings.general.themeOptions")
    : []) as SelectOption[];
  const categoryItems = (Array.isArray(t.raw("settings.category.items"))
    ? t.raw("settings.category.items")
    : []) as CategoryItem[];
  const notificationItems = (Array.isArray(t.raw("settings.preferences.notifications.items"))
    ? t.raw("settings.preferences.notifications.items")
    : []) as NotificationItem[];
  const exportFormats = (Array.isArray(t.raw("settings.preferences.export.formats"))
    ? t.raw("settings.preferences.export.formats")
    : []) as SelectOption[];

  const [currency, setCurrency] = useState(currencyOptions[0]?.value ?? "USD");
  const [dateFormat, setDateFormat] = useState(dateFormatOptions[0]?.value ?? "MM/DD/YYYY");
  const [theme, setTheme] = useState(themeOptions[0]?.value ?? "system");
  const [generalSaved, saveGeneral] = useSavedFlag();

  const [categoryColors, setCategoryColors] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    categoryItems.forEach((c) => {
      initial[c.id] = c.colorIndex ?? 0;
    });
    return initial;
  });
  const [categorySaved, saveCategory] = useSavedFlag();

  const [notifications, setNotifications] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    notificationItems.forEach((n, i) => {
      initial[n.id] = i < 2;
    });
    return initial;
  });
  const [exportFormat, setExportFormat] = useState(exportFormats[0]?.value ?? "csv");
  const [autoBackup, setAutoBackup] = useState(true);
  const [preferencesSaved, savePreferences] = useSavedFlag();
  const [exportDone, setExportDone] = useState(false);

  const handleExport = () => {
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2500);
  };

  return (
    <main className="bg-background">
      <Reveal>
        <section className="border-b border-border bg-muted/30 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <SettingsIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {t("settings.header.title")}
                </h1>
                <p className="mt-1 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t("settings.header.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Reveal>
          <SectionCard
            icon={<Calendar className="h-5 w-5" aria-hidden="true" />}
            title={t("settings.general.title")}
            subtitle={t("settings.general.subtitle")}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <FieldLabel>{t("settings.general.currencyLabel")}</FieldLabel>
                <NativeSelect value={currency} onChange={setCurrency} options={currencyOptions} />
              </div>
              <div>
                <FieldLabel>{t("settings.general.dateFormatLabel")}</FieldLabel>
                <NativeSelect value={dateFormat} onChange={setDateFormat} options={dateFormatOptions} />
              </div>
              <div>
                <FieldLabel>{t("settings.general.themeLabel")}</FieldLabel>
                <NativeSelect value={theme} onChange={setTheme} options={themeOptions} />
              </div>
            </div>
            <div className="mt-6">
              <SaveButton
                label={t("settings.general.saveButton")}
                savedLabel={t("settings.general.savedMessage")}
                saved={generalSaved}
                onSave={saveGeneral}
              />
            </div>
          </SectionCard>
        </Reveal>

        <Reveal delay={0.08}>
          <SectionCard
            icon={<Circle className="h-5 w-5" aria-hidden="true" />}
            title={t("settings.category.title")}
            subtitle={t("settings.category.subtitle")}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categoryItems.map((cat) => {
                const activeIndex = categoryColors[cat.id] ?? 0;
                return (
                  <div
                    key={cat.id}
                    className="rounded-xl border border-border bg-background p-4 transition-colors duration-300 ease-out"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "h-3.5 w-3.5 rounded-full",
                          COLOR_SWATCHES[activeIndex % COLOR_SWATCHES.length]?.swatch,
                        )}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-card-foreground">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {COLOR_SWATCHES.map((c, i) => (
                        <button
                          key={c.name}
                          type="button"
                          aria-label={c.name}
                          onClick={() =>
                            setCategoryColors((prev) => ({ ...prev, [cat.id]: i }))
                          }
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            c.swatch,
                            activeIndex === i ? cn("ring-2 ring-offset-2 ring-offset-background", c.ring) : "",
                          )}
                        >
                          {activeIndex === i && <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <SaveButton
                label={t("settings.category.saveButton")}
                savedLabel={t("settings.category.savedMessage")}
                saved={categorySaved}
                onSave={saveCategory}
              />
            </div>
          </SectionCard>
        </Reveal>

        <Reveal delay={0.16}>
          <SectionCard
            icon={<Bell className="h-5 w-5" aria-hidden="true" />}
            title={t("settings.preferences.title")}
            subtitle={t("settings.preferences.subtitle")}
          >
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">
                {t("settings.preferences.notifications.title")}
              </h3>
              <div className="mt-3 divide-y divide-border rounded-xl border border-border">
                {notificationItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <ToggleSwitch
                      checked={notifications[item.id] ?? false}
                      onChange={(v) => setNotifications((prev) => ({ ...prev, [item.id]: v }))}
                      label={item.label}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-card-foreground">
                {t("settings.preferences.export.title")}
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel>{t("settings.preferences.export.formatLabel")}</FieldLabel>
                  <div className="flex gap-2">
                    {exportFormats.map((fmt) => (
                      <button
                        key={fmt.value}
                        type="button"
                        onClick={() => setExportFormat(fmt.value)}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          exportFormat === fmt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:text-card-foreground",
                        )}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      {t("settings.preferences.export.autoBackupLabel")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("settings.preferences.export.autoBackupDescription")}
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={autoBackup}
                    onChange={setAutoBackup}
                    label={t("settings.preferences.export.autoBackupLabel")}
                  />
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-card-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>{t("settings.preferences.export.exportButton")}</span>
                </button>
                {exportDone && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                    {t("settings.preferences.export.successMessage")}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8">
              <SaveButton
                label={t("settings.preferences.saveButton")}
                savedLabel={t("settings.preferences.savedMessage")}
                saved={preferencesSaved}
                onSave={savePreferences}
              />
            </div>
          </SectionCard>
        </Reveal>
      </div>
    </main>
  );
}