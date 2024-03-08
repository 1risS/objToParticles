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
  //float size = 10.0;

  // intento llevarlos abajo
  // pos = pos + 0.05 * vec3(0.,0.,0.);

  // efecto caótico burbujeante para la cara 
   pos = pos + 0.0005 * vec3(snoise(pos*250.0 + u_time*2.8), snoise(pos*200. + u_time*2.5), snoise(pos*100. + u_time*1.75));


  // control del movimiento con el audio
  pos = pos + 0.001 * vec3(sin( pos.x* (u_frequency *3.5 + 20.0)), sin( pos.y* (u_frequency *3.5 + 20.0)), sin( pos.z* (u_frequency *3.5 + 20.0)));

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_PointSize = (size * u_size / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
