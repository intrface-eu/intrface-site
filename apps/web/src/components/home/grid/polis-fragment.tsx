"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import type { FragmentProps } from "@/lib/site/interfaces";
import { PLAN_FRAME, PLAN_ORIGIN, PLAN_SCALE, PLAN_SPOTS, PLAN_STREETS } from "./polis-data";
import { VOYAGER_BOUNDS, VOYAGER_COAST, VOYAGER_ISLETS } from "./voyager-data";
import styles from "./polis-fragment.module.css";

/*
 * Polis: a citizen reports something on a plan of Vrsar, and it becomes a
 * case that an institution moves through received, assigned and resolved.
 * A demonstration on a real place: the plan is OpenStreetMap data (credited
 * under it), the flow is generic, and nothing here is a service of the town.
 *
 * Cases advance on a clock that only runs while the cell is on screen and
 * the tab is visible. React state changes at the two transitions of a case,
 * never per frame; the progress rule is a CSS animation per phase that
 * pauses with the clock.
 */

type Category = "road" | "light" | "waste";

type Case = {
  key: number;
  id: string;
  spot: number;
  category: Category;
  /** Clock time the case was reported, in active milliseconds. */
  born: number;
  state: number;
  /** Wall-clock time each state was reached, for the timeline. */
  at: number[];
};

const CATEGORIES: Category[] = ["road", "light", "waste"];
const STATES = ["received", "assigned", "resolved"] as const;
/** Active milliseconds after the report at which each state is reached. */
const DUE = [0, 2000, 6000];
const KEEP = 12;

/* ---- The plan, in metres east and south of the origin ---- */

const [OX, OY] = PLAN_ORIGIN;
const [KX, KY] = PLAN_SCALE;
const [FX0, FY0, FX1, FY1] = PLAN_FRAME;
const FW = FX1 - FX0;
const FH = FY1 - FY0;

function metres(flat: readonly number[], close: boolean) {
  let d = "M";
  for (let i = 0; i < flat.length; i += 2) {
    d += `${Math.round((flat[i] - OX) * KX)} ${Math.round((OY - flat[i + 1]) * KY)} `;
  }
  return close ? `${d}Z` : d.trimEnd();
}

function polyline(flat: readonly number[]) {
  let d = "M";
  for (let i = 0; i < flat.length; i += 2) d += `${flat[i]} ${flat[i + 1]} `;
  return d.trimEnd();
}

const [, VS, VE, VN] = VOYAGER_BOUNDS;
const COAST = metres(VOYAGER_COAST, false);
const ISLETS = VOYAGER_ISLETS.map((r) => metres(r, true)).join("");
/* Close the mainland along the east edge of the coast data to fill the land. */
const EX = Math.round((VE - OX) * KX);
const LAND = `${COAST} ${EX} ${Math.round((OY - VS) * KY)} ${EX} ${Math.round((OY - VN) * KY)}Z${ISLETS}`;
const STREETS = PLAN_STREETS.map(polyline).join("");

const SPOTS = PLAN_SPOTS.map(([name, x, y]) => ({
  name,
  fx: (x - FX0) / FW,
  fy: (y - FY0) / FH,
}));
/* A name to the right of its spot, unless that runs off the plan. */
const WEST = SPOTS.map((s) => s.fx > 0.55);

const at = (spot: number) =>
  ({ "--x": `${SPOTS[spot].fx * 100}%`, "--y": `${SPOTS[spot].fy * 100}%` }) as CSSProperties;

export function PolisFragment({ expanded }: FragmentProps) {
  const t = useTranslations("HomeGrid.polis");
  const locale = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const spotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const serial = useRef(140);
  /* Active time: what has run so far, and since when it has been running. */
  const clock = useRef<{ run: number; since: number | null }>({ run: 0, since: null });

  const [spot, setSpot] = useState<number | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [active, setActive] = useState(false);
  const [announce, setAnnounce] = useState("");

  const now = () => {
    const c = clock.current;
    return c.run + (c.since === null ? 0 : performance.now() - c.since);
  };

  // The clock runs only while the cell is on screen and the tab is visible.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let inView = false;
    const sync = () => {
      const on = inView && !document.hidden;
      const c = clock.current;
      if (on && c.since === null) c.since = performance.now();
      if (!on && c.since !== null) {
        c.run += performance.now() - c.since;
        c.since = null;
      }
      setActive(on);
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Wake at the next transition of any open case, and only then.
  useEffect(() => {
    if (!active) return;
    let next = Infinity;
    for (const c of cases) if (c.state < 2) next = Math.min(next, c.born + DUE[c.state + 1]);
    if (next === Infinity) return;
    const id = window.setTimeout(
      () => {
        const time = now();
        const wall = Date.now();
        const list = cases.map((c) => {
          let state = c.state;
          while (state < 2 && time >= c.born + DUE[state + 1]) state++;
          if (state === c.state) return c;
          const stamps = c.at.slice();
          for (let s = c.state + 1; s <= state; s++) stamps[s] = wall;
          return { ...c, state, at: stamps };
        });
        setCases(list);
        const [first] = list;
        if (first && first !== cases[0]) {
          setAnnounce(`${t("caseLabel", { id: first.id })}, ${t(`states.${STATES[first.state]}`)}`);
        }
      },
      Math.max(next - now(), 0) + 16,
    );
    return () => window.clearTimeout(id);
    // `now` reads a ref and `t` is stable; the schedule follows the cases and the clock.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, cases]);

  const clockTime = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const report = () => {
    if (spot === null || category === null) return;
    serial.current += 1;
    const id = String(serial.current).padStart(4, "0");
    setCases((list) =>
      [
        { key: serial.current, id, spot, category, born: now(), state: 0, at: [Date.now()] },
        ...list,
      ].slice(0, KEEP),
    );
    setAnnounce(
      `${t("caseLabel", { id })}, ${t(`categories.${category}`)}, ${t("states.received")}`,
    );
  };

  const latest = cases[0];

  // A tap anywhere on the plan picks the nearest spot; the spots handle their own clicks.
  const pickNearest = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("button")) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    let best = 0;
    let bestDistance = Infinity;
    SPOTS.forEach((s, i) => {
      const d = ((s.fx - x) * box.width) ** 2 + ((s.fy - y) * box.height) ** 2;
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    });
    setSpot(best);
  };

  // Arrow keys, Home and End move through the spots like a radio group.
  const onSpotKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = spotRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;
    const last = SPOTS.length - 1;
    const { key } = event;
    const next =
      key === "ArrowRight" || key === "ArrowDown"
        ? current === last
          ? 0
          : current + 1
        : key === "ArrowLeft" || key === "ArrowUp"
          ? current === 0
            ? last
            : current - 1
          : key === "Home"
            ? 0
            : key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setSpot(next);
    spotRefs.current[next]?.focus();
  };

  const caseLabel = (id: string) => {
    const [before, after = ""] = t("caseLabel", { id: "\u0001" }).split("\u0001");
    return (
      <>
        {before}
        <span className="type-data">{id}</span>
        {after}
      </>
    );
  };

  const steps = (c: Case, times: boolean) => (
    <ol className={styles.steps} aria-label={times ? t("timeline") : undefined}>
      {STATES.map((name, i) => (
        <li
          key={name}
          className={`${styles.step} type-meta`}
          data-s={i < c.state || c.state === 2 ? "done" : i === c.state ? "now" : "next"}
          aria-current={i === c.state ? "step" : undefined}
        >
          <span className={styles.stepName}>{t(`states.${name}`)}</span>
          {times ? (
            <span className={`${styles.stepAt} type-data`}>
              {c.at[i] ? clockTime.format(c.at[i]) : "—"}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );

  const tabStop = spot ?? 0;

  return (
    <div
      ref={rootRef}
      className={`${styles.root} h-full w-full`}
      data-expanded={expanded ? "" : undefined}
      data-paused={active ? undefined : ""}
    >
      <div className={styles.layout}>
        <p className={styles.planHead} aria-hidden="true">
          {spot === null ? (
            <span className="type-meta">{t("mapLabel")}</span>
          ) : (
            <span className={`${styles.spotName} type-caption`}>{SPOTS[spot].name}</span>
          )}
        </p>

        <div className={styles.plan} onClick={pickNearest}>
          <div className={styles.frame}>
            <svg
              className={styles.planSvg}
              viewBox={`${FX0} ${FY0} ${FW} ${FH}`}
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path className={styles.land} d={LAND} fillRule="evenodd" />
              <path className={styles.streets} d={STREETS} />
              <path className={styles.coast} d={COAST + ISLETS} />
            </svg>

            {cases.map((c) => (
              <span
                key={c.key}
                className={styles.pin}
                style={at(c.spot)}
                data-resolved={c.state === 2 ? "" : undefined}
                aria-hidden="true"
              />
            ))}

            <div role="radiogroup" aria-label={t("mapLabel")} onKeyDown={onSpotKey}>
              {SPOTS.map((s, i) => (
                <button
                  key={s.name}
                  ref={(el) => {
                    spotRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={spot === i}
                  aria-label={s.name}
                  tabIndex={i === tabStop ? 0 : -1}
                  className={styles.spot}
                  data-west={WEST[i] ? "" : undefined}
                  style={at(i)}
                  onClick={() => setSpot(i)}
                >
                  <span className={`${styles.spotLabel} type-caption`} aria-hidden="true">
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className={`${styles.credit} type-caption`}>{t("credit")}</p>

        <div className={styles.side}>
          <div className={styles.controls}>
            <div className={styles.toggles} role="group" aria-label={t("categoryLabel")}>
              {CATEGORIES.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={category === key}
                  className={`${styles.toggle} type-caption`}
                  onClick={() => setCategory(key)}
                >
                  {t(`categories.${key}`)}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={`${styles.report} type-caption`}
              disabled={spot === null || category === null}
              onClick={report}
            >
              {t("report")}
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {expanded && latest ? (
            <section className={styles.detail} aria-label={t("caseLabel", { id: latest.id })}>
              <p className={`${styles.detailHead} type-title`}>{caseLabel(latest.id)}</p>
              <p className={`${styles.detailMeta} type-caption`}>
                {t(`categories.${latest.category}`)} · {SPOTS[latest.spot].name}
              </p>
              {steps(latest, true)}
            </section>
          ) : null}

          <div className={styles.ledger}>
            {expanded ? (
              <p className={`${styles.ledgerHead} type-meta`}>{t("casesLabel")}</p>
            ) : null}
            {cases.length === 0 ? (
              <p className={`${styles.empty} type-caption`}>{t("empty")}</p>
            ) : (
              <ol className={styles.list} aria-label={t("casesLabel")}>
                {cases.map((c) => (
                  <li key={c.key} className={styles.case} data-s={c.state}>
                    <p className={styles.caseHead}>
                      <span className={`${styles.caseLabel} type-caption`}>{caseLabel(c.id)}</span>
                      <span className={`${styles.caseWhere} type-caption`}>
                        {t(`categories.${c.category}`)} · {SPOTS[c.spot].name}
                      </span>
                    </p>
                    {steps(c, false)}
                    <span className={styles.progress} aria-hidden="true">
                      <span className={styles.fill} />
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
