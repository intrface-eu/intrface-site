"use client";

import { useId, useState, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";

import { NEED, PROGRAMMES, WHO, type FundaLocale, type Need, type Who } from "./funda-data";
import styles from "./funda-fragment.module.css";

const LOCALES: FundaLocale[] = ["en", "de", "fr", "hr"];

export function FundaFragment({ slug }: { slug: string }) {
  const t = useTranslations("HomeGrid.funda");
  const locale = useLocale();
  const uid = useId();
  const lang: FundaLocale = LOCALES.includes(locale as FundaLocale)
    ? (locale as FundaLocale)
    : "en";

  const [who, setWho] = useState<Who | null>(null);
  const [need, setNeed] = useState<Need | null>(null);
  // The month the visitor first picked, so deadlines stay ahead of today.
  const [base, setBase] = useState<{ year: number; month: number } | null>(null);

  const stamp = () =>
    setBase((b) => {
      if (b) return b;
      const now = new Date();
      return { year: now.getFullYear(), month: now.getMonth() };
    });

  const matches =
    who && need ? PROGRAMMES.filter((p) => p.need === need && p.who.includes(who)) : [];
  const monthFormat = new Intl.DateTimeFormat(locale, { month: "2-digit", year: "numeric" });
  const percent = new Intl.NumberFormat(locale, { style: "percent" });

  const group = <K extends string>(
    id: string,
    label: string,
    options: { key: K; label: string }[],
    value: K | null,
    pick: (key: K) => void,
  ) => (
    <div className={styles.group}>
      <p id={id} className={`${styles.groupLabel} type-meta`}>
        {label}
      </p>
      <div className={styles.toggles} role="group" aria-labelledby={id}>
        {options.map(({ key, label: text }) => (
          <button
            key={key}
            type="button"
            aria-pressed={value === key}
            className={`${styles.toggle} type-caption`}
            onClick={() => {
              stamp();
              pick(key);
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${styles.root} h-full w-full`} data-fragment={slug}>
      <div className={styles.picks}>
        {group(
          `${uid}-who`,
          t("whoLabel"),
          WHO.map((key) => ({ key, label: t(`who.${key}`) })),
          who,
          setWho,
        )}
        {group(
          `${uid}-need`,
          t("needLabel"),
          NEED.map((key) => ({ key, label: t(`need.${key}`) })),
          need,
          setNeed,
        )}
      </div>

      <p className={`${styles.status} type-caption`} aria-live="polite">
        {who && need ? t("matches", { count: matches.length }) : t("pickBoth")}
      </p>

      <div className={styles.ledger}>
        {matches.length === 0 ? (
          <div className={styles.empty} aria-hidden="true" />
        ) : (
          <ol className={styles.list}>
            {matches.map((p, i) => {
              const deadline =
                base && new Date(base.year, base.month + p.months, 1);
              return (
                <li
                  key={`${who}-${need}-${p.id}`}
                  className={styles.row}
                  style={{ "--i": i } as CSSProperties}
                >
                  <span className={`${styles.index} type-data`} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className={`${styles.name} type-title`}>{p.name[lang]}</p>
                  <p className={`${styles.terms} type-caption`}>
                    <span>
                      {t("share")} ≤{" "}
                      <span className={`${styles.figure} type-data`}>
                        {percent.format(p.share / 100)}
                      </span>
                    </span>
                    {deadline ? (
                      <span>
                        {t("deadline")}{" "}
                        <span className={`${styles.figure} type-data`}>
                          {monthFormat.format(deadline)}
                        </span>
                      </span>
                    ) : null}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
