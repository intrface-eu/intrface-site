"use client";

import { useEffect } from "react";

/**
 * The only JavaScript in the ground.
 *
 * One passive `pointermove` listener on the window, throttled to a frame, that
 * writes two normalised scalars onto the ground root. Everything else — the
 * per-layer travel distance, the direction, the compositing — is CSS. The
 * handler stores the position and nothing else; the arithmetic happens once per
 * frame in the rAF callback, and there is no React state, so nothing here can
 * render.
 *
 * It does nothing at all on a coarse pointer (a finger has no hover, and the
 * hero shader already answers touch) or under reduced motion, and it takes its
 * listener with it on unmount.
 */
export function GroundPointer() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ground = document.querySelector<HTMLElement>("[data-ground]");
    if (!ground) return;

    let x = 0;
    let y = 0;
    let frame = 0;

    const apply = () => {
      frame = 0;
      ground.style.setProperty("--ground-nx", (x / window.innerWidth - 0.5).toFixed(4));
      ground.style.setProperty("--ground-ny", (y / window.innerHeight - 0.5).toFixed(4));
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      ground.style.removeProperty("--ground-nx");
      ground.style.removeProperty("--ground-ny");
    };
  }, []);

  return null;
}
