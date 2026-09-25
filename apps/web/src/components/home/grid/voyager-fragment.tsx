"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import styles from "./voyager-fragment.module.css";
import {
  VOYAGER_BOUNDS,
  VOYAGER_COAST,
  VOYAGER_ISLETS,
  VOYAGER_PLACES,
} from "./voyager-data";

/*
 * Voyager: the interface for a place. A chart of the coast around Vrsar that
 * the visitor drags, with pins for the places a visitor asks about.
 *
 * The view is two numbers, the centre of the cell as a fraction of the chart
 * plane (cx, cy). They live in a ref and reach the DOM as the custom
 * properties --cx and --cy on the root; CSS turns them into one translate on
 * the plane. No React state changes after mount. Pointer moves are coalesced
 * into one requestAnimationFrame while a drag is live; a fling and a jump to
 * a pin are CSS transitions, so nothing runs when the chart is idle,
 * offscreen, or under reduced motion (where the transition is off and a
 * release does not fling).
 */

const [W, S, E, N] = VOYAGER_BOUNDS;
/* The plane in metres: equirectangular at the chart's mid latitude. */
const MW = 15701;
const MH = 13269;

const px = (lon: number) => Math.round(((lon - W) / (E - W)) * MW);
const py = (lat: number) => Math.round(((N - lat) / (N - S)) * MH);

function path(flat: readonly number[], close: boolean) {
  let d = "M";
  for (let i = 0; i < flat.length; i += 2) d += `${px(flat[i])} ${py(flat[i + 1])} `;
  return close ? `${d}Z` : d.trimEnd();
}

const COAST = path(VOYAGER_COAST, false);
/* Close the mainland along the east edge of the box to shade the land. */
const LAND = `${COAST} ${MW} ${MH} ${MW} 0Z`;
const ISLETS = VOYAGER_ISLETS.map((r) => path(r, true)).join("");

/* A graticule every minute of arc. */
let GRAT = "";
for (let m = Math.ceil(W * 60); m <= E * 60; m++) GRAT += `M${px(m / 60)} 0V${MH}`;
for (let m = Math.ceil(S * 60); m <= N * 60; m++) GRAT += `M0 ${py(m / 60)}H${MW}`;

const PINS = VOYAGER_PLACES.map(([key, lon, lat]) => ({
  key,
  fx: (lon - W) / (E - W),
  fy: (N - lat) / (N - S),
}));
const HOME = PINS[0];

function nearest(cx: number, cy: number) {
  let best = 0;
  let bd = Infinity;
  PINS.forEach((p, i) => {
    const d = ((p.fx - cx) * MW) ** 2 + ((p.fy - cy) * MH) ** 2;
    if (d < bd) {
      bd = d;
      best = i;
    }
  });
  return best;
}

const readout = (cx: number, cy: number) =>
  `${(N - cy * (N - S)).toFixed(4)}° N  ${(W + cx * (E - W)).toFixed(4)}° E`;

export function VoyagerFragment({ slug }: { slug: string }) {
  const t = useTranslations("HomeGrid.voyager");
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const pinRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const view = useRef({ cx: HOME.fx, cy: HOME.fy, near: 0 });
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    cx: number;
    cy: number;
    live: boolean;
    vx: number;
    vy: number;
    t: number;
    lx: number;
    ly: number;
    raf: number;
  } | null>(null);

  /* Apply a centre: clamp it so the plane always covers the cell, write the
     two properties, the readout and the nearest pin. Returns the pin index. */
  const apply = (cx: number, cy: number, announce = false) => {
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!root || !plane) return;
    const hx = root.clientWidth / 2 / plane.offsetWidth;
    const hy = root.clientHeight / 2 / plane.offsetHeight;
    const v = view.current;
    v.cx = Math.min(Math.max(cx, hx), 1 - hx);
    v.cy = Math.min(Math.max(cy, hy), 1 - hy);
    root.style.setProperty("--cx", v.cx.toFixed(5));
    root.style.setProperty("--cy", v.cy.toFixed(5));
    if (readRef.current) {
      readRef.current.textContent = readout(v.cx, v.cy);
    }
    const n = nearest(v.cx, v.cy);
    if (n !== v.near) {
      pinRefs.current[v.near]?.removeAttribute("data-near");
      pinRefs.current[n]?.setAttribute("data-near", "");
      v.near = n;
    }
    if (announce && liveRef.current) {
      liveRef.current.textContent = t(`places.${PINS[n].key}`);
    }
  };

  /* Clamp the first view to the measured cell. */
  useEffect(() => {
    const v = view.current;
    apply(v.cx, v.cy);
    return () => {
      const d = drag.current;
      if (d) cancelAnimationFrame(d.raf);
    };
    // Mount only: `apply` reads refs, so a fresh closure changes nothing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const v = view.current;
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      cx: v.cx,
      cy: v.cy,
      live: false,
      vx: 0,
      vy: 0,
      t: e.timeStamp,
      lx: e.clientX,
      ly: e.clientY,
      raf: 0,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!d || d.id !== e.pointerId || !root || !plane) return;
    if (!d.live) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) return;
      d.live = true;
      root.setPointerCapture(e.pointerId);
      root.setAttribute("data-drag", "");
      root.setAttribute("data-touched", "");
      root.removeAttribute("data-fling");
    }
    const dt = Math.max(e.timeStamp - d.t, 1);
    const k = 0.8;
    d.vx = k * ((e.clientX - d.lx) / dt) + (1 - k) * d.vx;
    d.vy = k * ((e.clientY - d.ly) / dt) + (1 - k) * d.vy;
    d.t = e.timeStamp;
    d.lx = e.clientX;
    d.ly = e.clientY;
    if (d.raf) return;
    d.raf = requestAnimationFrame(() => {
      d.raf = 0;
      apply(
        d.cx - (d.lx - d.x) / plane.offsetWidth,
        d.cy - (d.ly - d.y) / plane.offsetHeight,
      );
    });
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!d || d.id !== e.pointerId || !root || !plane) return;
    drag.current = null;
    if (!d.live) return;
    cancelAnimationFrame(d.raf);
    root.removeAttribute("data-drag");
    let x = d.lx;
    let y = d.ly;
    /* A release still in motion carries on for a short, eased distance. */
    if (e.type === "pointerup" && e.timeStamp - d.t < 80 && !reduced()) {
      x += d.vx * 180;
      y += d.vy * 180;
      root.setAttribute("data-fling", "");
    }
    apply(d.cx - (x - d.x) / plane.offsetWidth, d.cy - (y - d.y) / plane.offsetHeight);
  };

  const go = (i: number) => {
    const root = rootRef.current;
    root?.removeAttribute("data-fling");
    root?.setAttribute("data-touched", "");
    apply(PINS[i].fx, PINS[i].fy, true);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!root || !plane || e.target !== root) return;
    const v = view.current;
    const step = (e.shiftKey ? 0.5 : 0.18) * Math.min(root.clientWidth, root.clientHeight);
    const sx = step / plane.offsetWidth;
    const sy = step / plane.offsetHeight;
    let cx = v.cx;
    let cy = v.cy;
    switch (e.key) {
      case "ArrowLeft":
        cx -= sx;
        break;
      case "ArrowRight":
        cx += sx;
        break;
      case "ArrowUp":
        cy -= sy;
        break;
      case "ArrowDown":
        cy += sy;
        break;
      case "Home":
        e.preventDefault();
        go(0);
        return;
      case "Enter":
      case " ": {
        e.preventDefault();
        /* The next place after the one nearest the centre, or that one if
           the view is not on it yet. */
        const p = PINS[v.near];
        const on = Math.abs(p.fx - v.cx) < 1e-3 && Math.abs(p.fy - v.cy) < 1e-3;
        go(on ? (v.near + 1) % PINS.length : v.near);
        return;
      }
      default:
        return;
    }
    e.preventDefault();
    root.removeAttribute("data-fling");
    root.setAttribute("data-touched", "");
    apply(cx, cy, true);
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.root} h-full w-full`}
      data-fragment={slug}
      role="application"
      aria-roledescription="map"
      aria-label={t("chartLabel")}
      aria-describedby={`${slug}-vy-keys`}
      tabIndex={0}
      style={{ "--cx": HOME.fx.toFixed(5), "--cy": HOME.fy.toFixed(5) } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div ref={planeRef} className={styles.plane}>
        <svg
          className={styles.chart}
          viewBox={`0 0 ${MW} ${MH}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <pattern
              id="vy-stipple"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(15)"
            >
              <circle className={styles.dot} cx="32" cy="32" r="10" />
            </pattern>
          </defs>
          <path className={styles.grat} d={GRAT} />
          <path className={styles.tint} d={LAND + ISLETS} fillRule="evenodd" />
          <path className={styles.land} d={LAND + ISLETS} fillRule="evenodd" />
          <path className={styles.coast} d={COAST + ISLETS} />
        </svg>
        {PINS.map((p, i) => (
          <button
            key={p.key}
            ref={(el) => {
              pinRefs.current[i] = el;
            }}
            type="button"
            tabIndex={-1}
            className={styles.pin}
            style={{ left: `${p.fx * 100}%`, top: `${p.fy * 100}%` }}
            data-near={i === 0 ? "" : undefined}
            onClick={() => go(i)}
          >
            <span className={styles.mark} aria-hidden="true" />
            <span className={`${styles.name} type-caption`}>{t(`places.${p.key}`)}</span>
          </button>
        ))}
      </div>

      <span className={styles.reticle} aria-hidden="true" />

      <div className={styles.legend}>
        <span ref={readRef} className="type-meta type-data whitespace-pre" aria-hidden="true">
          {readout(HOME.fx, HOME.fy)}
        </span>
        <span className={styles.scale} aria-hidden="true">
          <span className="type-meta type-data normal-case">1 km</span>
          <span className={styles.bar} />
        </span>
        <span className={`${styles.hint} type-caption`} aria-hidden="true">
          {t("hint")}
        </span>
      </div>

      <p className={`${styles.credit} type-caption`}>{t("credit")}</p>

      <span id={`${slug}-vy-keys`} className={styles.sr}>
        {t("hint")} {t("keys")}
      </span>
      <span ref={liveRef} className={styles.sr} aria-live="polite" />
    </div>
  );
}
