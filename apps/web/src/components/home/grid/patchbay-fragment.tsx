"use client";

import { useTranslations } from "next-intl";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { FragmentProps } from "@/lib/site/interfaces";
import styles from "./patchbay-fragment.module.css";

/* A patch board: four outputs, four inputs, one cable per jack. Connection
   state is React state, set on release; the cable under the pointer is one SVG
   path written through a ref inside requestAnimationFrame. */

const OUTS = ["voice", "keys", "drums", "bass"] as const;
const INS = ["mix", "room", "tape", "stream"] as const;
type Jack = (typeof OUTS)[number] | (typeof INS)[number];
const ALL: readonly Jack[] = [...OUTS, ...INS];
const isOut = (j: Jack) => (OUTS as readonly Jack[]).includes(j);

type Link = { id: number; o: Jack; i: Jack; fresh?: boolean };
type Pt = { x: number; y: number };
type Geom = { h: number; c: Partial<Record<Jack, Pt>> };
type Drag = {
  pid: number;
  anchor: Jack;
  lift: Link | null;
  x0: number;
  y0: number;
  x: number;
  y: number;
  moved: boolean;
  raf: number;
  target: Jack | null;
};

/** Pointer travel (px) below which a press is a tap, not a drag. */
const TAP = 6;
/** Distance (board px) at which a dragged cable snaps onto a jack. */
const SNAP = 30;

const r1 = (n: number) => Math.round(n * 10) / 10;
const sagOf = (a: Pt, b: Pt, h: number) =>
  Math.min(10 + Math.hypot(b.x - a.x, b.y - a.y) * 0.3, h * 0.4);

/** A cable from a to b drooping by `k` of its full sag, in board space. */
function curve(a: Pt, b: Pt, h: number, k: number) {
  const dx = (b.x - a.x) / 3;
  const s = sagOf(a, b, h) * k;
  return `M${r1(a.x)} ${r1(a.y)}C${r1(a.x + dx)} ${r1(a.y + s)} ${r1(b.x - dx)} ${r1(b.y + s)} ${r1(b.x)} ${r1(b.y)}`;
}

/** The same hanging curve drawn along its own chord (a at 0,0, b at L,0), so
    a scaleY on the path moves only the sag and never the plugged ends. */
function hung(a: Pt, b: Pt, h: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  const cos = dx / L;
  const sin = dy / L;
  const s = sagOf(a, b, h);
  const loc = (px: number, py: number) =>
    `${r1(px * cos + py * sin)} ${r1(py * cos - px * sin)}`;
  return {
    t: `translate(${r1(a.x)} ${r1(a.y)}) rotate(${r1((Math.atan2(dy, dx) * 180) / Math.PI)})`,
    d: `M0 0C${loc(dx / 3, s)} ${loc((2 * dx) / 3, dy + s)} ${r1(L)} 0`,
  };
}

export function PatchbayFragment({ expanded }: FragmentProps) {
  const t = useTranslations("HomeGrid.patchbay");
  const [links, setLinks] = useState<Link[]>([{ id: 0, o: "voice", i: "tape" }]);
  const [armed, setArmed] = useState<Jack | null>(null);
  const [lifted, setLifted] = useState<number | null>(null);
  const [geom, setGeom] = useState<Geom | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<SVGPathElement>(null);
  const rings = useRef<Partial<Record<Jack, HTMLSpanElement | null>>>({});
  const geomRef = useRef<Geom | null>(null);
  const drag = useRef<Drag | null>(null);
  const nextId = useRef(1);
  /** Set when a drag ends, so the click that follows it is not also a press. */
  const dragged = useRef(false);
  const hintId = useId();
  const outId = useId();
  const inId = useId();

  /* Board rect and its scale against layout size, so a transformed ancestor
     (the cell's expansion) never skews pointer maths. */
  const frameOf = () => {
    const b = boardRef.current;
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { r, k: r.width / (b.offsetWidth || 1) || 1 };
  };

  useLayoutEffect(() => {
    const b = boardRef.current;
    if (!b) return;
    let alive = true;
    const measure = () => {
      const f = frameOf();
      if (!alive || !f) return;
      const c: Geom["c"] = {};
      for (const j of ALL) {
        const q = rings.current[j]?.getBoundingClientRect();
        if (q)
          c[j] = {
            x: (q.left + q.width / 2 - f.r.left) / f.k,
            y: (q.top + q.height / 2 - f.r.top) / f.k,
          };
      }
      geomRef.current = { h: b.offsetHeight, c };
      setGeom(geomRef.current);
    };
    // A ResizeObserver reports once on observe, so this also takes the first measure.
    const ro = new ResizeObserver(measure);
    ro.observe(b);
    document.fonts?.ready.then(measure);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, []);

  useEffect(
    () => () => {
      const d = drag.current;
      if (d?.raf) cancelAnimationFrame(d.raf);
    },
    [],
  );

  const connect = (a: Jack, b: Jack) => {
    const o = isOut(a) ? a : b;
    const i = isOut(a) ? b : a;
    const id = nextId.current++;
    setLinks((ls) => [...ls.filter((l) => l.o !== o && l.i !== i), { id, o, i, fresh: true }]);
  };

  const linkOf = (j: Jack) => links.find((l) => l.o === j || l.i === j) ?? null;

  /* Buttons: press an output, then an input. Pressing a patched jack with
     nothing armed pulls its cable. Taps land here too. */
  const press = (j: Jack, fromPointer: boolean) => {
    const skip = dragged.current && fromPointer;
    dragged.current = false;
    if (skip) return;
    if (armed && isOut(armed) !== isOut(j)) {
      connect(armed, j);
      setArmed(null);
    } else if (armed) {
      setArmed(armed === j ? null : j);
    } else {
      const hit = linkOf(j);
      if (hit) setLinks((ls) => ls.filter((l) => l.id !== hit.id));
      else setArmed(j);
    }
  };

  const locate = (d: Drag) => {
    const f = frameOf();
    const g = geomRef.current;
    if (!f || !g) return null;
    const p = { x: (d.x - f.r.left) / f.k, y: (d.y - f.r.top) / f.k };
    let target: Jack | null = null;
    let best = SNAP;
    for (const j of isOut(d.anchor) ? INS : OUTS) {
      const c = g.c[j];
      const dist = c ? Math.hypot(c.x - p.x, c.y - p.y) : Infinity;
      if (dist < best) {
        best = dist;
        target = j;
      }
    }
    return { p, target, g };
  };

  const mark = (d: Drag, target: Jack | null) => {
    if (target === d.target) return;
    if (d.target) rings.current[d.target]?.removeAttribute("data-target");
    if (target) rings.current[target]?.setAttribute("data-target", "");
    d.target = target;
  };

  const frame = () => {
    const d = drag.current;
    const live = liveRef.current;
    if (!d || !live) return;
    d.raf = 0;
    const hit = locate(d);
    const a = hit?.g.c[d.anchor];
    if (!hit || !a) return;
    mark(d, hit.target);
    const end = (hit.target && hit.g.c[hit.target]) || hit.p;
    live.setAttribute("d", curve(a, end, hit.g.h, 0.35));
    live.setAttribute("data-on", "");
  };

  const stop = (d: Drag) => {
    if (d.raf) cancelAnimationFrame(d.raf);
    mark(d, null);
    liveRef.current?.removeAttribute("data-on");
    drag.current = null;
  };

  const onDown = (e: PointerEvent<HTMLButtonElement>, j: Jack) => {
    if (e.button !== 0 || drag.current) return;
    dragged.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    const lift = linkOf(j);
    drag.current = {
      pid: e.pointerId,
      anchor: lift ? (lift.o === j ? lift.i : lift.o) : j,
      lift,
      x0: e.clientX,
      y0: e.clientY,
      x: e.clientX,
      y: e.clientY,
      moved: false,
      raf: 0,
      target: null,
    };
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pid) return;
    d.x = e.clientX;
    d.y = e.clientY;
    if (!d.moved) {
      if (Math.hypot(d.x - d.x0, d.y - d.y0) < TAP) return;
      d.moved = true;
      setArmed(null);
      if (d.lift) setLifted(d.lift.id);
    }
    if (!d.raf) d.raf = requestAnimationFrame(frame);
  };

  const onUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pid) return;
    d.x = e.clientX;
    d.y = e.clientY;
    const target = d.moved ? (locate(d)?.target ?? null) : null;
    stop(d);
    if (!d.moved) return; // a tap: the click handler takes it
    dragged.current = true;
    setLifted(null);
    const lift = d.lift;
    if (target) connect(d.anchor, target);
    else if (lift) setLinks((ls) => ls.filter((l) => l.id !== lift.id));
  };

  const onCancel = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pid) return;
    stop(d);
    setLifted(null);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && armed) setArmed(null);
  };

  const shown = links.filter((l) => l.id !== lifted);
  const last = shown.at(-1);
  const name = (j: Jack) => t(`jacks.${j}`);

  const jack = (j: Jack) => {
    const patched = shown.some((l) => l.o === j || l.i === j);
    return (
      <button
        key={j}
        type="button"
        className={styles.jack}
        data-patched={patched || undefined}
        aria-pressed={armed === j}
        aria-label={t("jackLabel", { name: name(j), state: t(patched ? "patched" : "free") })}
        onPointerDown={(e) => onDown(e, j)}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
        onLostPointerCapture={onCancel}
        onClick={(e) => press(j, e.detail > 0)}
      >
        <span className={`type-caption ${styles.name}`}>{name(j)}</span>
        <span
          className={styles.ring}
          aria-hidden="true"
          ref={(el) => {
            rings.current[j] = el;
          }}
        >
          <svg viewBox="-14 -14 28 28" focusable="false">
            <circle className={styles.halo} r="12.5" />
            <circle className={styles.hole} r="8.5" />
            <circle className={styles.fill} r="8.5" />
            <circle className={styles.pin} r="2" />
          </svg>
        </span>
      </button>
    );
  };

  return (
    <div
      className={`h-full w-full ${styles.root}`}
      data-fragment="patchbay"
      data-expanded={expanded || undefined}
    >
      <div className={styles.bar}>
        <p className={styles.status} aria-live="polite">
          {last ? (
            <span className="type-meta">{t("connected", { from: name(last.o), to: name(last.i) })}</span>
          ) : (
            <span className="type-caption">{t("hint")}</span>
          )}
        </p>
        <button
          type="button"
          className={`type-meta ${styles.clear}`}
          disabled={links.length === 0}
          onClick={() => {
            setLinks([]);
            setArmed(null);
          }}
        >
          {t("clear")}
        </button>
      </div>

      <div
        ref={boardRef}
        className={styles.board}
        role="group"
        aria-label={t("boardLabel")}
        aria-describedby={hintId}
        onKeyDown={onKey}
      >
        <span id={hintId} hidden>
          {t("hint")}
        </span>
        <svg className={styles.wires} aria-hidden="true" focusable="false">
          {geom &&
            shown.map((l) => {
              const a = geom.c[l.o];
              const b = geom.c[l.i];
              if (!a || !b) return null;
              const c = hung(a, b, geom.h);
              return (
                <g key={l.id} transform={c.t}>
                  <path d={c.d} className={l.fresh ? styles.settle : undefined} />
                </g>
              );
            })}
          <path ref={liveRef} className={styles.live} />
        </svg>

        <div className={styles.side} data-side="o" role="group" aria-labelledby={outId}>
          <span id={outId} className={`type-meta ${styles.head}`}>
            {t("outputs")}
          </span>
          {OUTS.map(jack)}
        </div>
        <div className={styles.side} data-side="i" role="group" aria-labelledby={inId}>
          <span id={inId} className={`type-meta ${styles.head}`}>
            {t("inputs")}
          </span>
          {INS.map(jack)}
        </div>
      </div>
    </div>
  );
}
