#version 300 es
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
}
