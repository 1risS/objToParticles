varying vec3 vColor;

uniform float u_time;
uniform float u_frequency;
uniform float u_opacity;
uniform sampler2D u_texture;

void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  vec3 color = vColor;

  // Alteration: Add a bit of noise to the color
  // color = color + 0.4 * sin(u_time*2.);

  vec4 tex = texture2D(u_texture, uv);
  gl_FragColor = vec4(color, u_opacity) * tex;

}
