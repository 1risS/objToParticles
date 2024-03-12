import * as THREE from 'three';
import { faceMaterial } from './modelLoaders.js';

//intento de control externo de la opacidad del shader:
// faceMaterial.uniforms.u_opacity.value = 0.5;

// console.log('esto es dentro del fadeInFace', faceMaterial)

// let opacity = faceMaterial.uniforms.u_opacity.value;

let fadingIn = true;
let stepFade = 0.0005;

export function resetFadingInFace() {
    fadingIn = true;
}

export function updateFaceOpacity(opacity) {
    if (fadingIn) {
        opacity.value += stepFade;
        if (opacity.value >= 0.1) {
            opacity.value = 0.1;
            fadingIn = false;
        }
    }
}
