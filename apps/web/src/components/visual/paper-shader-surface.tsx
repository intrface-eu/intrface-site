"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type PaperShaderSurfaceVariant = "contact";

/**
 * Speed 0 is not just "no motion" — `@paper-design/shaders` cancels its
 * requestAnimationFrame loop entirely when speed hits 0, so a paused surface
 * costs nothing per frame. The library only pauses on `visibilitychange`
 * (tab hidden); it keeps rendering a canvas that is scrolled far out of view.
 * On the home page the contact band sits ~4000px below the fold, so without
 * this the GPU redraws ~720k pixels 60 times a second the whole time someone
 * is reading the hero.
 *
 * The observer is mount-only: it flips one boolean when the band enters or
 * leaves view. No per-frame work of our own.
 */
const ROOT_MARGIN = "200px";

export function PaperShaderSurface({
  variant,
  className = "",
}: {
  variant: PaperShaderSurfaceVariant;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Assume visible until the observer says otherwise, so the surface is never
  // frozen for anyone whose browser lacks IntersectionObserver.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`shader-surface pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      data-tone="dark"
      data-variant={variant}
      ref={ref}
    >
      <GrainGradient
        width="100%"
        height="100%"
        colors={["#0f1729", "#1e293b", "#0f766e"]}
        colorBack="#05070d"
        softness={0.74}
        intensity={0.24}
        noise={0.18}
        shape="ripple"
        speed={shouldReduceMotion || !inView ? 0 : 0.08}
        frame={420}
        fit="cover"
        maxPixelCount={720000}
      />
    </div>
  );
}
