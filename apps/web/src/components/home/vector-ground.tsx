"use client";

import { useEffect, useRef } from "react";
import { ISTRIA_OUTLINE } from "@/lib/site/istria-outline";

/**
 * The live ground: a field of short lines, one per grid vertex, each turned
 * perpendicular to the pointer, so the whole field answers the hand as rings.
 * Scrolling moves the field through four states, keyed to two bands of open
 * paper the page leaves for it (`data-ground-key`):
 *
 *   0  volume — a sparse field through depth: perspective, scroll parallax
 *               and pointer parallax
 *   1  mark   — most lines gather into the intrface mark as a hatched plate;
 *               the rest stay in the depth field behind it
 *   2  swell  — a rolling sheet seen from above, carried toward the eye by
 *               scroll and lifted under the pointer
 *   3  land   — the last gathering, into the outline of Istria, again with a
 *               share of lines kept behind it
 *
 * Everything is one instanced draw: a quad per line, the grid position derived
 * from the instance index, the mark, volume and land targets read from a
 * per-instance buffer, and the current state blended in the vertex shader
 * with a per-line stagger. The main thread does nothing per frame but write a
 * few uniforms.
 *
 * Where WebGL2 is missing, or the reader prefers reduced motion, the CSS dot
 * ground under this canvas stays as it is and this component never activates.
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

const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec3 a_mark;
layout(location=1) in vec3 a_markDir;
layout(location=2) in vec3 a_land;
layout(location=3) in vec3 a_landDir;
layout(location=4) in vec3 a_vol;
layout(location=5) in float a_seed;

uniform vec2 u_res;
uniform vec2 u_pointer;
uniform float u_cols, u_rows, u_cell, u_gridAngle;
uniform float u_stage, u_time, u_lineW, u_lineLen, u_gridAlpha;
uniform float u_markScale, u_landScale, u_scroll;
uniform vec2 u_volBox;
uniform mat3 u_rotMark, u_rotLand, u_rotSwell;
uniform vec4 u_rects[${MAX_RECTS}];
uniform vec2 u_rectInfo[${MAX_RECTS}];
uniform int u_rectN;
uniform vec3 u_paper;
uniform vec3 u_ink, u_accent;

flat out float v_halfLen;
flat out float v_radius;
out vec2 v_local;
out vec4 v_color;

const float PI = 3.14159265;
const float F = ${FOCAL.toFixed(2)};
const float STAGGER = 0.35;

vec2 rot2(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
vec2 project(vec3 p, float scale) { float k = F / (F - p.z); return vec2(p.x, -p.y) * k * scale + u_res * 0.5; }
vec2 tangentTo(vec2 pos) {
  vec2 to = u_pointer - pos;
  float d = max(length(to), 0.001);
  vec2 n = to / d;
  vec2 dir = vec2(-n.y, n.x);
  return rot2(dir, 0.07 * sin(u_time * 0.6 + a_seed * 6.2832 + pos.x * 0.003));
}
vec2 projectDir(vec3 p, vec3 d, float scale, vec2 pos, vec2 fallback) {
  vec2 dir = project(p + d * 0.02, scale) - pos;
  float l = length(dir);
  return l > 1e-5 ? dir / l : fallback;
}

float rectSd(vec2 p, vec4 r) {
  vec2 q = abs(p - r.xy - r.zw * 0.5) - r.zw * 0.5;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
}

// Content weight, in screen space: a block pulls nearby lines in and turns
// them along its edges, more for the near lines, so a block scrolling through
// the field drags a wake with it.
vec2 weigh(vec2 pos, float depthN, inout vec2 dir) {
  vec2 acc = vec2(0.0);
  vec2 tdir = dir;
  for (int i = 0; i < ${MAX_RECTS}; i++) {
    if (i >= u_rectN) break;
    vec4 r = u_rects[i];
    vec2 nearest = clamp(pos, r.xy, r.xy + r.zw);
    vec2 away = pos - nearest;
    float d = length(away);
    if (d < 1e-3) continue;
    float R = 0.3 * sqrt(r.z * r.w) + 50.0;
    float f = exp(-d / R);
    vec2 n = away / d;
    acc -= n * f * 0.32 * R * (0.4 + 0.8 * depthN);
    vec2 tang = vec2(-n.y, n.x);
    if (dot(tang, dir) < 0.0) tang = -tang;
    tdir = mix(tdir, tang, f * 0.9);
  }
  dir = normalize(tdir);
  return pos + acc;
}

struct Line { vec2 pos; vec2 dir; float len; float w; float alpha; vec3 color; };

Line plate(vec3 target, vec3 tdir, mat3 rot, float scale) {
  vec3 p = rot * target;
  vec3 d = rot * tdir;
  Line l;
  l.pos = project(p, scale);
  vec2 fb = tangentTo(l.pos);
  l.dir = projectDir(p, d, scale, l.pos, fb);
  float persp = F / (F - p.z);
  float depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
  l.len = scale * 0.052 * persp;
  l.w = u_lineW * (0.75 + 0.55 * depth);
  l.alpha = mix(0.2, 0.86, depth);
  l.color = mix(u_ink, u_accent, step(a_seed, 0.11));
  return l;
}

Line state(int k) {
  Line l;
  vec2 pn = u_pointer / u_res - 0.5;
  bool keep = fract(a_seed * 13.7) < ${KEEP_SHARE.toFixed(2)};
  float bg = 1.0;
  if (keep && (k == 1 || k == 3)) { k = 0; bg = 0.7; }
  if (k == 0) {
    // A sparse field through depth: perspective, scroll parallax, pointer parallax.
    vec3 p = a_vol;
    float depthN = (p.z - ${VOL_Z_MIN.toFixed(2)}) / ${(VOL_Z_MAX - VOL_Z_MIN).toFixed(2)};
    p.y = mod(p.y - u_scroll / u_markScale * 0.35 + u_volBox.y, 2.0 * u_volBox.y) - u_volBox.y;
    p.xy -= pn * 0.22 * (depthN + 0.15);
    l.pos = project(p, u_markScale);
    l.dir = tangentTo(l.pos);
    l.pos = weigh(l.pos, depthN, l.dir);
    float persp = F / (F - p.z);
    l.len = u_lineLen * persp;
    l.w = u_lineW * (0.7 + 0.5 * depthN);
    l.alpha = mix(0.09, 0.4, depthN) * bg;
    l.color = u_ink;
  } else if (k == 1) {
    l = plate(a_mark, a_markDir, u_rotMark, u_markScale);
  } else if (k == 2) {
    // A swell: a rolling sheet seen from above, lines lying across it. Scroll
    // carries the sheet toward the eye; the pointer lifts it where it hovers.
    float zr = ${(VOL_Z_MAX - VOL_Z_MIN).toFixed(2)};
    float sx = a_vol.x;
    float sn = mod((a_vol.z - ${VOL_Z_MIN.toFixed(2)}) / zr + u_scroll / u_markScale * 0.11, 1.0);
    float ss = mix(-4.2, 1.4, sn);
    float ph = u_time * 0.45;
    float k1 = 1.6 * sx + 0.9 * ss + ph;
    float k2 = 2.7 * ss + 0.8 * sx - 0.7 * ph;
    float k3 = 3.1 * sx - 1.3 * ph;
    float h = 0.16 * sin(k1) + 0.10 * sin(k2) + 0.06 * sin(k3);
    float dhdx = 0.256 * cos(k1) + 0.08 * cos(k2) + 0.186 * cos(k3);
    vec2 b = vec2(pn.x * u_volBox.x * 1.3, mix(-4.2, 1.4, 0.5 - pn.y));
    float bx = sx - b.x, bs = ss - b.y;
    float bump = 0.42 * exp(-(bx * bx * 1.4 + bs * bs * 0.9));
    h += bump;
    dhdx += bump * -2.8 * bx;
    // Each block presses the sheet down under itself, by its size.
    for (int i = 0; i < ${MAX_RECTS}; i++) {
      if (i >= u_rectN) break;
      vec4 r = u_rects[i];
      vec2 c = (r.xy + r.zw * 0.5) / u_res - 0.5;
      vec2 rb = vec2(c.x * u_volBox.x * 1.3, mix(-4.2, 1.4, 0.5 - c.y));
      vec2 rad = max(vec2(r.z / u_res.x * u_volBox.x * 1.3, r.w / u_res.y * 2.8), vec2(0.35));
      float rx = (sx - rb.x) / rad.x;
      float rs = (ss - rb.y) / rad.y;
      float e = exp(-(rx * rx + rs * rs) * 0.8);
      float wgt = 0.55 * min(1.0, sqrt(r.z * r.w) / 480.0);
      h -= wgt * e;
      dhdx += wgt * e * 1.6 * rx / rad.x;
    }
    vec3 p = u_rotSwell * vec3(sx, h - 0.4, ss);
    vec3 t = u_rotSwell * normalize(vec3(1.0, dhdx, 0.0));
    l.pos = project(p, u_markScale);
    l.dir = projectDir(p, t, u_markScale, l.pos, tangentTo(l.pos));
    float persp = min(F / max(F - p.z, 0.6), 2.4);
    float near = smoothstep(-4.2, -1.6, ss);
    l.len = u_lineLen * 1.9 * persp;
    l.w = u_lineW * (0.7 + 0.5 * near);
    l.alpha = mix(0.06, 0.42, near) * (1.0 - smoothstep(0.9, 1.4, ss));
    l.color = u_ink;
  } else {
    l = plate(a_land, a_landDir, u_rotLand, u_landScale);
  }
  return l;
}

void main() {
  int id = gl_InstanceID;
  int cols = int(u_cols);
  vec2 cell = vec2(float(id % cols), float(id / cols));
  vec2 local = (cell - vec2(u_cols - 1.0, u_rows - 1.0) * 0.5) * u_cell;
  vec2 gridPos = rot2(local, u_gridAngle) + u_res * 0.5;

  float stage = clamp(u_stage, 0.0, 3.0);
  int k = int(min(floor(stage), 2.0));
  float f = stage - float(k);
  Line a = state(k);
  Line b = state(k + 1);
  float t = smoothstep(0.0, 1.0, clamp((f - STAGGER * a_seed) / (1.0 - STAGGER), 0.0, 1.0));

  vec2 delta = b.pos - a.pos;
  vec2 pos = a.pos + delta * t + vec2(-delta.y, delta.x) * 0.12 * sin(PI * t) * (a_seed - 0.5) * 2.0;
  if (dot(a.dir, b.dir) < 0.0) b.dir = -b.dir;
  vec2 dir = mix(a.dir, b.dir, t);
  float dl = length(dir);
  dir = dl > 1e-3 ? dir / dl : b.dir;
  vec2 perp = vec2(-dir.y, dir.x);
  float len = mix(a.len, b.len, t);
  float w = mix(a.w, b.w, t);
  float alpha = mix(a.alpha, b.alpha, t);
  vec3 color = mix(a.color, b.color, t);

  // The copy sits on the ground: lines go quiet within a margin of any text
  // block, and turn paper-coloured inside an ink slab.
  float quiet = 0.0;
  float ink = 0.0;
  for (int i = 0; i < ${MAX_RECTS}; i++) {
    if (i >= u_rectN) break;
    float d = rectSd(pos, u_rects[i]);
    vec2 info = u_rectInfo[i];
    if (info.x == 2.0) ink = max(ink, 1.0 - smoothstep(-1.0, 1.0, d));
    else quiet = max(quiet, info.y * (1.0 - smoothstep(0.0, 44.0, d)));
  }
  color = mix(color, u_paper, ink);
  alpha *= mix(1.0, 0.8, ink) * (1.0 - quiet);

  int vid = gl_VertexID;
  float along = (vid & 1) == 1 ? 1.0 : -1.0;
  float across = (vid & 2) == 2 ? 1.0 : -1.0;
  float halfLen = len * 0.5;
  float radius = w * 0.5;
  float ex = halfLen + radius + 1.0;
  float ey = radius + 1.0;
  vec2 px = pos + dir * along * ex + perp * across * ey;
  vec2 clip = (px / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_local = vec2(along * ex, across * ey);
  v_halfLen = halfLen;
  v_radius = radius;
  v_color = vec4(color, alpha);
}`;

const FRAG = `#version 300 es
precision mediump float;
flat in float v_halfLen;
flat in float v_radius;
in vec2 v_local;
in vec4 v_color;
out vec4 o;
void main() {
  vec2 q = vec2(max(abs(v_local.x) - v_halfLen, 0.0), v_local.y);
  float a = (1.0 - smoothstep(v_radius - 0.5, v_radius + 0.5, length(q))) * v_color.a;
  o = vec4(v_color.rgb * a, a);
}`;

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

/* 0…3 from where the two open bands sit in the viewport. A band is fully
   gathered while its centre is within a quarter viewport of the middle, and
   ramps over the 0.6 viewports either side of that. */
function stageFor(mark: DOMRect | null, land: DOMRect | null, vh: number): number {
  if (!mark) return 0;
  const dm = (mark.top + mark.height / 2 - vh / 2) / vh;
  const tm = smooth((0.85 - Math.abs(dm)) / 0.6);
  let stage = dm > 0 ? tm : 2 - tm;
  if (stage >= 2 && land) {
    const dl = Math.max(0, (land.top + land.height / 2 - vh / 2) / vh);
    stage = 2 + smooth((0.85 - dl) / 0.6);
  }
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
      volBox: u("u_volBox"),
      rotMark: u("u_rotMark"),
      rotLand: u("u_rotLand"),
      rotSwell: u("u_rotSwell"),
      rects: u("u_rects"),
      rectInfo: u("u_rectInfo"),
      rectN: u("u_rectN"),
      paper: u("u_paper"),
    };
    gl.uniform3fv(u("u_ink"), INK);
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
    const FLOATS = 16;
    const STRIDE = FLOATS * 4;
    const layout: [number, number, number][] = [
      [0, 3, 0],
      [1, 3, 12],
      [2, 3, 24],
      [3, 3, 36],
      [4, 3, 48],
      [5, 1, 60],
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
    let markBand: HTMLElement | null = null;
    let landBand: HTMLElement | null = null;

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
      const landScale = 0.38 * Math.min(width, height);
      // The volume must cover the viewport even for the farthest lines.
      const kFar = FOCAL / (FOCAL - VOL_Z_MIN);
      const box: [number, number] = [(width / 2 / (markScale * kFar)) * 1.15, (height / 2 / (markScale * kFar)) * 1.15];

      const data = new Float32Array(count * FLOATS);
      for (let i = 0; i < count; i++) {
        const o = i * FLOATS;
        const m = mark[Math.floor(hash(i, 1) * mark.length)];
        const l = land[Math.floor(hash(i, 2) * land.length)];
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
        data[o + 12] = (hash(i, 3) * 2 - 1) * box[0];
        data[o + 13] = (hash(i, 4) * 2 - 1) * box[1];
        data[o + 14] = VOL_Z_MIN + hash(i, 5) * (VOL_Z_MAX - VOL_Z_MIN);
        data[o + 15] = hash(i, 6);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.uniform2f(U.res, width, height);
      gl.uniform1f(U.cols, cols);
      gl.uniform1f(U.rows, rows);
      gl.uniform1f(U.markScale, markScale);
      gl.uniform1f(U.landScale, landScale);
      gl.uniform2f(U.volBox, box[0], box[1]);

      markBand = document.querySelector<HTMLElement>('[data-ground-key="mark"]');
      landBand = document.querySelector<HTMLElement>('[data-ground-key="land"]');
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
    const main = ground.closest("main");
    const blocks = Array.from(
      (main ?? document).querySelectorAll<HTMLElement>("[data-ground-quiet], [data-ground-ink]"),
    ).map((el) => ({ el, info: el.hasAttribute("data-ground-ink") ? [2, 0] : [0, 0.82] }));
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
        target = stageFor(
          markBand?.getBoundingClientRect() ?? null,
          landBand?.getBoundingClientRect() ?? null,
          height,
        );
      }
      stage += (target - stage) * (1 - Math.exp(-STAGE_EASE * dt));

      const idle = coarse || now - lastMove > IDLE_MS;
      let gx = tx;
      let gy = ty;
      if (idle) {
        gx = width * (0.5 + 0.34 * Math.sin(time * 0.23));
        gy = height * (0.5 + 0.3 * Math.sin(time * 0.17 + 1.3));
      }
      const e = 1 - Math.exp(-SETTLE * dt);
      px += (gx - px) * e;
      py += (gy - py) * e;
      const nx = px / width - 0.5;
      const ny = py / height - 0.5;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.pointer, px, py);
      gl.uniform1f(U.stage, stage);
      gl.uniform1f(U.time, time);
      gl.uniform1f(U.scroll, window.scrollY);
      gl.uniformMatrix3fv(U.rotMark, false, rotation(0.5 * Math.sin(time * 0.32) + nx * 0.8, 0.24 - ny * 0.6));
      gl.uniformMatrix3fv(U.rotLand, false, rotation(0.22 * Math.sin(time * 0.25) + nx * 0.6, 0.55 - ny * 0.5));
      gl.uniformMatrix3fv(U.rotSwell, false, rotation(nx * 0.25, 0.85 - ny * 0.3));
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);

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
      main?.removeAttribute("data-ground-open");
    };

    rebuild();
    ground.setAttribute("data-ground-mode", "vector");
    main?.setAttribute("data-ground-open", "");
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
      main?.removeAttribute("data-ground-open");
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="ground-canvas" />;
}
