attribute vec3 color;
attribute float size;
varying vec3 vColor;

uniform float u_time;
uniform float u_frequency;
uniform float u_size;

#include "./utils/noise"

const float amplitude = 0.025;
const float PI = 3.14159;
// acercamiento del punto central del ripple
const vec3 mouth = vec3(0.,0.1,0.5);

void main() {
  vColor = color;

  vec3 pos = position;
  //float size = 10.0;

  // efecto caótico burbujeante para la cara 
  pos = pos + 0.0005 * vec3(snoise(pos*250.0 + u_time*2.8), snoise(pos*200. + u_time*2.5), snoise(pos*100. + u_time*1.75));


  // control del movimiento con el audio
  //pos = pos + 0.009 * vec3(pos.x, pos.y*(0.125*sin(-3.14159*200.0*u_frequency+u_time)), pos.z);

  float distance = length(pos - mouth);
  float y = amplitude*sin(-PI*distance*100. + u_frequency*0.07) * (u_frequency > 0. ? 1. : 0.);

  pos.y += y;
  //pos.x += y;


  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_PointSize = (size * u_size / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
