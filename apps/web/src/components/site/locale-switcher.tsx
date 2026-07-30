"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="sr-only">{t("label")}</span>
      <select
        aria-label={t("label")}
        value={locale}
        disabled={isPending}
        onChange={(event) => {
          const nextLocale = event.target.value as AppLocale;

          startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
            router.refresh();
          });
        }}
        /* No `outline-none` here: in Tailwind v4 it sets `--tw-outline-style:
           none`, which `focus-visible:outline` then reads back — the ring
           cancelled itself and this control had no visible focus state. */
        className="rounded-full border border-rule bg-transparent px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:border-ink/25 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:cursor-wait disabled:opacity-70"
      >
        {routing.locales.map((value) => (
          <option key={value} value={value}>
            {value.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
