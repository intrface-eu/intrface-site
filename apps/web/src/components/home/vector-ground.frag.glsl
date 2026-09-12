#version 300 es
precision mediump float;
uniform vec3 u_spot;
flat in float v_spot;
flat in float v_halfLen;
flat in float v_radius;
in vec2 v_local;
in vec4 v_color;
out vec4 o;
void main() {
  vec2 q = vec2(max(abs(v_local.x) - v_halfLen, 0.0), v_local.y);
  float a = (1.0 - smoothstep(v_radius - 0.5, v_radius + 0.5, length(q))) * v_color.a;
  // The one red on the site: carried per instance, taken all the way only
  // where a line has arrived at the X on Vrsar.
  vec3 c = mix(v_color.rgb, u_spot, v_spot);
  o = vec4(c * a, a);
}
