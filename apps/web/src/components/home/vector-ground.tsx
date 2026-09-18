"use client";

import { useEffect, useRef } from "react";
import { ISTRIA_OUTLINE } from "@/lib/site/istria-outline";
import vertSource from "./vector-ground.vert.glsl";
import FRAG from "./vector-ground.frag.glsl";

/**
 * The live ground: a field of short lines, one per grid vertex, each pointing
 * at the pointer, so the whole field answers the hand as rays into it.
 * Scrolling moves the field through four states, keyed to the two places the
 * page leaves for it (`data-ground-key`): a band of open paper, and the edge
 * the contact close joins the footer on. The kinds, as the shader names them:
 *
 *   0  contour — a slow height map read as a topographic chart: each line lies
 *                along its isoline, strong on a contour level and faint
 *                between, and the hand raises a hill the contours ring
 *   1  mark    — most lines gather into the intrface mark as a hatched plate;
 *                the rest stay in the field behind it
 *   2  flow    — a slow current: each line lies along a streamline, the
 *                potential sets light and dark bands, and near the hand the
 *                current turns into it
 *   3  land    — the last gathering, into the outline of Istria, again with a
 *                share of lines kept behind it
 *
 * The home page runs them in the order contour (hero), land (first band),
 * contour again, mark (the close's edge); `kindFor` in the vertex shader maps
 * the scroll stage to the kind. The flow kind is still in the shader but off
 * the sequence: the field keeps one style and only the two gatherings vary it. The land band stands between the evidence and the
 * products; the mark is keyed from the bottom edge of the contact close
 * instead of a band of its own, so the close shows the contour map the way
 * What we build does and the mark is gathered by the time the footer holds the
 * screen. A page with only the land band, as about has, stops at contour:
 * `stageFor` caps the stage at 2 when there is no second key.
 *
 * Everything is one instanced draw: a quad per line, the grid position derived
 * from the instance index, the mark and land targets, a per-line jitter and a
 * per-line depth read from a per-instance buffer, and the current state
 * blended in the vertex shader with a per-line stagger. The main thread does
 * nothing per frame but write a few uniforms.
 *
 * The land carries one mark: a red X on Vrsar, drawn by a few dozen lines
 * taken from the pool that would otherwise join the coast. They set out late,
 * so the X lands after the coast has settled, and once the X is there the
 * component sets `data-ground-x` on the land band — the two phrases beside it
 * are CSS from that attribute on. The plate is fixed to the screen while the
 * band scrolls past it, so the loop also writes the X's live screen point as
 * one transform on the layer the phrases sit on, and they ride the map instead
 * of the document.
 *
 * Where WebGL2 is missing, or the reader prefers reduced motion, the CSS dot
 * ground under this canvas stays as it is and this component never activates:
 * no X, no phrases.
 */

const CELL = 18;
const GRID_ANGLE = (15 * Math.PI) / 180;
const DPR_CAP = 2;
const GRID_ALPHA = 0.3;
const LINE_WIDTH = 1;
const IDLE_MS = 2000;
const SETTLE = 6.5;
const STAGE_EASE = 9;
const MARK_DEPTH = 0.16;
// Share of lines that never join a plate: they stay in the depth field behind
// it, so a gathering never flattens the ground.
const KEEP_SHARE = 0.35;
// Content blocks the ground answers to, at most this many on screen at once.
const MAX_RECTS = 12;
const PAPER = [0xf5 / 255, 0xf1 / 255, 0xeb / 255];
const LAND_DEPTH = 0.07;
const FOCAL = 3.4;
const VOL_Z_MIN = -2.2;
const VOL_Z_MAX = 0.5;

const INK = [0x0f / 255, 0x17 / 255, 0x29 / 255];
const ACCENT = [0x0f / 255, 0x76 / 255, 0x6e / 255];
// The one red on the site: a print red for the X on Vrsar, and nothing else.
const SPOT = [0xb9 / 255, 0x1c / 255, 0x1c / 255];

// Vrsar, on the north lip of the Lim channel mouth, in the outline's own
// space; the X is snapped from here onto the smoothed coast so it sits on the
// line rather than inside the hatch.
const VRSAR: [number, number] = [-0.595, -0.115];
// Lines the X takes, and its half-stroke: the plate spans 2 units, so this
// draws strokes of about 5% of it.
const X_LINES = 48;
const X_SPAN = 0.05;
// The X sits just proud of the plate's top face.
const X_LIFT = 0.006;
// Stage thresholds at which the X reads as arrived, and as gone again.
const X_IN: [number, number] = [0.965, 1.05];
const X_OUT: [number, number] = [0.86, 1.4];

// The constants above reach the vertex shader as macros, spliced in after
// `#version`. The `.glsl` files are minified at build time (tools/glsl-loader.cjs).
const DEFINES = [
  `#define MAX_RECTS ${MAX_RECTS}`,
  `#define FOCAL ${FOCAL.toFixed(2)}`,
  `#define KEEP_SHARE ${KEEP_SHARE.toFixed(2)}`,
  `#define VOL_Z_MIN ${VOL_Z_MIN.toFixed(2)}`,
  `#define VOL_Z_RANGE ${(VOL_Z_MAX - VOL_Z_MIN).toFixed(2)}`,
].join("\n");
const VERT = vertSource.replace(/^(#version[^\n]*\n)/, `$1${DEFINES}\n`);

type Sample = { p: [number, number, number]; t: [number, number, number] };
type Body = { c: [number, number]; r: number };

/* The mark: a square with a unit disc cut from each corner, plus the small
   star in its top-left bay, in the icon's own proportions (1000-unit box). */
const MARK_BODIES: Body[] = [
  { c: [0, 0], r: 1 },
  { c: [(202.17 - 500) / 500, -(221.48 - 500) / 500], r: 0.25 },
];
const MARK_ARCS: [number, number, number, number][] = [
  [1, 1, Math.PI, 1.5 * Math.PI],
  [-1, 1, 1.5 * Math.PI, 2 * Math.PI],
  [-1, -1, 0, 0.5 * Math.PI],
  [1, -1, 0.5 * Math.PI, Math.PI],
];

function markOutline(scale: number, ds: number): Sample[] {
  const out: Sample[] = [];
  const perArc = Math.max(4, Math.round(((Math.PI / 2) * scale) / ds));
  for (const [cx, cy, a0, a1] of MARK_ARCS) {
    for (let i = 0; i < perArc; i++) {
      const th = a0 + ((a1 - a0) * (i + 0.5)) / perArc;
      out.push({
        p: [(cx + Math.cos(th)) * scale, (cy + Math.sin(th)) * scale, 0],
        t: [-Math.sin(th), Math.cos(th), 0],
      });
    }
  }
  return out;
}

/* Istria's outline, smoothed so the hatching follows the coast rather than
   every corner of the simplified polygon, then resampled at even spacing. */
let smoothedLand: number[] | null = null;
function smoothLand(): number[] {
  if (smoothedLand) return smoothedLand;
  const n = ISTRIA_OUTLINE.length / 2;
  const out = new Array<number>(n * 2);
  const reach = 1;
  for (let i = 0; i < n; i++) {
    let x = 0;
    let y = 0;
    for (let k = -reach; k <= reach; k++) {
      const j = (((i + k) % n) + n) % n;
      x += ISTRIA_OUTLINE[j * 2];
      y += ISTRIA_OUTLINE[j * 2 + 1];
    }
    out[i * 2] = x / (2 * reach + 1);
    out[i * 2 + 1] = y / (2 * reach + 1);
  }
  smoothedLand = out;
  return out;
}
/* The nearest point on the smoothed coast to a point in outline space. The X
   is snapped this way so it lands on the outer contour the plate draws. */
function snapToCoast([qx, qy]: [number, number]): [number, number] {
  const pts = smoothLand();
  const n = pts.length / 2;
  let best: [number, number] = [qx, qy];
  let bestD = Infinity;
  for (let i = 0; i < n; i++) {
    const ax = pts[i * 2];
    const ay = pts[i * 2 + 1];
    const bx = pts[((i + 1) % n) * 2];
    const by = pts[((i + 1) % n) * 2 + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) continue;
    const t = Math.min(1, Math.max(0, ((qx - ax) * dx + (qy - ay) * dy) / l2));
    const px = ax + dx * t;
    const py = ay + dy * t;
    const d = Math.hypot(px - qx, py - qy);
    if (d < bestD) {
      bestD = d;
      best = [px, py];
    }
  }
  return best;
}

/* The X: two strokes crossing on the coast at Vrsar, each a short run of lines
   lying along it with a little hand in the spacing. */
let xPoint: [number, number, number] | null = null;
/* Where the X sits in the plate's own space: on the coast, just proud of the
   top face. The loop projects this to keep the words on it. */
function xAnchor(): [number, number, number] {
  if (!xPoint) {
    const [ax, ay] = snapToCoast(VRSAR);
    xPoint = [ax, ay, LAND_DEPTH + X_LIFT];
  }
  return xPoint;
}

let xPool: Sample[] | null = null;
function xTargets(): Sample[] {
  if (xPool) return xPool;
  const [ax, ay] = xAnchor();
  const out: Sample[] = [];
  const per = X_LINES / 2;
  const tilt = -0.1;
  for (let stroke = 0; stroke < 2; stroke++) {
    const a = tilt + (stroke === 0 ? Math.PI / 4 : (3 * Math.PI) / 4);
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    for (let k = 0; k < per; k++) {
      const u = (((k + 0.5) / per) * 2 - 1) * X_SPAN;
      const off = (hash(k, 40 + stroke) - 0.5) * X_SPAN * 0.12;
      out.push({
        p: [ax + dx * u - dy * off, ay + dy * u + dx * off, LAND_DEPTH + X_LIFT],
        t: [dx, dy, 0],
      });
    }
  }
  xPool = out;
  return out;
}

function landOutline(scale: number, ds: number): Sample[] {
  const out: Sample[] = [];
  const pts = smoothLand();
  const n = pts.length / 2;
  let carry = 0;
  for (let i = 0; i < n; i++) {
    const ax = pts[i * 2] * scale;
    const ay = pts[i * 2 + 1] * scale;
    const bx = pts[((i + 1) % n) * 2] * scale;
    const by = pts[((i + 1) % n) * 2 + 1] * scale;
    const len = Math.hypot(bx - ax, by - ay);
    if (len === 0) continue;
    const tx = (bx - ax) / len;
    const ty = (by - ay) / len;
    let s = carry;
    while (s < len) {
      out.push({ p: [ax + tx * s, ay + ty * s, 0], t: [tx, ty, 0] });
      s += ds;
    }
    carry = s - len;
  }
  return out;
}

/* A hatched plate: contours drawn inward on both faces, the outline stepped
   through the thickness for the walls. Both the mark and the land use it. */
function plate(outline: (scale: number, ds: number) => Sample[], body: Body, depth: number, ds: number, walls = 5): Sample[] {
  const pool: Sample[] = [];
  const place = (s: Sample, z: number): Sample => ({
    p: [body.c[0] + s.p[0] * body.r, body.c[1] + s.p[1] * body.r, z * body.r],
    t: s.t,
  });
  const contours = [1, 0.84, 0.68, 0.52, 0.36, 0.2];
  for (const z of [depth, -depth]) {
    for (const s of contours) for (const o of outline(s, ds / body.r)) pool.push(place(o, z));
  }
  for (let i = 1; i < walls + 1; i++) {
    const z = -depth + (2 * depth * i) / (walls + 1);
    for (const o of outline(1, ds / body.r)) pool.push(place(o, z));
  }
  return pool;
}

let markPool: Sample[] | null = null;
let landPool: Sample[] | null = null;
function pools() {
  markPool ??= MARK_BODIES.flatMap((body) => plate(markOutline, body, MARK_DEPTH, body.r < 1 ? 0.013 : 0.02));
  landPool ??= plate(landOutline, { c: [0, 0], r: 1 }, LAND_DEPTH, 0.014, 1);
  return { mark: markPool, land: landPool };
}

/* Deterministic per-instance noise, so a resize never reshuffles the field. */
function hash(i: number, salt: number): number {
  let h = (i * 374761393 + salt * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function rotation(yaw: number, pitch: number): Float32Array {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  // Rx(pitch) · Ry(yaw), column-major
  return new Float32Array([cy, sp * sy, -cp * sy, 0, cp, sp, sy, -sp * cy, cp * cy]);
}

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

/* 0…3 from where the ground's two keys sit in the viewport: 1 at the land
   band, 3 once the contact close has gone by. The land band is a viewport of
   open paper and gathers around its centre — whole while that centre is within
   a quarter viewport of the middle, ramping over the 0.6 viewports either side
   of it. The mark's key is an edge instead: the bottom edge of the close,
   where it joins the footer. Nothing gathers while that edge is below the foot
   of the screen, so the close keeps the contour map; the mark is whole by the
   time the edge is a quarter of the way up the screen and the footer holds the
   rest of it. */
function stageFor(first: DOMRect | null, second: DOMRect | null, vh: number): number {
  if (!first) return 0;
  const d1 = (first.top + first.height / 2 - vh / 2) / vh;
  const t1 = smooth((0.85 - Math.abs(d1)) / 0.6);
  let stage = d1 > 0 ? t1 : 2 - t1;
  if (stage >= 2 && second) stage = 3 - smooth((second.top - vh * 0.25) / (vh * 0.75));
  return stage;
}

export function VectorGround() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ground = canvas?.parentElement;
    if (!canvas || !ground) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      res: u("u_res"),
      pointer: u("u_pointer"),
      cols: u("u_cols"),
      rows: u("u_rows"),
      cell: u("u_cell"),
      gridAngle: u("u_gridAngle"),
      stage: u("u_stage"),
      time: u("u_time"),
      lineW: u("u_lineW"),
      lineLen: u("u_lineLen"),
      gridAlpha: u("u_gridAlpha"),
      markScale: u("u_markScale"),
      landScale: u("u_landScale"),
      scroll: u("u_scroll"),
      rotMark: u("u_rotMark"),
      rotLand: u("u_rotLand"),
      rects: u("u_rects"),
      rectInfo: u("u_rectInfo"),
      rectN: u("u_rectN"),
      paper: u("u_paper"),
      idle: u("u_idle"),
    };
    gl.uniform3fv(u("u_ink"), INK);
    gl.uniform3fv(u("u_spot"), SPOT);
    gl.uniform3fv(u("u_accent"), ACCENT);
    gl.uniform3fv(u("u_paper"), PAPER);
    gl.uniform1f(U.cell, CELL);
    gl.uniform1f(U.gridAngle, GRID_ANGLE);
    gl.uniform1f(U.lineLen, CELL * 0.44);
    gl.uniform1f(U.lineW, LINE_WIDTH);
    gl.uniform1f(U.gridAlpha, GRID_ALPHA);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const FLOATS = 17;
    const STRIDE = FLOATS * 4;
    const layout: [number, number, number][] = [
      [0, 3, 0],
      [1, 3, 12],
      [2, 3, 24],
      [3, 3, 36],
      [4, 3, 48],
      [5, 1, 60],
      [6, 1, 64],
    ];
    for (const [loc, size, offset] of layout) {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, STRIDE, offset);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const { mark, land } = pools();
    let width = 0;
    let height = 0;
    let count = 0;
    let markEdge: HTMLElement | null = null;
    let landBand: HTMLElement | null = null;
    let landScale = 0;
    // The X where the plate rests, as an offset from the middle of the screen,
    // and the band's own middle: the difference between them is what the two
    // phrases have to be moved by to stay on the plate.
    let nomX = 0;
    let nomY = 0;
    let bandCX = 0;
    let bandCY = 0;
    let bandOn = false;
    let lastTX = NaN;
    let lastTY = NaN;

    /* The X's point in screen pixels, through the same projection the shader
       uses: rotate, divide by depth, scale, and put the middle of the screen
       at the middle of the plate. */
    const projectAnchor = (r: Float32Array): [number, number] => {
      const [ax, ay, az] = xAnchor();
      const x = r[0] * ax + r[3] * ay + r[6] * az;
      const y = r[1] * ax + r[4] * ay + r[7] * az;
      const z = r[2] * ax + r[5] * ay + r[8] * az;
      const k = FOCAL / (FOCAL - z);
      return [x * k * landScale + width / 2, -y * k * landScale + height / 2];
    };

    const rebuild = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // The box is set here as well as in CSS: a canvas with no CSS size takes
      // its backing size, which at 2x would be twice the viewport.
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      const span = Math.hypot(width, height);
      const cols = Math.ceil(span / CELL) + 2;
      const rows = cols;
      count = cols * rows;
      const markScale = 0.3 * Math.min(width, height);
      landScale = 0.38 * Math.min(width, height);

      // The X's lines, spread evenly through the grid so they converge from
      // everywhere, and never taken from the share kept behind the plate.
      const xt = xTargets();
      const xFor = new Map<number, Sample>();
      const kept = (i: number) => (hash(i, 6) * 13.7) % 1 < KEEP_SHARE;
      const step = count / xt.length;
      for (let k = 0; k < xt.length; k++) {
        let i = Math.min(count - 1, Math.round(k * step + step * 0.5));
        for (let guard = 0; (kept(i) || xFor.has(i)) && guard < count; guard++) i = (i + 1) % count;
        xFor.set(i, xt[k]);
      }

      const data = new Float32Array(count * FLOATS);
      for (let i = 0; i < count; i++) {
        const o = i * FLOATS;
        const m = mark[Math.floor(hash(i, 1) * mark.length)];
        const x = xFor.get(i);
        const l = x ?? land[Math.floor(hash(i, 2) * land.length)];
        data[o] = m.p[0];
        data[o + 1] = m.p[1];
        data[o + 2] = m.p[2];
        data[o + 3] = m.t[0];
        data[o + 4] = m.t[1];
        data[o + 5] = m.t[2];
        data[o + 6] = l.p[0];
        data[o + 7] = l.p[1];
        data[o + 8] = l.p[2];
        data[o + 9] = l.t[0];
        data[o + 10] = l.t[1];
        data[o + 11] = l.t[2];
        // A jitter in pixels, so the flat fields never read as a lattice, and
        // the line's own depth.
        data[o + 12] = (hash(i, 3) * 2 - 1) * CELL * 0.5;
        data[o + 13] = (hash(i, 4) * 2 - 1) * CELL * 0.5;
        data[o + 14] = VOL_Z_MIN + hash(i, 5) * (VOL_Z_MAX - VOL_Z_MIN);
        data[o + 15] = hash(i, 6);
        data[o + 16] = x ? 1 : 0;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.uniform2f(U.res, width, height);
      gl.uniform1f(U.cols, cols);
      gl.uniform1f(U.rows, rows);
      gl.uniform1f(U.markScale, markScale);
      gl.uniform1f(U.landScale, landScale);

      landBand = document.querySelector<HTMLElement>('[data-ground-key="land"]');
      markEdge = document.querySelector<HTMLElement>('[data-ground-key="mark"]');

      // Where the phrases are anchored: the X with the plate at rest, no hand
      // on it. The loop writes the difference from here as the layer's
      // transform, so the anchor itself never has to move.
      const rest = projectAnchor(rotation(0, 0.55));
      nomX = rest[0] - width / 2;
      nomY = rest[1] - height / 2;
      lastTX = NaN;
      lastTY = NaN;
      landBand?.style.setProperty("--x-dx", `${(-nomX).toFixed(1)}px`);
      landBand?.style.setProperty("--x-dy", `${nomY.toFixed(1)}px`);
    };

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let tx = px;
    let ty = py;
    let lastMove = -Infinity;
    const onPointer = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      lastMove = performance.now();
    };

    // The blocks the ground answers to. Copy is marked `data-ground-quiet`
    // (lines fade under it), ink slabs `data-ground-ink` (lines turn paper
    // inside them). Read again on every scroll and resize; blocks off screen
    // are skipped, so the shader loop stays short.
    // Kinds: copy (0) fades the lines within a margin, `soft` copy less so;
    // an ink slab (2) turns them paper-coloured; a paper island (4) inside an
    // ink slab keeps them ink and fades them a little.
    const kindOf = (el: HTMLElement): [number, number] => {
      if (el.hasAttribute("data-ground-ink")) return [2, 0];
      // Half strength on a paper island: the mark plate reads across the
      // contact form plane, and the fields still stand clear of it.
      if (el.hasAttribute("data-ground-paper")) return [4, 0.5];
      return [0, el.dataset.groundQuiet === "soft" ? 0.55 : 0.88];
    };
    const blocks = Array.from(
      document.querySelectorAll<HTMLElement>("[data-ground-quiet], [data-ground-ink], [data-ground-paper]"),
    ).map((el) => ({ el, info: kindOf(el) }));
    const root = document.documentElement;
    const rects = new Float32Array(MAX_RECTS * 4);
    const rectInfo = new Float32Array(MAX_RECTS * 2);
    const readRects = () => {
      let n = 0;
      for (const { el, info } of blocks) {
        if (n === MAX_RECTS) break;
        const r = el.getBoundingClientRect();
        if (r.bottom < -240 || r.top > height + 240 || r.width === 0) continue;
        rects[n * 4] = r.left;
        rects[n * 4 + 1] = r.top;
        rects[n * 4 + 2] = r.width;
        rects[n * 4 + 3] = r.height;
        rectInfo[n * 2] = info[0];
        rectInfo[n * 2 + 1] = info[1];
        n++;
      }
      gl.uniform4fv(U.rects, rects);
      gl.uniform2fv(U.rectInfo, rectInfo);
      gl.uniform1i(U.rectN, n);
    };

    let dirty = true;
    let xShown = false;
    let idleK = coarse ? 1 : 0;
    let stage = 0;
    let target = 0;
    let frame = 0;
    let running = false;
    let last = 0;
    const t0 = performance.now();
    const markDirty = () => {
      dirty = true;
    };
    let resizeFrame = 0;
    const onResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        rebuild();
        dirty = true;
      });
    };

    const tick = (now: number) => {
      frame = 0;
      if (!running) return;
      const dt = Math.min(0.05, (last ? now - last : 16) / 1000);
      last = now;
      const time = (now - t0) / 1000;

      if (dirty) {
        dirty = false;
        readRects();
        // One read of the band per scroll, used for both the stage and the
        // travel; the loop itself never touches layout.
        const lr = landBand?.getBoundingClientRect() ?? null;
        bandCX = lr ? lr.left + lr.width / 2 : 0;
        bandCY = lr ? lr.top + lr.height / 2 : 0;
        bandOn = !!lr && lr.bottom > -240 && lr.top < height + 240;
        target = stageFor(lr, markEdge?.getBoundingClientRect() ?? null, height);
      }
      stage += (target - stage) * (1 - Math.exp(-STAGE_EASE * dt));
      // One attribute write when the X arrives and one when it goes: the two
      // phrases beside it are CSS from here on.
      const [lo, hi] = xShown ? X_OUT : X_IN;
      const shown = stage > lo && stage < hi;
      if (shown !== xShown) {
        xShown = shown;
        landBand?.toggleAttribute("data-ground-x", shown);
      }

      const idle = coarse || now - lastMove > IDLE_MS;
      idleK += ((idle ? 1 : 0) - idleK) * (1 - Math.exp(-2.2 * dt));
      const gx = tx;
      const gy = ty;
      const e = 1 - Math.exp(-SETTLE * dt);
      px += (gx - px) * e;
      py += (gy - py) * e;
      const nx = px / width - 0.5;
      const ny = py / height - 0.5;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.pointer, px, py);
      gl.uniform1f(U.stage, stage);
      gl.uniform1f(U.time, time);
      gl.uniform1f(U.idle, idleK);
      gl.uniform1f(U.scroll, window.scrollY);
      gl.uniformMatrix3fv(U.rotMark, false, rotation(0.5 * Math.sin(time * 0.32) + nx * 0.8, 0.24 - ny * 0.6));
      const rotLand = rotation(0.22 * Math.sin(time * 0.25) + nx * 0.6, 0.55 - ny * 0.5);
      gl.uniformMatrix3fv(U.rotLand, false, rotLand);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);

      // The plate is fixed to the screen while the band scrolls past it, so
      // the words would slide off the map. The layer they sit on is moved back
      // by exactly that difference — the X's live screen point less the point
      // the band anchors them at — which also carries the plate's slow turn
      // and the hand's. One property write, and only when it changes.
      if (landBand && bandOn) {
        const at = projectAnchor(rotLand);
        const travelX = Math.round(at[0] - (bandCX + nomX));
        const travelY = Math.round(at[1] - (bandCY + nomY));
        if (travelX !== lastTX || travelY !== lastTY) {
          lastTX = travelX;
          lastTY = travelY;
          landBand.style.setProperty("--ground-travel-x", `${travelX}px`);
          landBand.style.setProperty("--ground-travel-y", `${travelY}px`);
        }
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onLost = (event: Event) => {
      event.preventDefault();
      stop();
      ground.removeAttribute("data-ground-mode");
      root.removeAttribute("data-ground-open");
      landBand?.removeAttribute("data-ground-x");
      landBand?.style.removeProperty("--ground-travel-x");
      landBand?.style.removeProperty("--ground-travel-y");
    };

    rebuild();
    ground.setAttribute("data-ground-mode", "vector");
    root.setAttribute("data-ground-open", "");
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);
    if (!document.hidden) start();

    return () => {
      stop();
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", markDirty);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      ground.removeAttribute("data-ground-mode");
      root.removeAttribute("data-ground-open");
      landBand?.removeAttribute("data-ground-x");
      landBand?.style.removeProperty("--ground-travel-x");
      landBand?.style.removeProperty("--ground-travel-y");
      landBand?.style.removeProperty("--x-dx");
      landBand?.style.removeProperty("--x-dy");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="ground-canvas" />;
}
