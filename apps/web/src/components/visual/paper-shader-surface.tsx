"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";

export type PaperShaderSurfaceVariant = "contact";

export function PaperShaderSurface({
  variant,
  className = "",
}: {
  variant: PaperShaderSurfaceVariant;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`shader-surface pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      data-tone="dark"
      data-variant={variant}
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
        speed={shouldReduceMotion ? 0 : 0.08}
        frame={420}
        fit="cover"
        maxPixelCount={720000}
      />
    </div>
  );
}
