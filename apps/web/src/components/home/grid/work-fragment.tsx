"use client";

import { useTranslations } from "next-intl";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  WORK_PIECES,
  type FragmentProps,
  type WorkFragmentProps,
  type WorkPieceSlug,
} from "@/lib/site/interfaces";
import { PROJECTS } from "@/lib/site/projects";
import { AstyleMarineFragment } from "./astyle-marine-fragment";
import { FundaFragment } from "./funda-fragment";
import { MidiflowFragment } from "./midiflow-fragment";
import { PatchbayFragment } from "./patchbay-fragment";
import { VelumFragment } from "./velum-fragment";
import { WorkPieceActive } from "./work-piece-context";
import styles from "./work-fragment.module.css";

const PIECES: Record<WorkPieceSlug, ComponentType<FragmentProps>> = {
  midiflow: MidiflowFragment,
  patchbay: PatchbayFragment,
  funda: FundaFragment,
  velum: VelumFragment,
  astyleMarine: AstyleMarineFragment,
};

const ORDER = WORK_PIECES.map((spec) => spec.slug);

/** Idle rotation step; `.progress` in the module CSS runs the same length. */
const ROTATE_MS = 9000;
/** The crossfade; `.leave` runs the same length. */
const FADE_MS = 200;

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const readReduce = () => window.matchMedia(REDUCE).matches;
const readReduceServer = () => false;

const subscribeHidden = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
const readHidden = () => document.hidden;
const readHiddenServer = () => false;

const step = (slug: WorkPieceSlug, by: number) =>
  ORDER[(ORDER.indexOf(slug) + by + ORDER.length) % ORDER.length];

/**
 * The work cell: a switcher over the five smaller pieces and the current
 * piece under it. The shell owns the current piece; this reports changes,
 * from the tabs and from idle rotation.
 *
 * Rotation advances every 9s only while the cell is on screen, the tab is
 * visible, no pointer is over it, motion is allowed and the cell is at rest.
 * The first press, key or focus inside the cell ends it for good. Only the
 * current piece is mounted, except for the 200ms it takes the previous one to
 * fade out over it (the crossfade), during which it is inert and told to go
 * quiet.
 */
export function WorkFragment({ piece, onPieceChange, expanded }: WorkFragmentProps) {
  const t = useTranslations("HomeGrid.work");
  const tg = useTranslations("HomeGrid");
  const reduced = useSyncExternalStore(subscribeReduce, readReduce, readReduceServer);
  const hidden = useSyncExternalStore(subscribeHidden, readHidden, readHiddenServer);
  const uid = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<WorkPieceSlug, HTMLButtonElement | null>>>({});
  const change = useRef(onPieceChange);
  const remaining = useRef(ROTATE_MS);

  const [touched, setTouched] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [hovered, setHovered] = useState(false);

  // The piece on screen and the one fading out. Tracked in render (not in an
  // effect) so the outgoing piece keeps its instance for the fade.
  const [shown, setShown] = useState(piece);
  const [leaving, setLeaving] = useState<WorkPieceSlug | null>(null);
  if (shown !== piece) {
    setShown(piece);
    setLeaving(reduced ? null : shown);
  }

  useEffect(() => {
    change.current = onPieceChange;
  }, [onPieceChange]);

  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(null), FADE_MS);
    return () => window.clearTimeout(id);
  }, [leaving]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const running = !touched && !reduced && !expanded && !hidden && onScreen && !hovered;

  // A new piece gets the full nine seconds; a pause keeps what was left.
  useEffect(() => {
    remaining.current = ROTATE_MS;
  }, [piece]);

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const id = window.setTimeout(() => {
      remaining.current = ROTATE_MS;
      change.current(step(piece, 1));
    }, remaining.current);
    return () => {
      window.clearTimeout(id);
      remaining.current = Math.max(0, remaining.current - (performance.now() - start));
    };
  }, [running, piece]);

  const stop = () => {
    if (!touched) setTouched(true);
  };

  const pick = (slug: WorkPieceSlug) => {
    stop();
    if (slug !== piece) onPieceChange(slug);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    let next: WorkPieceSlug | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = step(piece, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = step(piece, -1);
        break;
      case "Home":
        next = ORDER[0];
        break;
      case "End":
        next = ORDER[ORDER.length - 1];
        break;
      default:
        return;
    }
    e.preventDefault();
    pick(next);
    tabRefs.current[next]?.focus();
  };

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse") setHovered(true);
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === "mouse") setHovered(false);
  };

  // Keep the current tab in view where the row has to scroll. The row scrolls
  // itself, never the page (`.tabs` is the tabs' offset parent).
  useEffect(() => {
    const tab = tabRefs.current[piece];
    const row = rowRef.current;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    const left = tab.offsetLeft - 16;
    const right = tab.offsetLeft + tab.offsetWidth + 16 - row.clientWidth;
    if (row.scrollLeft > left) row.scrollLeft = left;
    else if (row.scrollLeft < right) row.scrollLeft = right;
  }, [piece]);

  // Mark which ends of the row hide a name, for the edge fade.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const mark = () => {
      const start = row.scrollLeft > 1;
      const end = row.scrollLeft + row.clientWidth < row.scrollWidth - 1;
      const more = start && end ? "both" : start ? "start" : end ? "end" : "";
      if (more) row.dataset.more = more;
      else delete row.dataset.more;
    };
    mark();
    row.addEventListener("scroll", mark, { passive: true });
    const ro = new ResizeObserver(mark);
    ro.observe(row);
    return () => {
      row.removeEventListener("scroll", mark);
      ro.disconnect();
    };
  }, []);

  const nameOf = (slug: WorkPieceSlug) =>
    slug === "velum" || slug === "astyleMarine" ? PROJECTS[slug].name : tg(`${slug}.name`);

  const layers = leaving && leaving !== piece ? [leaving, piece] : [piece];
  const panelId = `${uid}-panel`;
  const tabId = (slug: WorkPieceSlug) => `${uid}-${slug}`;

  return (
    <div
      ref={rootRef}
      className={`${styles.root} h-full w-full`}
      data-fragment="work"
      data-expanded={expanded || undefined}
      onPointerDown={stop}
      onKeyDown={stop}
      onFocus={stop}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <div className={styles.bar}>
        <div ref={rowRef} role="tablist" aria-label={t("switcherLabel")} className={styles.tabs}>
          {ORDER.map((slug) => {
            const selected = slug === piece;
            return (
              <button
                key={slug}
                ref={(el) => {
                  tabRefs.current[slug] = el;
                }}
                id={tabId(slug)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                className={`${styles.tab} type-caption`}
                onClick={() => pick(slug)}
                onKeyDown={onTabKey}
              >
                {nameOf(slug)}
                {selected && !touched && !reduced && !expanded ? (
                  <span
                    key={piece}
                    className={styles.progress}
                    data-running={running || undefined}
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={tabId(piece)} className={styles.panel}>
        {layers.map((slug) => {
          const Piece = PIECES[slug];
          const out = slug !== piece;
          return (
            <div
              key={slug}
              className={out ? `${styles.layer} ${styles.leave}` : styles.layer}
              inert={out || undefined}
              aria-hidden={out || undefined}
            >
              <WorkPieceActive.Provider value={!out}>
                <Piece expanded={expanded} />
              </WorkPieceActive.Provider>
            </div>
          );
        })}
      </div>
    </div>
  );
}
