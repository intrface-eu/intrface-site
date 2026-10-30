"use client";

import { stagger } from "animejs/utils";
import { waapi, type WAAPIAnimation } from "animejs/waapi";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export type ClaimLine = {
  locale: AppLocale;
  /** The language by its own name, for the code button's accessible name. */
  name: string;
  claim: string;
  /** "Continue in English" and its kin, in the line's own language. */
  switchLocale: string;
};

/**
 * The word switch (see docs/home-grid-contract.md). Every word is a mask.
 * The outgoing line's words leave through the top of their masks one after
 * another, `OUT_STEP` apart, each in `OUT_MS`; the incoming line's words
 * rise in from below, `IN_STEP` apart, each in `IN_MS`, starting `IN_DELAY`
 * in. A line then holds `HOLD_MS`. Whole words move, so the font's own
 * kerning stays intact.
 */
const OUT_STEP = 18;
const OUT_MS = 460;
const IN_DELAY = 240;
const IN_STEP = 42;
const IN_MS = 950;
/** The switch, for a line of about fourteen words. */
const SWITCH_MS = IN_DELAY + 14 * IN_STEP + IN_MS;
const HOLD_MS = 3400;

/** Leaving accelerates away; arriving lands slowly, with no overshoot. */
const EASE_AWAY = "cubic-bezier(0.7, 0, 0.84, 0)";
const EASE_LAND = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Forward, words leave upward and arrive from below; back, the reverse. */
const offset = (sign: number) => `translate3d(0, ${sign * 110}%, 0)`;
const REST = "translate3d(0, 0, 0)";

/** A horizontal swipe of at least this many pixels switches the line. */
const SWIPE_PX = 40;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type Direction = 1 | -1;

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** Where a line stands against the one shown: it has just left, or waits its turn. */
function lineState(index: number, shown: number, count: number): "shown" | "past" | "next" {
  if (index === shown) return "shown";
  if (index === (shown - 1 + count) % count) return "past";
  return "next";
}

function wordsOf(line: HTMLElement): HTMLElement[] {
  return Array.from(line.querySelectorAll<HTMLElement>(".home-veil__word-in"));
}

function clearWords(words: HTMLElement[]) {
  for (const word of words) word.style.removeProperty("transform");
}

/**
 * The home sentence in several site languages, one at a time, in the order
 * `Veil` gives (four lines on most pages, five on `/it`). `lines[0]` is the
 * page's own locale: it is what the server renders visible, and what
 * assistive tech reads (a visually hidden copy in the `h1`; the words are
 * `aria-hidden`). All lines are stacked in the same grid cell, so the block
 * always has the height of the tallest line.
 *
 * On load the page's line rises into place word by word (a CSS animation,
 * so it runs before hydration). A switch then moves the words out and in on
 * the Web Animations API (anime.js `waapi`), transform only. Under the
 * sentence, one button per language shows which line is up, with a hairline
 * that fills over its hold; pressing one shows its line. Under each line
 * from another locale, a link in that language switches the site to it.
 *
 * The cycle pauses under the pointer, with focus inside, in a hidden tab and
 * with the block off screen. The language buttons, the Left and Right keys
 * and a horizontal swipe move through the lines by hand. Under reduced
 * motion none of this runs: the page's line stays and the other lines'
 * links sit in a row.
 */
export function ClaimCycle({ lines, label }: { lines: ClaimLine[]; label: string }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  const tabHidden = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "hidden",
    () => false,
  );
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [announced, setAnnounced] = useState<ClaimLine | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const running = useRef<WAAPIAnimation[]>([]);
  const shownRef = useRef(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swipedAt = useRef(0);

  const count = lines.length;
  const words = useMemo(() => lines.map((line) => line.claim.split(" ")), [lines]);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  /** Stops whatever is moving, leaving each word where it is. */
  const stopAll = useCallback(() => {
    for (const animation of running.current) {
      if (!animation.completed) animation.cancel();
    }
    running.current = [];
  }, []);

  /**
   * Moves to line `target`. Every other line still on screen, whole or half
   * gone, sends its words out from wherever they are; the target's words
   * come in, from below their masks if the line was hidden, or from wherever
   * they are if it was mid-flight. A second call mid-switch simply retargets.
   */
  const animateTo = useCallback(
    (target: number, direction: Direction) => {
      stopAll();

      lineRefs.current.forEach((line) => {
        // The load rise is done once anything switches; a finished CSS
        // animation would otherwise hold its words in place over the WAAPI.
        line?.removeAttribute("data-intro");
      });

      lineRefs.current.forEach((line, i) => {
        if (!line || i === target || !line.hasAttribute("data-live")) return;
        const out = wordsOf(line);
        const animation = waapi.animate(out, {
          transform: { to: offset(-direction), duration: OUT_MS, ease: EASE_AWAY },
          delay: stagger(OUT_STEP, { from: direction > 0 ? "first" : "last" }),
          onComplete: () => {
            line.removeAttribute("data-live");
            clearWords(out);
          },
        });
        running.current.push(animation);
      });

      const line = lineRefs.current[target];
      if (!line) return;
      const incoming = wordsOf(line);
      if (!line.hasAttribute("data-live")) {
        for (const word of incoming) word.style.transform = offset(direction);
        line.setAttribute("data-live", "");
      }
      const animation = waapi.animate(incoming, {
        transform: { to: REST, duration: IN_MS, ease: EASE_LAND },
        delay: stagger(IN_STEP, { start: IN_DELAY, from: direction > 0 ? "first" : "last" }),
        onComplete: () => clearWords(incoming),
      });
      running.current.push(animation);
    },
    [stopAll],
  );

  const show = useCallback(
    (target: number, direction: Direction, byHand: boolean) => {
      if (count < 2 || target === shownRef.current || window.matchMedia(REDUCED_MOTION).matches) return;
      shownRef.current = target;
      animateTo(target, direction);
      setIndex(target);
      if (byHand) setAnnounced(lines[target]);
    },
    [animateTo, count, lines],
  );

  const step = useCallback(
    (direction: Direction, byHand: boolean) =>
      show((shownRef.current + direction + count) % count, direction, byHand),
    [count, show],
  );

  // Reduced motion switched on mid-visit: back to the page's line, still.
  useEffect(() => {
    if (!reducedMotion) return;
    stopAll();
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      clearWords(wordsOf(line));
      if (i === 0) line.setAttribute("data-live", "");
      else line.removeAttribute("data-live");
    });
    shownRef.current = 0;
  }, [reducedMotion, stopAll]);

  useEffect(() => stopAll, [stopAll]);

  const paused = reducedMotion || hovered || focused || tabHidden || offscreen;

  useEffect(() => {
    if (paused || count < 2) return;

    // Restarted on every change of line or pause, so a line always gets its
    // full hold once the reader lets go, counted from the end of its switch.
    // The hairline under the language restarts with it (see `data-held`).
    const timer = window.setTimeout(() => step(1, false), SWITCH_MS + HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [paused, index, count, step]);

  const shown = reducedMotion ? 0 : index;

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") setHovered(true);
  };
  // Keyboard focus holds the line; a button focused by a mouse click does
  // not, so leaving the block resumes the cycle as it does after any hover.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) setFocused(true);
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    setFocused(true);
    step(event.key === "ArrowRight" ? 1 : -1, true);
  };

  // Touch: a horizontal swipe switches; `touch-action: pan-y` on the block
  // leaves vertical scrolling to the page, which cancels the pointer.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipe.current = event.pointerType === "touch" ? { x: event.clientX, y: event.clientY } : null;
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || event.pointerType !== "touch") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;
    swipedAt.current = event.timeStamp;
    step(dx < 0 ? 1 : -1, true);
  };
  // A swipe that ends on the link does not also follow it.
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (swipedAt.current && event.timeStamp - swipedAt.current < 500) {
      event.preventDefault();
      event.stopPropagation();
    }
    swipedAt.current = 0;
  };

  return (
    <div
      ref={blockRef}
      className="home-veil__claim-block"
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipe.current = null)}
      onClickCapture={onClickCapture}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <h1 className="type-display home-veil__claim">
        <span className="sr-only">{lines[0].claim}</span>
        {lines.map((line, i) => (
          <span
            key={line.locale}
            ref={(node) => {
              lineRefs.current[i] = node;
            }}
            lang={line.locale}
            className="home-veil__line"
            // Set once by the server on the page's line; the word switch
            // moves them from then on, and React never changes them.
            data-intro={i === 0 ? "" : undefined}
            data-live={i === 0 ? "" : undefined}
            aria-hidden="true"
          >
            {words[i].map((word, w) => (
              <Fragment key={w}>
                {w > 0 ? " " : null}
                <span className="home-veil__word">
                  <span className="home-veil__word-in" style={{ "--w": w } as CSSProperties}>
                    {word}
                  </span>
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </h1>
      <div className="home-veil__switch">
        {lines.map((line, i) => {
          // The page's own locale has no link: the slot stays empty, at height.
          if (i === 0) return null;
          const live = reducedMotion || i === shown;

          return (
            <Link
              key={line.locale}
              href="/"
              locale={line.locale}
              lang={line.locale}
              hrefLang={line.locale}
              className="type-caption home-veil__switch-link"
              data-state={lineState(i, shown, count)}
              aria-hidden={live ? undefined : true}
              tabIndex={live ? undefined : -1}
            >
              {line.switchLocale}
            </Link>
          );
        })}
      </div>
      {count > 1 ? (
        <div className="home-veil__codes" role="group" aria-label={label}>
          {lines.map((line, i) => (
            <button
              key={line.locale}
              type="button"
              className="home-veil__code"
              aria-label={line.name}
              aria-pressed={i === shown}
              data-held={i === shown && paused ? "" : undefined}
              style={{ "--hold": `${SWITCH_MS + HOLD_MS}ms` } as CSSProperties}
              onClick={() => show(i, i > shownRef.current ? 1 : -1, true)}
            >
              {line.locale.toUpperCase()}
            </button>
          ))}
        </div>
      ) : null}
      {/* Only a switch made by hand is read out, quietly; the cycle is not. */}
      <p className="sr-only" aria-live="polite" lang={announced?.locale}>
        {announced?.claim}
      </p>
    </div>
  );
}
