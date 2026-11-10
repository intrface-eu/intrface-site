"use client";

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

/**
 * A word of the sentence. `tech` is the word for technology and `meaning`
 * the word for meaning, marked in each locale's message (see `Veil`).
 */
export type ClaimWord = { text: string; role?: "tech" | "meaning" };

export type ClaimLine = {
  locale: AppLocale;
  /** The language by its own name, for the code button's accessible name. */
  name: string;
  /** The plain sentence, for assistive tech. */
  claim: string;
  words: ClaimWord[];
  /** "Continue in English" and its kin, in the line's own language. */
  switchLocale: string;
};

/**
 * The motion (see docs/home-grid-contract.md). Every word is a mask. A line
 * arrives word by word, `WORD_STEP` apart: a plain word rises into its mask
 * in `IN_MS`. The letters of the word for technology mesh into theirs, one
 * from below, the next from above, `CHAR_STEP` apart, each in `CHAR_MS`,
 * and stand dimmed at `DIM`. The word for meaning comes `MEANING_GAP` late
 * and rises whole, slower (`MEANING_MS`), fading up as it comes. Once it is
 * nearly in, light passes from it into the technology word: its letters
 * come to full strength one by one, starting from the side the word for
 * meaning stands on. A line leaving sends its words up out of their masks,
 * `OUT_STEP` apart, each in `OUT_MS`. Transform and opacity only.
 */
const WORD_STEP = 120;
const IN_MS = 1000;
const CHAR_STEP = 26;
const CHAR_MS = 820;
const MEANING_GAP = 180;
const MEANING_MS = 1300;
const LIGHT_AFTER = 700;
const LIGHT_STEP = 34;
const LIGHT_MS = 600;
const DIM = "0.38";
const OUT_STEP = 18;
const OUT_MS = 460;
/** When the first word starts: on load (CSS), and on a switch, after the old line clears. */
const INTRO_DELAY = 160;
const IN_DELAY = 240;
const HOLD_MS = 3400;

/** Leaving accelerates away; arriving lands slowly, with no overshoot. */
const EASE_AWAY = "cubic-bezier(0.7, 0, 0.84, 0)";
const EASE_LAND = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_LIGHT = "cubic-bezier(0.33, 1, 0.68, 1)";

type Direction = 1 | -1;

/** A technology letter's side: even letters mesh from below, odd from above. */
const side = (c: number): Direction => (c % 2 === 0 ? 1 : -1);

type Plan = {
  /** Start of each word, in ms. */
  at: number[];
  /** Start of each technology letter's move and of its light, per word. */
  chars: number[][];
  light: number[][];
  /** When the line has fully landed. */
  end: number;
};

/**
 * When each part of a line moves, counted from `start`. Back, the words come
 * last to first; the light always flows from the word for meaning.
 */
function plan(words: ClaimWord[], direction: Direction, start: number): Plan {
  const at = words.map(() => start);
  const chars: number[][] = words.map(() => []);
  const light: number[][] = words.map(() => []);
  const order = words.map((_, i) => i);
  if (direction < 0) order.reverse();

  let t = start;
  let end = start;
  let techLands = 0;
  for (const i of order) {
    const word = words[i];
    if (word.role === "meaning") t += MEANING_GAP;
    at[i] = t;
    if (word.role === "tech") {
      const n = Array.from(word.text).length;
      chars[i] = Array.from({ length: n }, (_, c) => t + (direction > 0 ? c : n - 1 - c) * CHAR_STEP);
      techLands = t + (n - 1) * CHAR_STEP + CHAR_MS * 0.6;
      end = Math.max(end, t + (n - 1) * CHAR_STEP + CHAR_MS);
    } else {
      end = Math.max(end, t + (word.role === "meaning" ? MEANING_MS : IN_MS));
    }
    t += WORD_STEP;
  }

  const tech = words.findIndex((word) => word.role === "tech");
  const meaning = words.findIndex((word) => word.role === "meaning");
  if (tech >= 0) {
    const n = chars[tech].length;
    const from = Math.max(meaning >= 0 ? at[meaning] + LIGHT_AFTER : 0, techLands);
    const fromEnd = meaning > tech;
    light[tech] = Array.from({ length: n }, (_, c) => from + (fromEnd ? n - 1 - c : c) * LIGHT_STEP);
    end = Math.max(end, from + (n - 1) * LIGHT_STEP + LIGHT_MS);
  }

  return { at, chars, light, end: Math.round(end) };
}

/** Forward, words leave upward and arrive from below; back, the reverse. */
const offset = (sign: number) => `translate3d(0, ${sign * 110}%, 0)`;
const REST = "translate3d(0, 0, 0)";
/** A letter waits further out than a word, so no descender or ascender shows in its mask. */
const letterOffset = (sign: number) => `translate3d(0, ${sign * 130}%, 0)`;

/** A horizontal swipe of at least this many pixels switches the line. */
const SWIPE_PX = 40;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

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

function charsOf(word: HTMLElement): HTMLElement[] {
  return Array.from(word.querySelectorAll<HTMLElement>(".home-veil__char"));
}

/** Back to the line's resting state: every inline style the motion set goes. */
function clearLine(line: HTMLElement) {
  for (const node of line.querySelectorAll<HTMLElement>(".home-veil__word-in, .home-veil__char")) {
    node.style.removeProperty("transform");
    node.style.removeProperty("opacity");
  }
}

/** Freezes these animations where they stand and drops them. */
function freeze(animations: Animation[]) {
  for (const animation of animations) {
    if (animation.playState === "idle") continue;
    try {
      animation.commitStyles();
    } catch {
      // A node outside the rendered tree has nothing to keep.
    }
    animation.cancel();
  }
}

/**
 * The home sentence in several site languages, one at a time, in the order
 * `Veil` gives (four lines on most pages, five on `/it`). `lines[0]` is the
 * page's own locale: it is what the server renders visible, and what
 * assistive tech reads (a visually hidden copy in the `h1`; the words are
 * `aria-hidden`). All lines are stacked in the same grid cell, so the block
 * always has the height of the tallest line.
 *
 * On load the page's line arrives as `plan` times it (CSS animations, so it
 * runs before hydration). A switch then moves the old line out and the new
 * one in on the Web Animations API, with the same plan. Under the
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
  const running = useRef<Animation[]>([]);
  const shownRef = useRef(0);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swipedAt = useRef(0);

  const count = lines.length;
  /** The page's line on load, and how long each line takes to land. */
  const intro = useMemo(() => plan(lines[0].words, 1, INTRO_DELAY), [lines]);
  const landMs = useMemo(() => lines.map((line) => plan(line.words, 1, IN_DELAY).end), [lines]);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  /** Stops whatever is moving, leaving each word and letter where it is. */
  const stopAll = useCallback(() => {
    freeze(running.current);
    running.current = [];
  }, []);

  /**
   * Moves to line `target`. Every other line still on screen, whole or half
   * gone, sends its words out from wherever they are; the target's words
   * and letters come in, from outside their masks if the line was hidden,
   * or from wherever they are if it was mid-flight. A second call
   * mid-switch simply retargets.
   */
  const animateTo = useCallback(
    (target: number, direction: Direction) => {
      stopAll();

      lineRefs.current.forEach((line) => {
        if (!line?.hasAttribute("data-intro")) return;
        // The load is over once anything switches. Its CSS animations are
        // frozen where they stand, so a switch mid-load starts from there.
        freeze(line.getAnimations({ subtree: true }));
        line.removeAttribute("data-intro");
      });

      const run = (node: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
        const animation = node.animate(keyframes, { fill: "forwards", ...options });
        running.current.push(animation);
        return animation;
      };
      /** When every animation in `group` has finished; a cancelled one never calls. */
      const settle = (group: Animation[], done: () => void) => {
        Promise.all(group.map((animation) => animation.finished))
          .then(() => {
            done();
            for (const animation of group) animation.cancel();
          })
          .catch(() => {});
      };

      lineRefs.current.forEach((line, i) => {
        if (!line || i === target || !line.hasAttribute("data-live")) return;
        const out = wordsOf(line);
        const group = out.map((word, w) =>
          run(word, [{ transform: offset(-direction) }], {
            duration: OUT_MS,
            delay: (direction > 0 ? w : out.length - 1 - w) * OUT_STEP,
            easing: EASE_AWAY,
          }),
        );
        settle(group, () => {
          line.removeAttribute("data-live");
          clearLine(line);
        });
      });

      const line = lineRefs.current[target];
      if (!line) return;
      const timing = plan(lines[target].words, direction, IN_DELAY);
      const fresh = !line.hasAttribute("data-live");
      const group: Animation[] = [];

      wordsOf(line).forEach((word, w) => {
        const role = lines[target].words[w]?.role;
        if (role === "tech") {
          // The word stays put (or returns, if it was leaving); its letters move.
          if (!fresh) group.push(run(word, [{ transform: REST }], { duration: IN_MS, delay: timing.at[w], easing: EASE_LAND }));
          charsOf(word).forEach((char, c) => {
            if (fresh) {
              char.style.transform = letterOffset(side(c) * direction);
              char.style.opacity = DIM;
            }
            group.push(
              run(char, [{ transform: REST }], { duration: CHAR_MS, delay: timing.chars[w][c], easing: EASE_LAND }),
              run(char, [{ opacity: "1" }], { duration: LIGHT_MS, delay: timing.light[w][c], easing: EASE_LIGHT }),
            );
          });
          return;
        }
        if (fresh) {
          word.style.transform = offset(direction);
          if (role === "meaning") word.style.opacity = "0";
        }
        group.push(
          run(word, [{ transform: REST, opacity: "1" }], {
            duration: role === "meaning" ? MEANING_MS : IN_MS,
            delay: timing.at[w],
            easing: EASE_LAND,
          }),
        );
      });

      line.setAttribute("data-live", "");
      settle(group, () => clearLine(line));
    },
    [lines, stopAll],
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
      clearLine(line);
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
    const timer = window.setTimeout(() => step(1, false), landMs[index] + HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [paused, index, count, step, landMs]);

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
            {line.words.map((word, w) => (
              <Fragment key={w}>
                {w > 0 ? " " : null}
                <span className="home-veil__word" data-role={word.role}>
                  <span
                    className="home-veil__word-in"
                    style={i === 0 ? ({ "--d": `${intro.at[w]}ms` } as CSSProperties) : undefined}
                  >
                    {word.role === "tech"
                      ? Array.from(word.text).map((char, c) => (
                          <span
                            key={c}
                            className="home-veil__char"
                            style={
                              i === 0
                                ? ({
                                    "--d": `${intro.chars[w][c]}ms`,
                                    "--l": `${intro.light[w][c]}ms`,
                                    "--s": side(c),
                                  } as CSSProperties)
                                : undefined
                            }
                          >
                            {char}
                          </span>
                        ))
                      : word.text}
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
              style={{ "--hold": `${landMs[i] + HOLD_MS}ms` } as CSSProperties}
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
