"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FocusEvent, type PointerEvent } from "react";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export type ClaimLine = {
  locale: AppLocale;
  claim: string;
  /** "Continue in English" and its kin, in the line's own language. */
  switchLocale: string;
};

/** How long a line holds, and the cross-fade into the next (see `.home-veil__line`). */
const HOLD_MS = 5000;
const FADE_MS = 700;

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

/**
 * The home sentence in the four site languages, one at a time. `lines[0]` is
 * the page's own locale: it is what the server renders visible, and the only
 * line assistive tech reads (the `h1`). The others are stacked in the same
 * grid cell, so the block always has the height of the tallest line.
 *
 * Under each line from another locale, a link in that language switches the
 * site to it. The cycle pauses under the pointer, with focus inside, in a
 * hidden tab and with the block off screen. Under reduced motion it does not
 * run: the page's line stays and the three links sit in a row.
 */
export function ClaimCycle({ lines }: { lines: ClaimLine[] }) {
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
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  const paused = reducedMotion || hovered || focused || tabHidden || offscreen;
  const count = lines.length;

  useEffect(() => {
    if (paused || count < 2) return;

    // Restarted on every change of line or pause, so a line always gets its
    // full hold once the reader lets go.
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % count), FADE_MS + HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [paused, index, count]);

  const shown = reducedMotion ? 0 : index;

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") setHovered(true);
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  return (
    <div
      ref={blockRef}
      className="home-veil__claim-block"
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
    >
      <h1 className="type-display home-veil__claim">
        {lines.map((line, i) => (
          <span
            key={line.locale}
            lang={line.locale}
            className="home-veil__line"
            data-state={lineState(i, shown, count)}
            aria-hidden={i === 0 ? undefined : true}
          >
            {line.claim}
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
    </div>
  );
}
