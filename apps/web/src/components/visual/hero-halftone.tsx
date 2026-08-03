"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's halftone screen, live.
 *
 * The site's whole visual argument is print: separations, registration, an
 * unprinted plate. The screen drifts on its own — a warped sine field, so the
 * ink folds across the sheet rather than pulsing in place — and the hand
 * stirs it: cursor or finger, the flow curls after it, the dots under it
 * resolve into focus, and the ink runs toward the accent. Let go and the tide
 * carries on. Scrolling pulls the tide along with the page. Nothing else on
 * the page moves by itself.
 *
 * Three rules it has to keep, all of them learned the hard way:
 *
 * 1. No dot behind a word. The mask is measured from the copy, not guessed: on
 *    every resize the component reads the hero's own text — glyph rects, not
 *    boxes — and hands the shader the ramp that clears it. Beside the copy the
 *    ink starts a gutter past the last glyph; in the clear sheet above and
 *    below it the ramp starts far further in, so the field wraps the type
 *    instead of hiding in the right margin. Once the layout stacks there is no
 *    lateral room, so the ramps run down the page instead: ink from the top
 *    trim to a gutter over the eyebrow, clear sheet across the copy, ink again
 *    a gutter under the last button. DESIGN.md forbids
 *    an animated surface behind body text and this is how the hero honours it:
 *    there is no surface there to animate.
 * 2. No frame drawn that nobody sees. An IntersectionObserver stops the loop
 *    when the band scrolls away, and `visibilitychange` stops it with the tab.
 *    A GPU redrawing a megapixel 60 times a second under someone reading the
 *    contact form is the exact fault this component was built to avoid.
 * 3. No per-frame React. The pointer lands in a ref, the loop reads it, the
 *    component renders once. Scroll is read the same way — the loop diffs
 *    `scrollY` against the last frame rather than subscribing to the event —
 *    so the shader's clock is accumulated, not wall-clock: base rate plus a
 *    boost that decays back to the ambient pace when the page settles.
 *
 * Reduced motion gets one static frame, drawn at the ambient midpoint, with no
 * loop and no pointer. No WebGL2 gets the CSS dot field underneath, which is
 * also what the server paints and what shows before hydration.
 */

const VERT = `#version 300 es
void main() {
  // One oversized triangle. Cheaper than a quad and no index buffer.
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision mediump float;

uniform vec2 u_res;
uniform vec2 u_pointer;
uniform float u_press;
uniform float u_time;
uniform float u_axis;
uniform vec2 u_gateNear;
uniform vec2 u_gateFar;
uniform vec4 u_gateTop;
uniform vec4 u_band;
uniform vec3 u_ink;
uniform vec3 u_accent;

out vec4 outColor;

/* Screen angle. 15 degrees is the printer's answer to why a halftone does not
   read as a grid: no row of dots lines up with an edge of the page. */
const float ANGLE = 0.2618;
const float CELL = 9.0;
const float REACH = 190.0;

/* The ink field, always moving. Three sine layers sampled through a warped
   coordinate — the warp is what makes it drift and fold instead of pulsing in
   place, which is the difference between a fluid and a blinking gradient. */
float flow(vec2 p, float t) {
  vec2 q = p * 0.0072;
  q += 0.55 * vec2(sin(q.y * 1.6 - t * 0.20), cos(q.x * 1.4 + t * 0.17));

  float a = sin(q.x * 1.9 + t * 0.24);
  float b = sin((q.x + q.y) * 1.3 - t * 0.19);
  float c = sin(q.y * 2.4 - t * 0.27 + a * 0.9);

  return clamp(0.5 + 0.42 * (a * 0.5 + b * 0.34 + c * 0.32), 0.0, 1.0);
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);

  /* The legibility mask, in two ramps. "along" runs across the page and
     "across" runs down it, swapped once the layout stacks. u_band is the strip
     the copy actually occupies, measured on the client and eased at both
     edges; inside it the ink waits for u_gateNear, which starts a gutter past
     the last glyph, and outside it for u_gateFar, which starts far further in
     and reaches solid ink sooner. The result wraps the type: zero over every
     word, full ink in the clear sheet above and below it. */
  float along = mix(frag.x, frag.y, u_axis) / mix(u_res.x, u_res.y, u_axis);
  float across = mix(frag.y, frag.x, u_axis) / mix(u_res.y, u_res.x, u_axis);

  float inBand = smoothstep(u_band.x, u_band.y, across)
               * (1.0 - smoothstep(u_band.z, u_band.w, across));
  vec2 gate = mix(u_gateFar, u_gateNear, inBand);
  float mask = smoothstep(gate.x, gate.y, along);

  /* Stacked, the sheet is clear at both ends of the measure, so there is a
     second ramp above the copy running the other way: ink from the top trim
     down to a gutter over the first line. u_gateTop.xy is the short lead-in off
     the header hairline, u_gateTop.zw the fade out over the copy. Set behind
     the origin on the wide axis, both ends read as one and the term is zero. */
  float top = smoothstep(u_gateTop.x, u_gateTop.y, along)
            * (1.0 - smoothstep(u_gateTop.z, u_gateTop.w, along));
  mask = max(mask, top);

  vec2 toPointer = frag - u_pointer;
  float d = length(toPointer);
  float focus = u_press * exp(-(d * d) / (2.0 * REACH * REACH));

  /* The cursor does not paint — it stirs. Sampling the field through a small
     rotation around the pointer drags the flow into a curl that follows the
     hand, and the field keeps moving on its own the moment it is let go. */
  vec2 stirred = frag + vec2(-toPointer.y, toPointer.x) * focus * 0.22;
  float field = flow(stirred, u_time);

  /* Away from the pointer the field reads as a soft tide across the sheet.
     Under it, the same field is pushed through a steeper curve, so the dots
     separate into resolved ink instead of just growing: the cursor brings the
     image into focus rather than adding weight to it. */
  float drifting = 0.17 + 0.38 * field;
  float resolved = 0.10 + 0.78 * smoothstep(0.34, 0.74, field);
  float coverage = clamp(mix(drifting, resolved, focus), 0.0, 1.0) * mask;

  float c = cos(ANGLE);
  float s = sin(ANGLE);
  vec2 screened = mat2(c, -s, s, c) * frag;
  vec2 cell = mod(screened, CELL) - CELL * 0.5;

  float radius = coverage * CELL * 0.52;
  float dot = 1.0 - smoothstep(radius - 0.75, radius + 0.75, length(cell));

  /* A dot of radius zero is still half a pixel of ink at the centre of its
     cell, because the antialiasing window straddles it. Left alone that put a
     speck grid across the whole masked sheet — under the copy included. Fade
     the dot out with the coverage that made it and the cleared sheet is
     actually clear. */
  dot *= smoothstep(0.0, 0.06, coverage);

  vec3 ink = mix(u_ink, u_accent, clamp(focus * 1.4, 0.0, 0.78));
  outColor = vec4(ink, dot * 0.5);
}`;

const DPR_CAP = 1.5;
const PIXEL_BUDGET = 1_400_000;
const STACKED_BELOW = 1024;

/** Clear air between the last glyph and the first dot, in CSS pixels. */
const GUTTER = 26;
/** How far past the copy the band's edge eases out, in CSS pixels. */
const SOFTNESS = 88;
/** How far the stacked ramps travel between clear sheet and full ink. */
const RAMP = 0.09;
/** Clear air under the header hairline before the top band reaches full ink. */
const LEAD = 28;
/** Scroll speed, in CSS pixels a second, that buys the whole flow boost. */
const SCROLL_FULL = 1400;
/** How much faster the field drifts at that speed. */
const SCROLL_BOOST = 2.2;

/**
 * The envelope of every word in the hero, relative to the canvas, in CSS
 * pixels. Glyph rects rather than element boxes: the h1 is 896px wide and its
 * longest line is 777, and the mask is worth 119px of extra ink.
 *
 * Buttons contribute their whole box — a pill's fill is as much a surface the
 * shader must stay off as the label inside it.
 */
function measureCopy(root: HTMLElement, host: HTMLElement) {
  const frame = host.getBoundingClientRect();
  let right = Number.NEGATIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  const take = (box: DOMRect) => {
    if (box.width === 0 || box.height === 0) return;
    right = Math.max(right, box.right - frame.left);
    top = Math.min(top, box.top - frame.top);
    bottom = Math.max(bottom, box.bottom - frame.top);
  };

  const range = document.createRange();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    for (const line of Array.from(range.getClientRects())) take(line as DOMRect);
  }
  for (const control of Array.from(root.querySelectorAll("a, button"))) {
    take(control.getBoundingClientRect());
  }

  if (right === Number.NEGATIVE_INFINITY) return null;
  return { right, top, bottom };
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function readColor(element: HTMLElement, property: string, fallback: [number, number, number]) {
  const raw = getComputedStyle(element).getPropertyValue(property).trim();
  const hex = raw.startsWith("#") ? raw.slice(1) : "";
  if (hex.length !== 6) return fallback;
  const value = Number.parseInt(hex, 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ] as [number, number, number];
}

/** `idle` paints nothing at all — see the note on the render below. */
type SurfaceState = "idle" | "live" | "still";

export function HeroHalftone({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<SurfaceState>("idle");

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    /** No WebGL2, or a shader that would not build: fall back to the still
        screen rather than leaving the sheet bare. */
    const giveUp = () => setState("still");

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return giveUp();

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = vert && frag ? gl.createProgram() : null;
    if (!vert || !frag || !program) return giveUp();

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return giveUp();

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uRes = uniform("u_res");
    const uPointer = uniform("u_pointer");
    const uPress = uniform("u_press");
    const uTime = uniform("u_time");
    const uAxis = uniform("u_axis");
    const uGateNear = uniform("u_gateNear");
    const uGateFar = uniform("u_gateFar");
    const uGateTop = uniform("u_gateTop");
    const uBand = uniform("u_band");

    gl.uniform3fv(uniform("u_ink"), readColor(host, "--ink", [0.06, 0.09, 0.16]));
    gl.uniform3fv(uniform("u_accent"), readColor(host, "--accent", [0.06, 0.46, 0.43]));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover)");

    // The layer itself is `pointer-events-none` — it must never eat a click on
    // the CTA sitting over it — so the band above it is what hears the pointer,
    // and it is also where the copy the mask has to clear lives.
    const surface = host.parentElement ?? host;

    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, press: 0, want: 0 };
    let frame = 0;
    let inView = true;
    let announced = false;

    /** Accumulated shader time, started at the ambient midpoint. */
    let clock = 4.9;
    let last = 0;
    let scrollY = window.scrollY;
    let boost = 0;
    let touching = false;
    let disposed = false;

    /** Widest, highest and lowest the copy has been since the last resize. */
    let copy = { right: 0, top: Number.POSITIVE_INFINITY, bottom: 0 };

    /**
     * Fold a fresh measurement into the envelope and re-cut the mask. It is
     * a union rather than a replacement because FadeIn reveals the hero with a
     * 28px translate: measured mid-reveal the copy sits low, measured after it
     * sits where it lands, and the ink has to clear both.
     */
    const gate = () => {
      if (disposed) return;
      const seen = measureCopy(surface, host);
      if (seen) {
        copy = {
          right: Math.max(copy.right, seen.right),
          top: Math.min(copy.top, seen.top),
          bottom: Math.max(copy.bottom, seen.bottom),
        };
      }
      if (!Number.isFinite(copy.top)) return;

      if (width < STACKED_BELOW) {
        // Stacked: the copy runs the full measure, so the clear sheet is the
        // strip under the last button and the strip over the eyebrow. Two
        // ramps, both vertical, no band.
        const nearStart = Math.min(0.94, (copy.bottom + GUTTER) / height);
        // Full ink fast: the strip under the buttons is short, and a fade
        // across all of it would read as a smudge rather than a printed band.
        const nearFull = Math.min(0.995, nearStart + RAMP);
        gl.uniform2f(uGateNear, nearStart, nearFull);
        gl.uniform2f(uGateFar, nearStart, nearFull);
        // The top band ends a gutter over the first line and eases out across
        // the same distance the bottom one eases in, so the two read as one
        // screen interrupted by the type rather than two different plates. The
        // lead-in keeps the ink off the header hairline: the band starts under
        // the rule instead of butting it.
        const topEnd = Math.max(0.02, (copy.top - GUTTER) / height);
        const lead = Math.min(LEAD / height, topEnd * 0.5);
        gl.uniform4f(uGateTop, 0, lead, Math.max(lead, topEnd - RAMP), topEnd);
        gl.uniform4f(uBand, -2, -1, 2, 3);
        return;
      }

      const nearStart = Math.min(0.94, (copy.right + GUTTER) / width);
      const farStart = Math.max(0.08, nearStart - 0.34);
      // Wide, the clear sheet is beside the copy, not over it: the ramp runs
      // across the page and the top band has nothing to do. Both its edges sit
      // behind the origin, so the term cancels to zero everywhere.
      gl.uniform4f(uGateTop, -3, -2.9, -2.1, -2);
      gl.uniform2f(uGateNear, nearStart, Math.min(0.995, nearStart + 0.17));
      gl.uniform2f(uGateFar, farStart, Math.min(0.98, farStart + 0.42));
      gl.uniform4f(
        uBand,
        (copy.top - SOFTNESS) / height,
        (copy.top - 12) / height,
        (copy.bottom + 12) / height,
        (copy.bottom + SOFTNESS) / height,
      );
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      // Cap the backing store twice: by device ratio, then by total pixels, so
      // a 4K window does not quietly ask for eight megapixels a frame.
      let ratio = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const pixels = width * height * ratio * ratio;
      if (pixels > PIXEL_BUDGET) ratio *= Math.sqrt(PIXEL_BUDGET / pixels);

      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      // The shader works in CSS pixels; the scale lives in the resolution it
      // is handed, so the dot pitch is the same size on every display.
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uAxis, width < STACKED_BELOW ? 1 : 0);

      copy = { right: 0, top: Number.POSITIVE_INFINITY, bottom: 0 };
      gate();
    };

    const drawAt = (seconds: number) => {
      const scale = canvas.width / Math.max(width, 1);
      gl.uniform1f(uTime, seconds);
      gl.uniform2f(uPointer, pointer.x * scale, pointer.y * scale);
      gl.uniform1f(uPress, pointer.press);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // Announced on the first frame that exists, never before it: the dots
      // arrive already moving instead of sitting there as a printed grid
      // waiting for the shader to catch up.
      if (!announced) {
        announced = true;
        setState("live");
      }
    };

    const loop = (now: number) => {
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;

      pointer.x += (pointer.targetX - pointer.x) * 0.14;
      pointer.y += (pointer.targetY - pointer.y) * 0.14;
      pointer.press += (pointer.want - pointer.press) * 0.08;

      /* Scroll drags the tide. The page's own speed, read by diffing rather
         than by listening, feeds the clock — so the field runs with the scroll
         and coasts back to its ambient pace a moment after it stops. Quick to
         answer, slow to let go, and capped: a current, not a jolt. */
      const offset = window.scrollY;
      const speed = Math.abs(offset - scrollY) / delta;
      scrollY = offset;
      const target = Math.min(speed / SCROLL_FULL, 1);
      boost += (target - boost) * (target > boost ? 0.3 : 0.045);

      clock += delta * (1 + boost * SCROLL_BOOST);
      drawAt(clock);
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      // Nothing moved while the loop was parked, so the next frame measures
      // its delta from itself rather than from whenever it last ran.
      last = 0;
      scrollY = window.scrollY;
    };

    const run = () => {
      if (frame || reduced.matches || !inView || document.hidden) return;
      frame = requestAnimationFrame(loop);
    };

    const stir = (event: PointerEvent, snap: boolean) => {
      const rect = host.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      if (snap || pointer.press === 0) {
        // First contact: start the dots where the hand is rather than sweeping
        // a wave across the whole plate from the last known point.
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
      pointer.want = 1;
    };

    const onPointerMove = (event: PointerEvent) => {
      // A finger only stirs while it is down; a cursor stirs whenever it is
      // over the band, and only on hardware that has one.
      if (event.pointerType === "mouse") {
        if (hover.matches) stir(event, false);
        return;
      }
      if (touching) stir(event, false);
    };

    // Touch, and touch only: a mouse press must not double as first contact.
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      touching = true;
      stir(event, true);
    };

    // `pointercancel` is the one that matters most here — it is what the
    // browser sends when it takes the gesture back to scroll the page, which
    // is exactly when the stir should let go and the scroll boost take over.
    const onPointerUp = () => {
      touching = false;
      pointer.want = 0;
    };

    const onPointerLeave = () => {
      touching = false;
      pointer.want = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else run();
    };

    resize();

    if (reduced.matches) {
      // One frame, taken from the middle of the flow. Nothing else runs: no
      // loop, no listeners, no pointer. `drawAt` announces it, so the screen
      // still fades in rather than being there from the start. The one thing
      // that can redraw it is the fonts landing, and only because a wider line
      // of type is a wider strip the ink has to stay off.
      drawAt(4.9);
      document.fonts?.ready.then(() => {
        if (disposed) return;
        gate();
        drawAt(4.9);
      }).catch(() => {});
      const onReducedChange = () => window.location.reload();
      reduced.addEventListener("change", onReducedChange);
      return () => {
        disposed = true;
        reduced.removeEventListener("change", onReducedChange);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!frame) drawAt(clock);
    });
    resizeObserver.observe(host);

    // The copy is measured again once the reveal has landed and once the web
    // fonts have, because both move the line the ink has to clear.
    const settle = window.setTimeout(gate, 1000);
    document.fonts?.ready.then(gate).catch(() => {});

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) run();
        else stop();
      },
      { rootMargin: "120px" },
    );
    viewObserver.observe(host);

    // All passive, all on the band: a finger on this hero scrolls the page
    // exactly as fast as a finger anywhere else on it.
    surface.addEventListener("pointermove", onPointerMove, { passive: true });
    surface.addEventListener("pointerdown", onPointerDown, { passive: true });
    surface.addEventListener("pointerup", onPointerUp, { passive: true });
    surface.addEventListener("pointercancel", onPointerUp, { passive: true });
    surface.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    run();

    return () => {
      disposed = true;
      stop();
      window.clearTimeout(settle);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerdown", onPointerDown);
      surface.removeEventListener("pointerup", onPointerUp);
      surface.removeEventListener("pointercancel", onPointerUp);
      surface.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`hero-halftone pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      data-state={state}
      ref={hostRef}
    >
      {/* Nothing is painted until there is something to see. The server and the
          first client render both leave the sheet blank, because a printed grid
          of dots sitting still is exactly what this surface is not; the canvas
          fades in on its own first frame. The still screen is only for a
          browser that cannot run the shader at all. */}
      <div className="hero-halftone-static" />
      <canvas className="hero-halftone-canvas" ref={canvasRef} />
    </div>
  );
}
