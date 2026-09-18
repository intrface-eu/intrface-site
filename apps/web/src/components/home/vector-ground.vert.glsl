#version 300 es
precision highp float;
layout(location=0) in vec3 a_mark;
layout(location=1) in vec3 a_markDir;
layout(location=2) in vec3 a_land;
layout(location=3) in vec3 a_landDir;
layout(location=4) in vec3 a_vol;
layout(location=5) in float a_seed;
layout(location=6) in float a_mode;

uniform vec2 u_res;
uniform vec2 u_pointer;
uniform float u_cols, u_rows, u_cell, u_gridAngle;
uniform float u_stage, u_time, u_lineW, u_lineLen, u_gridAlpha;
uniform float u_markScale, u_landScale, u_scroll;
uniform mat3 u_rotMark, u_rotLand;
uniform vec4 u_rects[MAX_RECTS];
uniform vec2 u_rectInfo[MAX_RECTS];
uniform int u_rectN;
uniform vec3 u_paper;
uniform float u_idle;
uniform vec3 u_ink, u_accent;

flat out float v_spot;
flat out float v_halfLen;
flat out float v_radius;
out vec2 v_local;
out vec4 v_color;

const float PI = 3.14159265;
const float F = FOCAL;
const float STAGGER = 0.35;

vec2 rot2(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
vec2 project(vec3 p, float scale) { float k = F / (F - p.z); return vec2(p.x, -p.y) * k * scale + u_res * 0.5; }
// A ray into the hand: the line points straight at the pointer, with a small
// wobble of its own so the field never looks stamped.
vec2 toward(vec2 pos) {
  vec2 to = u_pointer - pos;
  float d = max(length(to), 0.001);
  vec2 n = to / d;
  return rot2(n, 0.07 * sin(u_time * 0.6 + a_seed * 6.2832 + pos.x * 0.003));
}
// The field's own direction: pointing at the pointer while the hand moves, and
// once it is still each line turns at its own rate, a share of them in 45°
// steps, so the ground looks busy computing rather than waiting.
vec2 fieldDir(vec2 pos) {
  vec2 t = toward(pos);
  float r1 = fract(a_seed * 31.7);
  float r2 = fract(a_seed * 57.3);
  float rate = mix(0.25, 1.4, r1) * (r2 < 0.5 ? -1.0 : 1.0);
  float ang = a_seed * 6.2832 + u_time * rate;
  if (r2 > 0.72) ang = floor(ang / 0.7854) * 0.7854;
  vec2 spin = vec2(cos(ang), sin(ang));
  if (dot(spin, t) < 0.0) spin = -spin;
  vec2 d = mix(t, spin, u_idle);
  float l = length(d);
  return l > 1e-3 ? d / l : spin;
}
vec2 projectDir(vec3 p, vec3 d, float scale, vec2 pos, vec2 fallback) {
  vec2 dir = project(p + d * 0.02, scale) - pos;
  float l = length(dir);
  return l > 1e-5 ? dir / l : fallback;
}
vec2 unit(vec2 v, vec2 fallback) {
  float l = length(v);
  return l > 1e-4 ? v / l : fallback;
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
  for (int i = 0; i < MAX_RECTS; i++) {
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

// A plate's lines take their direction from the target, never from the
// pointer. `isX` marks the few that draw the X on Vrsar at the top face:
// shorter, heavier, and holding their stroke even where the projection
// degenerates, so the hand never turns them.
Line plate(vec3 target, vec3 tdir, mat3 rot, float scale, bool isX) {
  vec3 p = rot * target;
  vec3 d = rot * tdir;
  Line l;
  l.pos = project(p, scale);
  vec2 fb = isX ? vec2(0.7071, -0.7071) : toward(l.pos);
  l.dir = projectDir(p, d, scale, l.pos, fb);
  float persp = F / (F - p.z);
  float depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
  l.len = scale * (isX ? 0.030 : 0.052) * persp;
  l.w = u_lineW * (isX ? 1.8 : 0.75 + 0.55 * depth);
  l.alpha = isX ? 0.95 : mix(0.2, 0.86, depth);
  l.color = isX ? u_ink : mix(u_ink, u_accent, step(a_seed, 0.11));
  return l;
}

// The screen point a line of the flat fields starts from: its grid vertex,
// nudged by its own jitter, pushed out from the middle by its depth and
// carried a little by the hand, so the field still reads through depth.
vec2 flatPos(vec2 gridPos, float depthN, vec2 pn, float spread, float travel) {
  vec2 c = u_res * 0.5;
  return c + (gridPos + a_vol.xy - c) * mix(1.0, spread, depthN) - pn * travel * depthN;
}

Line state(int k, vec2 gridPos) {
  Line l;
  vec2 pn = u_pointer / u_res - 0.5;
  bool isX = a_mode > 0.5;
  bool keep = fract(a_seed * 13.7) < KEEP_SHARE;
  float bg = 1.0;
  float depthN = (a_vol.z - VOL_Z_MIN) / VOL_Z_RANGE;
  float m = min(u_res.x, u_res.y);
  // The X's lines are taken from the pool that joins the plate, never from
  // the share kept behind it.
  if (keep && !isX && (k == 1 || k == 3)) { k = 0; bg = 0.7; }
  if (k == 0) {
    // A contour map: a slow height map runs under the page and each line lies
    // along the isoline through its own point, so the lines gather into bands
    // and thin out between them. Scroll shifts the map; the hand raises a hill
    // under it, and the contours ring the hand.
    vec2 pos = flatPos(gridPos, depthN, pn, 1.18, 30.0);
    vec2 q = pos / m * 2.1;
    q.y -= u_scroll / m * 0.42;
    float t = u_time * 0.11;
    float a1 = q.x + 0.6 * q.y + t;
    float a2 = 1.35 * q.y - 0.5 * q.x - 0.8 * t;
    float a3 = (q.x - q.y) * 0.85 + 0.45 * t;
    float a4 = (q.x + q.y) * 1.9 - 0.3 * t;
    float h = 0.9 * sin(a1) + 0.7 * sin(a2) + 0.45 * sin(a3) + 0.2 * sin(a4);
    vec2 g = vec2(0.9 * cos(a1), 0.54 * cos(a1))
           + vec2(-0.35 * cos(a2), 0.945 * cos(a2))
           + vec2(0.3825 * cos(a3), -0.3825 * cos(a3))
           + vec2(0.38 * cos(a4), 0.38 * cos(a4));
    // The hill under the hand.
    float R = 0.62;
    vec2 rel = (pos - u_pointer) / m * 2.1 / R;
    float bump = 2.4 * exp(-dot(rel, rel));
    h += bump;
    g += bump * -2.0 * rel / R;
    vec2 rad = fieldDir(pos);
    l.dir = unit(vec2(-g.y, g.x), rad);
    // Right under the hand the rule still holds: the line turns into it.
    float bend = exp(-length(u_pointer - pos) / (0.14 * m));
    if (dot(l.dir, rad) < 0.0) l.dir = -l.dir;
    l.dir = unit(mix(l.dir, rad, bend), rad);
    l.pos = pos;
    l.pos = weigh(l.pos, depthN, l.dir);
    // Strong on a contour level, faint between them.
    float f = fract(h);
    float ridge = 1.0 - smoothstep(0.0, 0.22, min(f, 1.0 - f));
    l.len = u_lineLen * (0.9 + 0.5 * depthN) * (0.9 + 0.35 * ridge);
    l.w = u_lineW * (0.6 + 0.5 * depthN) * (0.85 + 0.6 * ridge);
    l.alpha = mix(0.06, 0.42, ridge) * mix(0.7, 1.15, depthN) * bg;
    l.color = u_ink;
  } else if (k == 1) {
    l = plate(a_mark, a_markDir, u_rotMark, u_markScale, false);
  } else if (k == 2) {
    // A current under the hero: a slow streaming field, every line lying along
    // its streamline. The flow comes from the curl of a drifting potential, so
    // it never pours into a point, and near the hand it turns into the hand.
    vec2 pos = flatPos(gridPos, depthN, pn, 1.22, 26.0);
    vec2 q = pos / m * 2.6;
    q.y -= u_scroll / m * 0.55;
    float t = u_time * 0.15;
    float w1 = 1.05 * q.x + t;
    float w2 = 1.3 * q.y - 0.72 * t;
    float w3 = (q.x + q.y) * 0.78 + 0.4 * t;
    float w4 = (q.x - q.y) * 1.6 - 0.5 * t;
    float psi = 0.55 * sin(w1) + 0.45 * sin(w2) + 0.3 * sin(w3) + 0.18 * sin(w4);
    float dx = 0.5775 * cos(w1) + 0.234 * cos(w3) + 0.288 * cos(w4);
    float dy = 0.585 * cos(w2) + 0.234 * cos(w3) - 0.288 * cos(w4);
    vec2 rad = fieldDir(pos);
    l.dir = unit(vec2(dy, -dx), rad);
    if (dot(l.dir, rad) < 0.0) l.dir = -l.dir;
    float bend = exp(-length(u_pointer - pos) / (0.20 * m));
    l.dir = unit(mix(l.dir, rad, bend), rad);
    l.pos = pos;
    l.pos = weigh(l.pos, depthN, l.dir);
    // Light and dark bands: the potential sets how much of the ink a line takes.
    float band = 0.5 + 0.5 * sin(psi * 2.2);
    l.len = u_lineLen * (1.25 + 0.5 * depthN);
    l.w = u_lineW * (0.65 + 0.45 * depthN) * (0.8 + 0.5 * band);
    l.alpha = mix(0.07, 0.34, band) * mix(0.7, 1.2, depthN) * bg;
    l.color = u_ink;
  } else {
    l = plate(a_land, a_landDir, u_rotLand, u_landScale, isX);
  }
  return l;
}

/* The scroll sequence: the contour map under the hero, Istria in the first
   band, the contour map again between, the mark at the close's edge. The
   current (kind 2) is kept but no longer on the sequence: the two gatherings
   are variation enough, and one field style either side of them reads as
   one page. */
int kindFor(int s) {
  return s == 1 ? 3 : s == 2 ? 0 : s == 3 ? 1 : 0;
}

void main() {
  int id = gl_InstanceID;
  int cols = int(u_cols);
  vec2 cell = vec2(float(id % cols), float(id / cols));
  vec2 local = (cell - vec2(u_cols - 1.0, u_rows - 1.0) * 0.5) * u_cell;
  vec2 gridPos = rot2(local, u_gridAngle) + u_res * 0.5;

  float stage = clamp(u_stage, 0.0, 3.0);
  int s = int(min(floor(stage), 2.0));
  float f = stage - float(s);
  Line a = state(kindFor(s), gridPos);
  Line b = state(kindFor(s + 1), gridPos);
  // The X sets out late, so it lands after the coast has settled.
  float st = a_mode > 0.5 ? mix(0.52, 0.72, a_seed) : STAGGER * a_seed;
  float t = smoothstep(0.0, 1.0, clamp((f - st) / (1.0 - st), 0.0, 1.0));

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
  float island = 0.0;
  for (int i = 0; i < MAX_RECTS; i++) {
    if (i >= u_rectN) break;
    float d = rectSd(pos, u_rects[i]);
    vec2 info = u_rectInfo[i];
    float inside = 1.0 - smoothstep(-1.0, 1.0, d);
    if (info.x == 2.0) ink = max(ink, inside);
    else if (info.x == 4.0) { island = max(island, inside); quiet = max(quiet, info.y * inside); }
    else quiet = max(quiet, info.y * (1.0 - smoothstep(0.0, 44.0, d)));
  }
  ink *= 1.0 - island;
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
  // How far this line has arrived at the X: the fragment shader reads it and
  // takes the stroke to the one red on the site.
  v_spot = a_mode * (s == 0 ? t : s == 1 ? 1.0 - t : 0.0);
  v_color = vec4(color, alpha);
}
