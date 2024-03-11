import * as THREE from 'three';
import { faceMaterial } from './modelLoaders.js';

//intento de control externo de la opacidad del shader:
// faceMaterial.uniforms.u_opacity.value = 0.5;

console.log('esto es dentro del fadeInFace', faceMaterial)

// let opacity = faceMaterial.uniforms.u_opacity.value;

let opacity = 0.0;
let fadingIn = false;
let stepFade = 0.001;

export function fadingInFace() {
    if (fadingIn === true) {
        opacity += stepFade;
        if (opacity >= 0.1) {
            opacity = 0.1;
            fadingIn = false;
        }
    }
}