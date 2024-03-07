attribute vec3 color;
attribute float size;
varying vec3 vColor;

uniform float u_time;
uniform float u_frequency;
uniform float u_size;

#include "./utils/noise"

void main() {
  vColor = color;

  vec3 pos = position;
//   float size = 10.0;

  // Alteration: Displace the points based on a sinewave
  // pos = pos + 0.01 * sin(10.0 * pos.x + u_time);
  // size = size * 0.5;

  // cambiar el perlin noise por otro menos flameante o probar cambiar los valores 

  // primer valor: amplitud // ultimo valor: velocidad
  pos = pos + 0.0005 * vec3(snoise(pos*250.0 + u_time*2.8), snoise(pos*200. + u_time*2.5), snoise(pos*100. + u_time*1.75));


  pos = pos + 0.001 * vec3(sin( pos.x* (u_frequency *3.5 + 20.0)), sin( pos.y* (u_frequency *3.5 + 20.0)), sin( pos.z* (u_frequency *3.5 + 20.0)));

  // pos = vec3(rand(pos.xy), rand(pos.yz), rand(pos.xz));

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_PointSize = (size * u_size / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
