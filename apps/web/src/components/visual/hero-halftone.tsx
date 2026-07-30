"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's halftone screen, live.
 *
 * The site's whole visual argument is print: separations, registration, an
 * unprinted plate. This is that screen as a surface you can push on — the
 * pointer acts like pressure, so the dots under it open up and the ink runs
 * toward the accent, then closes again behind you. Nothing else on the page
 * moves on its own.
 *
 * Three rules it has to keep, all of them learned the hard way:
 *
 * 1. No dot behind a word. `u_mask` ramps coverage from zero across the column
 *    the type occupies to full at the trim edge — horizontally on desktop,
 *    vertically once the layout stacks. DESIGN.md forbids an animated surface
 *    behind body text and this is how the hero honours it: there is no surface
 *    there to animate.
 * 2. No frame drawn that nobody sees. An IntersectionObserver stops the loop
 *    when the band scrolls away, and `visibilitychange` stops it with the tab.
 *    A GPU redrawing a megapixel 60 times a second under someone reading the
 *    contact form is the exact fault this component was built to avoid.
 * 3. No per-frame React. The pointer lands in a ref, the loop reads it, the
 *    component renders once.
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
uniform vec3 u_ink;
uniform vec3 u_accent;

out vec4 outColor;

/* Screen angle. 15 degrees is the printer's answer to why a halftone does not
   read as a grid: no row of dots lines up with an edge of the page. */
const float ANGLE = 0.2618;
const float CELL = 9.0;
const float REACH = 165.0;

float ambient(vec2 p, float t) {
  return 0.5 + 0.5 * sin(p.x * 0.011 + t * 0.32 + sin(p.y * 0.009 - t * 0.21) * 1.6);
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);

  /* The legibility mask. Zero where the type sits, so the screen begins after
     the measure ends and resolves into solid ink at the edge of the sheet. */
  float mask = mix(
    smoothstep(0.42, 0.88, frag.x / u_res.x),
    smoothstep(0.46, 0.99, frag.y / u_res.y),
    u_axis
  );

  float d = distance(frag, u_pointer);
  float press = u_press * exp(-(d * d) / (2.0 * REACH * REACH));

  float coverage = clamp(0.14 + 0.28 * ambient(frag, u_time) + 0.66 * press, 0.0, 1.0) * mask;

  float c = cos(ANGLE);
  float s = sin(ANGLE);
  vec2 screened = mat2(c, -s, s, c) * frag;
  vec2 cell = mod(screened, CELL) - CELL * 0.5;

  float radius = coverage * CELL * 0.52;
  float dot = 1.0 - smoothstep(radius - 0.75, radius + 0.75, length(cell));

  vec3 ink = mix(u_ink, u_accent, clamp(press * 1.5, 0.0, 0.8));
  outColor = vec4(ink, dot * 0.5);
}`;

/** CSS pixels the pointer must travel before the loop bothers waking up. */
const DPR_CAP = 1.5;
const PIXEL_BUDGET = 1_400_000;
const STACKED_BELOW = 1024;

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

export function HeroHalftone({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = vert && frag ? gl.createProgram() : null;
    if (!vert || !frag || !program) return;

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const uRes = uniform("u_res");
    const uPointer = uniform("u_pointer");
    const uPress = uniform("u_press");
    const uTime = uniform("u_time");
    const uAxis = uniform("u_axis");

    gl.uniform3fv(uniform("u_ink"), readColor(host, "--ink", [0.06, 0.09, 0.16]));
    gl.uniform3fv(uniform("u_accent"), readColor(host, "--accent", [0.06, 0.46, 0.43]));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover)");

    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999, press: 0, want: 0 };
    let frame = 0;
    let start = 0;
    let inView = true;

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
    };

    const drawAt = (seconds: number) => {
      const scale = canvas.width / Math.max(width, 1);
      gl.uniform1f(uTime, seconds);
      gl.uniform2f(uPointer, pointer.x * scale, pointer.y * scale);
      gl.uniform1f(uPress, pointer.press);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      if (!start) start = now;
      pointer.x += (pointer.targetX - pointer.x) * 0.14;
      pointer.y += (pointer.targetY - pointer.y) * 0.14;
      pointer.press += (pointer.want - pointer.press) * 0.08;
      drawAt((now - start) / 1000);
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const run = () => {
      if (frame || reduced.matches || !inView || document.hidden) return;
      frame = requestAnimationFrame(loop);
    };

    // The layer itself is `pointer-events-none` — it must never eat a click on
    // the CTA sitting over it — so the band above it is what hears the pointer.
    const surface = host.parentElement ?? host;

    const onPointerMove = (event: PointerEvent) => {
      if (!hover.matches) return;
      const rect = host.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      if (pointer.press === 0) {
        // First contact: start the dots where the cursor is rather than
        // sweeping a wave across the whole plate from the last known point.
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
      pointer.want = 1;
    };

    const onPointerLeave = () => {
      pointer.want = 0;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else run();
    };

    resize();
    setLive(true);

    if (reduced.matches) {
      // One frame, at the middle of the ambient wave. Nothing else runs: no
      // loop, no listeners, no pointer.
      drawAt(4.9);
      const onReducedChange = () => window.location.reload();
      reduced.addEventListener("change", onReducedChange);
      return () => reduced.removeEventListener("change", onReducedChange);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!frame) drawAt(4.9);
    });
    resizeObserver.observe(host);

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) run();
        else stop();
      },
      { rootMargin: "120px" },
    );
    viewObserver.observe(host);

    surface.addEventListener("pointermove", onPointerMove, { passive: true });
    surface.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    run();

    return () => {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`hero-halftone pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      data-live={live ? "true" : "false"}
      ref={hostRef}
    >
      {/* Painted on the server and by anything without WebGL2. The canvas fades
          over it rather than replacing it, so there is no flash of bare paper
          between first paint and the first frame. */}
      <div className="hero-halftone-static" />
      <canvas className="hero-halftone-canvas" ref={canvasRef} />
    </div>
  );
}
