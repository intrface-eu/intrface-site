"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type HalftoneVariant = "teal" | "rose" | "blue" | "ink";

type HalftoneDotsProps = {
  variant?: HalftoneVariant;
  className?: string;
  style?: CSSProperties;
  density?: "fine" | "medium" | "coarse";
  animated?: boolean;
};

const variantColor: Record<HalftoneVariant, [number, number, number]> = {
  teal: [16, 185, 129],
  rose: [225, 29, 72],
  blue: [14, 165, 233],
  ink: [15, 23, 41],
};

const densityStep = {
  fine: 10,
  medium: 14,
  coarse: 20,
} as const;

export function HalftoneDots({
  variant = "ink",
  className,
  style,
  density = "medium",
  animated = true,
}: HalftoneDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const color = variantColor[variant];
    const step = densityStep[density];
    let frame = 0;
    let width = 0;
    let height = 0;
    let running = true;

    const draw = (time: number) => {
      const phase = animated && !reducedMotion.matches ? time / 1400 : 0;
      context.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const maxDistance = Math.hypot(centerX, centerY);

      for (let y = step; y < height; y += step) {
        for (let x = step; x < width; x += step) {
          const normalized = 1 - Math.min(Math.hypot(x - centerX, y - centerY) / maxDistance, 1);
          const jitter = deterministicJitter(x, y);
          const wave = Math.sin(x * 0.018 + y * 0.014 + phase + jitter * 6.28318) * 0.5 + 0.5;
          const radius = Math.max(0.8, step * (0.08 + normalized * 0.22 + wave * 0.08));
          const alpha = 0.08 + normalized * 0.24 + wave * 0.08;

          context.beginPath();
          context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
          context.arc(x + (jitter - 0.5) * 1.8, y + (jitter - 0.5) * 1.8, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      if (running && animated && !reducedMotion.matches) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.min(Math.max(1, Math.floor(rect.width * dpr)), 1400);
      height = Math.min(Math.max(1, Math.floor(rect.height * dpr)), 1000);
      canvas.width = width;
      canvas.height = height;
      context.setTransform(1, 0, 0, 1, 0, 0);
      draw(0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    reducedMotion.addEventListener("change", resize);
    resize();

    if (animated && !reducedMotion.matches) {
      frame = window.requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      observer.disconnect();
      reducedMotion.removeEventListener("change", resize);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [animated, density, variant]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={style} />;
}

function deterministicJitter(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}
