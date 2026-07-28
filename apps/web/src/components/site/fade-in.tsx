"use client";

import { useEffect, useRef } from "react";

/**
 * Section reveal. The motion lives entirely in CSS (`[data-reveal]` in
 * globals.css); this component only flips an attribute when the element
 * first scrolls into view.
 *
 * Why not a motion library: FadeIn wraps nearly every block on every page,
 * so a per-instance animation runtime cost hydration on load and main-thread
 * work on every scroll frame — which showed up as input delay. One shared
 * observer and a composited CSS transition cost neither.
 *
 * Three details worth keeping:
 * - The observer is module-level, so N wrappers share one observer instead
 *   of allocating N of them.
 * - The hidden state is applied from the effect, never on the server. Server
 *   markup is identical for every visitor, so there is no hydration mismatch
 *   and the content stays readable with JavaScript off or still loading.
 * - Reduced motion is handled purely in CSS. The hidden state only exists
 *   inside `prefers-reduced-motion: no-preference`, so a reader who asked for
 *   less motion sees the content in place, whatever this component does.
 */

let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;

  sharedObserver ??= new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-reveal", "shown");
        observer.unobserve(entry.target);
      }
    },
    // Matches the old viewport amount: reveal once 16% of the block is in view.
    { threshold: 0.16 },
  );

  return sharedObserver;
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Stagger, in milliseconds. Applied as `transition-delay`. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const observer = getObserver();
    if (!element || !observer) return;

    // Set here rather than in the markup so nothing is ever hidden before the
    // observer exists to un-hide it.
    element.setAttribute("data-reveal", "pending");
    observer.observe(element);

    return () => observer.unobserve(element);
  }, []);

  return (
    <div
      className={className}
      ref={ref}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
