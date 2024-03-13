import * as THREE from 'three';
import { faceMaterial } from './Bubbles.js';

//intento de control externo de la opacidad del shader:
// faceMaterial.uniforms.u_opacity.value = 0.5;

// console.log('esto es dentro del fadeInFace', faceMaterial)

// let opacity = faceMaterial.uniforms.u_opacity.value;

let fadingIn = true;
let stepFade = 0.5 // 0.0005;

function easeInSine(x) {
    return 1 - Math.cos((x * Math.PI) / 2);
}

export function resetFadingInFace() {
    fadingIn = true;
}

export function updateFaceOpacity(opacity) {
    opacity.value += easeInSine(stepFade);
    if (fadingIn) {
        opacity.value += stepFade;
        if (opacity.value >= 0.5) {
            opacity.value = 0.5;
            fadingIn = false;
        }
    }
}
