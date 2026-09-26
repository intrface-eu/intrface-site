"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { FragmentProps } from "@/lib/site/interfaces";
import {
  EXPERIENCES,
  LABELS,
  LAT,
  LAT_BOTTOM,
  stopName,
  type AmLang,
  type Experience,
  type ExperienceId,
} from "./astyle-marine-data";
import styles from "./astyle-marine-fragment.module.css";

const langOf = (locale: string): AmLang => (locale === "hr" || locale === "de" ? locale : "en");

/**
 * AstyleMarine's own interface, small: the five experiences as the site lists
 * them; choosing one shows its line, its times, guests and price, and its
 * route laid down the coast from Poreč, stop by stop. Only the site's content,
 * in the site's language nearest the visitor's.
 */
export function AstyleMarineFragment({ expanded }: FragmentProps) {
  const t = useTranslations("HomeGrid.astyleMarine");
  const lang = langOf(useLocale());
  const uid = useId();
  const [current, setCurrent] = useState<ExperienceId>("expedition");
  const [variant, setVariant] = useState(0);
  const tabs = useRef<Partial<Record<ExperienceId, HTMLButtonElement | null>>>({});

  const labels = LABELS[lang];
  const exp = EXPERIENCES.find((e) => e.id === current) ?? EXPERIENCES[0];
  const copy = exp.copy[lang];
  const route = copy.routes[Math.min(variant, copy.routes.length - 1)];
  const tabId = (id: ExperienceId) => `${uid}-${id}`;
  const panelId = `${uid}-panel`;

  const choose = (id: ExperienceId) => {
    setCurrent(id);
    setVariant(0);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = EXPERIENCES.findIndex((x) => x.id === current);
    const n = EXPERIENCES.length;
    let next: number;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    const id = EXPERIENCES[next].id;
    choose(id);
    tabs.current[id]?.focus();
  };

  return (
    <div
      className={`${styles.root} h-full w-full`}
      data-fragment="astyle-marine"
      data-expanded={expanded || undefined}
      lang={lang}
    >
      <p className={styles.kicker}>
        <span className={styles.dash} aria-hidden="true" />
        {labels.kicker}
      </p>

      <div
        role="tablist"
        aria-label={t("listLabel")}
        className={styles.list}
      >
        {EXPERIENCES.map((x) => {
          const selected = x.id === current;
          return (
            <button
              key={x.id}
              ref={(el) => {
                tabs.current[x.id] = el;
              }}
              id={tabId(x.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => choose(x.id)}
              onKeyDown={onKey}
            >
              <span className={styles.tabDash} aria-hidden="true" />
              <span className={styles.tabName}>{x.name}</span>
              <span className={styles.tabMeta}>{summary(x, lang)}</span>
            </button>
          );
        })}
      </div>

      <div
        key={`${current}-${lang}`}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(current)}
        className={styles.panel}
        data-route={route ? "" : undefined}
      >
        <p className={styles.line}>{copy.line}</p>

        <dl className={styles.facts}>
          {copy.facts.map((f) => (
            <div key={f.label} className={styles.fact}>
              <dt>{labels[f.label]}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          <div className={styles.fact}>
            <dt>{labels.included}</dt>
            <dd>
              {labels.includes}
              <span
                className={styles.mode}
                data-repeat={repeatsMode(copy) || undefined}
              >
                {copy.mode}
              </span>
            </dd>
          </div>
          <div className={`${styles.fact} ${styles.priceFact}`}>
            <dt>{labels.price}</dt>
            {copy.prices.map((p) => (
              <dd key={p.value} className={styles.price}>
                <span className={styles.priceValue}>{p.value}</span>
                {p.note ? <span className={styles.priceNote}>{p.note}</span> : null}
              </dd>
            ))}
          </div>
        </dl>

        {route && copy.routes.length > 1 ? (
          <div role="group" aria-label={t("routeChoice")} className={styles.variants}>
            {copy.routes.map((r, i) => (
              <button
                key={r.title}
                type="button"
                aria-pressed={i === variant}
                className={styles.variant}
                onClick={() => setVariant(i)}
              >
                <span className={styles.tabDash} aria-hidden="true" />
                {r.title}
              </button>
            ))}
          </div>
        ) : null}

        {route ? (
          <div className={styles.routeBox}>
            <p className={styles.routeHead} aria-hidden="true">
              {labels.route}
            </p>
            <ol
              key={variant}
              className={styles.route}
              aria-label={t("routeLabel", { name: exp.name })}
              style={
                { "--rest": (LAT[route.stops[route.stops.length - 1]] - LAT_BOTTOM) * 1000 } as CSSProperties
              }
            >
              {route.stops.map((id, i) => {
                const last = i === route.stops.length - 1;
                const grow = last ? 0 : LAT[id] - LAT[route.stops[i + 1]];
                return (
                  <li
                    key={id}
                    className={styles.stop}
                    data-end={i === 0 || last || undefined}
                    data-last={last || undefined}
                    style={{ "--g": grow * 1000, "--i": i } as CSSProperties}
                  >
                    {stopName(lang, id)}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}

        {route ? <p className={styles.routeNote}>{labels.routeNote}</p> : null}
      </div>
    </div>
  );
}

/** The short figure beside a name in the list: its duration, else its guests. */
function summary(x: Experience, lang: AmLang) {
  const facts = x.copy[lang].facts;
  return (facts.find((f) => f.label === "duration") ?? facts[0])?.value ?? "";
}

/** True when the prices already say the mode, so a short piece can drop it. */
function repeatsMode(c: Experience["copy"][AmLang]) {
  const mode = c.mode.toLowerCase();
  return c.prices.length > 1 || c.prices.some((p) => p.note?.toLowerCase().startsWith(mode));
}
