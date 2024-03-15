import * as THREE from 'three';
import { Noise } from 'noisejs';
const noise = new Noise(Math.random());


export function applyRandom(bubblesArray) {
    const randomtrength = 0.0005;
    bubblesArray.forEach(bubble => {
        const noise = new THREE.Vector3(
            (Math.random() - 0.5) * randomtrength,
            (Math.random() - 0.5) * randomtrength,
            (Math.random() - 0.5) * randomtrength
        );

        bubble.position.add(noise);
    });

}

// explicar como funciona esto del noise a iris
// iris: tratar de usar el metodo usado con noise para sparkling
// edu: mover particulas con efecto onda

export function applyNoise(bubbles) {
    const strenght = 0.001;
    const amp = 0.00015;

    const time = Date.now() * 0.00051;
    bubbles.forEach((bubble, index) => {
        // const x = bubble.position.x
        // const y = bubble.position.y
        // const z = bubble.position.z
        // const noiseX = noise.simplex3(x * strenght, y * strenght, time) * strenght;
        // const noiseY = noise.simplex3(x * strenght, z * strenght, time + 1) * strenght;
        // const noiseZ = noise.simplex3(y * strenght, z * strenght, time + 2) * strenght;
        const noiseX = noise.simplex3(time + index, time, time) * amp;
        const noiseY = noise.simplex3(time, time + index, time) * amp;
        const noiseZ = noise.simplex3(time, time, time + index) * amp;

        bubble.position.x += noiseX;
        bubble.position.y += noiseY;
        bubble.position.z += noiseZ;
    });
}

export function applyNoise2(bubbles) {
    const strenght = 0.001;
    const amp = 0.00015;

    const time = Date.now() * 0.0001;
    bubbles.forEach((bubble, index) => {
        const x = bubble.position.x
        const y = bubble.position.y
        const z = bubble.position.z
        const noiseX = noise.simplex3(index, y * strenght, time) * strenght;
        const noiseY = noise.simplex3(x * strenght, index, time + 1) * strenght;
        const noiseZ = noise.simplex3(y * strenght, z * strenght, index) * strenght;

        bubble.position.x += noiseX;
        bubble.position.y += noiseY;
        bubble.position.z += noiseZ;
    });
}
