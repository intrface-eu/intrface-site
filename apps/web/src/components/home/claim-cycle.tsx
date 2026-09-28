"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
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
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export type ClaimLine = {
  locale: AppLocale;
  claim: string;
  /** "Continue in English" and its kin, in the line's own language. */
  switchLocale: string;
};

/** The arrow buttons' names, in the page's language. */
export type ClaimCycleLabels = {
  prev: string;
  next: string;
};

/**
 * The letter switch (see docs/home-grid-contract.md). The outgoing line's
 * letters start leaving one after another over `SPREAD`: each fades in
 * `OUT_FADE_MS` and moves off in `OUT_MS`. The incoming line's letters start
 * `IN_DELAY` in, over the same spread: each fades up in `IN_FADE_MS` and
 * settles in `IN_MS`. The two waves overlap in time, but a letter's place is
 * clear before the new letter there arrives, so the lines never read as one
 * smear. The whole switch takes `SWITCH_MS`; a line then holds `HOLD_MS`.
 */
const SPREAD = 240;
const OUT_FADE_MS = 260;
const OUT_MS = 380;
const IN_DELAY = 360;
const IN_FADE_MS = 420;
const IN_MS = 560;
const SWITCH_MS = IN_DELAY + SPREAD + IN_MS;
const HOLD_MS = 3000;

/** Leaving accelerates away; arriving lands slowly, with no overshoot. */
const EASE_AWAY = "cubic-bezier(0.5, 0, 0.75, 0)";
const EASE_LAND = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_FADE = "cubic-bezier(0.4, 0, 0.6, 1)";

/** Forward, letters leave up and left and arrive from below and right; back, the reverse. */
const offset = (sign: number) => `translate3d(${sign * 0.08}em, ${sign * 0.3}em, 0)`;
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

/**
 * Kerning lost to the split. A letter in its own inline-block is shaped
 * alone, so the font's kerning with its neighbour is gone; `font-kerning`
 * cannot reach across the boundary. These are the pairs in the five lines
 * that Google Sans Flex (600) kerns by 0.004em or more, measured in Chromium
 * at the display size's two ends (38.4 and 57.6px) and averaged, applied as
 * a margin after the first letter so the split text sets as the plain text
 * does. A pair missing here simply sets unkerned; add it if a line changes.
 */
const KERNING: Record<string, number> = {
  "r.": -0.096,
  "y,": -0.064,
  "’è": -0.063,
  xe: -0.03,
  av: -0.028,
  ov: -0.026,
  vo: -0.026,
  fa: -0.025,
  Re: -0.022,
  va: -0.02,
  re: -0.019,
  nj: -0.018,
  ra: -0.017,
  we: -0.017,
  at: -0.015,
  fu: -0.005,
  te: -0.005,
  to: -0.005,
  tt: -0.005,
  "c’": 0.007,
  ij: 0.012,
};

function kerningAfter(letters: string[], index: number) {
  const pair = letters[index] + (letters[index + 1] ?? "");
  const value = KERNING[pair];
  return value ? { marginInlineEnd: `${value}em` } : undefined;
}

/** Words, each a list of letters. The lines hold no combining marks, so code points are letters. */
function splitLine(text: string): string[][] {
  return text.split(" ").map((word) => Array.from(word));
}

function lettersOf(line: HTMLElement): HTMLElement[] {
  return Array.from(line.querySelectorAll<HTMLElement>(".home-veil__char"));
}

function clearLetters(letters: HTMLElement[]) {
  for (const letter of letters) {
    letter.style.removeProperty("opacity");
    letter.style.removeProperty("transform");
  }
}

/** Spreads `spread` ms of delay across `count` letters, first to last or last to first. */
function spreadDelay(spread: number, count: number, direction: Direction, start = 0) {
  return stagger(spread / Math.max(1, count - 1), { start, from: direction > 0 ? "first" : "last" });
}

/**
 * The home sentence in several site languages, one at a time, in the order
 * `Veil` gives (four lines on most pages, five on `/it`). `lines[0]` is the
 * page's own locale: it is what the server renders visible, and what
 * assistive tech reads (a visually hidden copy in the `h1`; the letters are
 * `aria-hidden`). All lines are stacked in the same grid cell, so the block
 * always has the height of the tallest line.
 *
 * Each line is split into words (which never break) and letters. A switch
 * moves the letters out and in with a stagger on the Web Animations API
 * (anime.js `waapi`), opacity and transform only. Under each line from
 * another locale, a link in that language switches the site to it.
 *
 * The cycle pauses under the pointer, with focus inside, in a hidden tab and
 * with the block off screen. Arrow buttons (on hover or keyboard focus), the
 * Left and Right keys and a horizontal swipe move through the lines by hand.
 * Under reduced motion none of this runs: the page's line stays and the
 * other lines' links sit in a row.
 */
export function ClaimCycle({ lines, labels }: { lines: ClaimLine[]; labels: ClaimCycleLabels }) {
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
  const words = useMemo(() => lines.map((line) => splitLine(line.claim)), [lines]);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  /** Stops whatever is moving, leaving each letter where it is. */
  const stopAll = useCallback(() => {
    for (const animation of running.current) {
      if (!animation.completed) animation.cancel();
    }
    running.current = [];
  }, []);

  /**
   * Moves to line `target`. Every other line still on screen, whole or half
   * gone, sends its letters out from wherever they are; the target's letters
   * come in, from their offset if the line was hidden, or from wherever they
   * are if it was mid-flight. A second call mid-switch simply retargets.
   */
  const animateTo = useCallback(
    (target: number, direction: Direction) => {
      stopAll();

      lineRefs.current.forEach((line, i) => {
        if (!line || i === target || !line.hasAttribute("data-live")) return;
        const letters = lettersOf(line);
        const animation = waapi.animate(letters, {
          opacity: { to: 0, duration: OUT_FADE_MS, ease: EASE_FADE },
          transform: { to: offset(-direction), duration: OUT_MS, ease: EASE_AWAY },
          delay: spreadDelay(SPREAD, letters.length, direction),
          onComplete: () => {
            line.removeAttribute("data-live");
            clearLetters(letters);
          },
        });
        running.current.push(animation);
      });

      const line = lineRefs.current[target];
      if (!line) return;
      const letters = lettersOf(line);
      if (!line.hasAttribute("data-live")) {
        for (const letter of letters) {
          letter.style.opacity = "0";
          letter.style.transform = offset(direction);
        }
        line.setAttribute("data-live", "");
      }
      const animation = waapi.animate(letters, {
        opacity: { to: 1, duration: IN_FADE_MS, ease: EASE_FADE },
        transform: { to: REST, duration: IN_MS, ease: EASE_LAND },
        delay: spreadDelay(SPREAD, letters.length, direction, IN_DELAY),
        onComplete: () => clearLetters(letters),
      });
      running.current.push(animation);
    },
    [stopAll],
  );

  const go = useCallback(
    (direction: Direction, byHand: boolean) => {
      if (count < 2 || window.matchMedia(REDUCED_MOTION).matches) return;
      const target = (shownRef.current + direction + count) % count;
      shownRef.current = target;
      animateTo(target, direction);
      setIndex(target);
      if (byHand) setAnnounced(lines[target]);
    },
    [animateTo, count, lines],
  );

  // Reduced motion switched on mid-visit: back to the page's line, still.
  useEffect(() => {
    if (!reducedMotion) return;
    stopAll();
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      clearLetters(lettersOf(line));
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
    const timer = window.setTimeout(() => go(1, false), SWITCH_MS + HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [paused, index, count, go]);

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
    go(event.key === "ArrowRight" ? 1 : -1, true);
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
    go(dx < 0 ? 1 : -1, true);
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
      <div className="home-veil__stage">
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
              // Set once by the server for the page's line; the letter switch
              // moves it from then on, and React never changes it.
              data-live={i === 0 ? "" : undefined}
              aria-hidden="true"
            >
              {words[i].map((letters, w) => (
                <Fragment key={w}>
                  {w > 0 ? " " : null}
                  <span className="home-veil__word">
                    {letters.map((letter, l) => (
                      <span key={l} className="home-veil__char" style={kerningAfter(letters, l)}>
                        {letter}
                      </span>
                    ))}
                  </span>
                </Fragment>
              ))}
            </span>
          ))}
        </h1>
        {count > 1 ? (
          <div className="home-veil__arrows">
            <button
              type="button"
              className="home-veil__arrow"
              aria-label={labels.prev}
              onClick={() => go(-1, true)}
            >
              <IconArrowLeft aria-hidden="true" size={20} stroke={1.5} />
            </button>
            <button
              type="button"
              className="home-veil__arrow home-veil__arrow--next"
              aria-label={labels.next}
              onClick={() => go(1, true)}
            >
              <IconArrowRight aria-hidden="true" size={20} stroke={1.5} />
            </button>
          </div>
        ) : null}
      </div>
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
      {/* Only a switch made by hand is read out, quietly; the cycle is not. */}
      <p className="sr-only" aria-live="polite" lang={announced?.locale}>
        {announced?.claim}
      </p>
    </div>
  );
}
