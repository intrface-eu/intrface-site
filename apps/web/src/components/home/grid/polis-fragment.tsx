"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useTranslations } from "next-intl";

import styles from "./polis-fragment.module.css";

type Category = "road" | "light" | "waste";

type Case = {
  key: number;
  id: string;
  spot: number;
  category: Category;
  elapsed: number;
};

const CATEGORIES: Category[] = ["road", "light", "waste"];
const STATES = ["received", "assigned", "resolved"] as const;

/** Places a report can be pinned, in percent of the plan box, in reading order. */
const SPOTS = [
  { x: 44, y: 20 },
  { x: 64, y: 20 },
  { x: 14, y: 50 },
  { x: 40, y: 50 },
  { x: 86, y: 50 },
  { x: 12, y: 80 },
  { x: 64, y: 80 },
  { x: 86, y: 80 },
];

/** Hairline blocks of the schematic plan: x, y, width, height in plan percent. */
const BLOCKS = [
  [-2, -2, 30, 40],
  [32, -2, 24, 40],
  [72, -2, 30, 40],
  [-2, 60, 24, 42],
  [26, 60, 30, 42],
  [72, 60, 30, 42],
];

const TICK = 500;
const ASSIGNED_AT = 2000;
const RESOLVED_AT = 6000;
const KEEP = 4;

const stateOf = (elapsed: number) =>
  elapsed >= RESOLVED_AT ? 2 : elapsed >= ASSIGNED_AT ? 1 : 0;

/** Grid reference of a spot: column letter by fifths of the width, row digit by fifths of the height. */
const refOf = (spot: number) =>
  String.fromCharCode(65 + Math.floor(SPOTS[spot].x / 20)) +
  (Math.floor(SPOTS[spot].y / 20) + 1);

const at = (spot: number) =>
  ({ "--x": `${SPOTS[spot].x}%`, "--y": `${SPOTS[spot].y}%` }) as CSSProperties;

export function PolisFragment({ slug }: { slug: string }) {
  const t = useTranslations("HomeGrid.polis");
  const rootRef = useRef<HTMLDivElement>(null);
  const spotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const serial = useRef(140);

  const [spot, setSpot] = useState<number | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [active, setActive] = useState(true);
  const [announce, setAnnounce] = useState("");

  // Cases only move while the cell is on screen and the tab is visible.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let inView = true;
    const sync = () => setActive(inView && !document.hidden);
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

  const pending = cases.some((c) => c.elapsed < RESOLVED_AT);

  useEffect(() => {
    if (!active || !pending) return;
    const id = window.setInterval(() => {
      setCases((list) =>
        list.map((c) =>
          c.elapsed >= RESOLVED_AT ? c : { ...c, elapsed: c.elapsed + TICK },
        ),
      );
    }, TICK);
    return () => window.clearInterval(id);
  }, [active, pending]);

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

  const report = () => {
    if (spot === null || category === null) return;
    serial.current += 1;
    const id = String(serial.current).padStart(4, "0");
    setCases((list) =>
      [{ key: serial.current, id, spot, category, elapsed: 0 }, ...list].slice(0, KEEP),
    );
    setAnnounce(
      `${t("caseLabel", { id })}, ${t(`categories.${category}`)}, ${t("states.received")}`,
    );
  };

  // A tap anywhere on the plan picks the nearest spot; the spots themselves handle their own clicks.
  const pickNearest = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("button")) return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * 100;
    const py = ((event.clientY - box.top) / box.height) * 100;
    let best = 0;
    let bestDistance = Infinity;
    SPOTS.forEach((s, i) => {
      const d = (s.x - px) ** 2 + ((s.y - py) * box.height / box.width) ** 2;
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
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? current === last ? 0 : current + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? current === 0 ? last : current - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setSpot(next);
    spotRefs.current[next]?.focus();
  };

  const tabStop = spot ?? 0;

  return (
    <div ref={rootRef} className={`${styles.root} h-full w-full`} data-fragment={slug}>
      <p className={`${styles.planHead} type-meta`} aria-hidden="true">
        {t("mapLabel")}
        {spot !== null ? <span className={`${styles.ref} type-data`}>{refOf(spot)}</span> : null}
      </p>

      <div className={styles.plan} onClick={pickNearest}>
        <svg
          className={styles.planSvg}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {BLOCKS.map(([x, y, w, h], i) => (
            <rect key={i} className={styles.block} x={x} y={y} width={w} height={h} />
          ))}
          <line className={styles.centre} x1="-2" y1="50" x2="102" y2="50" />
          <line className={styles.centre} x1="64" y1="-2" x2="64" y2="102" />
        </svg>

        {cases.map((c) => (
          <span
            key={c.key}
            className={styles.pin}
            style={at(c.spot)}
            data-resolved={stateOf(c.elapsed) === 2 ? "" : undefined}
            aria-hidden="true"
          />
        ))}

        <div role="radiogroup" aria-label={t("mapLabel")} onKeyDown={onSpotKey}>
          {SPOTS.map((_, i) => (
            <button
              key={i}
              ref={(el) => {
                spotRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={spot === i}
              aria-label={refOf(i)}
              tabIndex={i === tabStop ? 0 : -1}
              className={styles.spot}
              style={at(i)}
              onClick={() => setSpot(i)}
            />
          ))}
        </div>
      </div>

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

      <div className={styles.ledger}>
        {cases.length === 0 ? (
          <p className={`${styles.empty} type-caption`}>{t("empty")}</p>
        ) : (
          <ol className={styles.list}>
            {cases.map((c) => {
              const state = stateOf(c.elapsed);
              return (
                <li
                  key={c.key}
                  className={styles.case}
                  data-resolved={state === 2 ? "" : undefined}
                >
                  <p className={styles.caseHead}>
                    <span className={`${styles.caseLabel} type-caption`}>{caseLabel(c.id)}</span>
                    <span className="type-caption">
                      {t(`categories.${c.category}`)}{" "}
                      <span className="type-data">{refOf(c.spot)}</span>
                    </span>
                  </p>
                  <ol className={styles.steps}>
                    {STATES.map((name, i) => (
                      <li
                        key={name}
                        className={`${styles.step} type-meta`}
                        data-s={i < state || state === 2 ? "done" : i === state ? "now" : "next"}
                        aria-current={i === state ? "step" : undefined}
                      >
                        <span>{t(`states.${name}`)}</span>
                      </li>
                    ))}
                  </ol>
                  <span className={styles.progress} aria-hidden="true">
                    <span
                      className={styles.fill}
                      style={{ transform: `scaleX(${Math.min(c.elapsed / RESOLVED_AT, 1)})` }}
                    />
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
