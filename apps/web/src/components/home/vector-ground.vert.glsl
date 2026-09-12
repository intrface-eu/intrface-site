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
uniform vec2 u_volBox;
uniform mat3 u_rotMark, u_rotLand, u_rotSwell;
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
vec2 tangentTo(vec2 pos) {
  vec2 to = u_pointer - pos;
  float d = max(length(to), 0.001);
  vec2 n = to / d;
  vec2 dir = vec2(-n.y, n.x);
  return rot2(dir, 0.07 * sin(u_time * 0.6 + a_seed * 6.2832 + pos.x * 0.003));
}
// The field's own direction: facing the pointer while the hand moves, and
// once it is still each line turns at its own rate, a share of them in 45°
// steps, so the ground looks busy computing rather than waiting.
vec2 fieldDir(vec2 pos) {
  vec2 t = tangentTo(pos);
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
  vec2 fb = isX ? vec2(0.7071, -0.7071) : tangentTo(l.pos);
  l.dir = projectDir(p, d, scale, l.pos, fb);
  float persp = F / (F - p.z);
  float depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
  l.len = scale * (isX ? 0.030 : 0.052) * persp;
  l.w = u_lineW * (isX ? 1.8 : 0.75 + 0.55 * depth);
  l.alpha = isX ? 0.95 : mix(0.2, 0.86, depth);
  l.color = isX ? u_ink : mix(u_ink, u_accent, step(a_seed, 0.11));
  return l;
}

Line state(int k) {
  Line l;
  vec2 pn = u_pointer / u_res - 0.5;
  bool isX = a_mode > 0.5;
  bool keep = fract(a_seed * 13.7) < KEEP_SHARE;
  float bg = 1.0;
  // The X's lines are taken from the pool that joins the plate, never from
  // the share kept behind it.
  if (keep && !isX && (k == 1 || k == 3)) { k = 0; bg = 0.7; }
  if (k == 0) {
    // A sparse field through depth: perspective, scroll parallax, pointer parallax.
    vec3 p = a_vol;
    float depthN = (p.z - VOL_Z_MIN) / VOL_Z_RANGE;
    p.y = mod(p.y - u_scroll / u_markScale * 0.35 + u_volBox.y, 2.0 * u_volBox.y) - u_volBox.y;
    p.xy -= pn * 0.22 * (depthN + 0.15);
    l.pos = project(p, u_markScale);
    l.dir = fieldDir(l.pos);
    l.pos = weigh(l.pos, depthN, l.dir);
    float persp = F / (F - p.z);
    l.len = u_lineLen * persp;
    l.w = u_lineW * (0.7 + 0.5 * depthN);
    l.alpha = mix(0.09, 0.4, depthN) * bg;
    l.color = u_ink;
  } else if (k == 1) {
    l = plate(a_mark, a_markDir, u_rotMark, u_markScale, false);
  } else if (k == 2) {
    // A swell: a rolling sheet seen from above, lines lying across it. Scroll
    // carries the sheet toward the eye; the pointer lifts it where it hovers.
    float zr = VOL_Z_RANGE;
    float sx = a_vol.x;
    float sn = mod((a_vol.z - VOL_Z_MIN) / zr + u_scroll / u_markScale * 0.11, 1.0);
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
    for (int i = 0; i < MAX_RECTS; i++) {
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
    l = plate(a_land, a_landDir, u_rotLand, u_landScale, isX);
  }
  return l;
}

/* The scroll sequence: swell under the hero, Istria in the first band, the
   sparse field between, the mark in the second band. */
int kindFor(int s) {
  return s == 0 ? 2 : s == 1 ? 3 : s == 2 ? 0 : 1;
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
  Line a = state(kindFor(s));
  Line b = state(kindFor(s + 1));
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
