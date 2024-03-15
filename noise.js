import * as THREE from 'three';

import { createNoise3D } from 'simplex-noise';

const noiseStrength = 0.01;

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

export function applyNoise(bubblesArray) {
    const noiseStrength = 0.001;
    const time = Date.now() * 0.0000001;
    const noise3D = createNoise3D();
    
    bubblesArray.forEach((bubble) => {
        let index = 0
        const noiseX = noise3D(time + index, time, time) * noiseStrength;
        const noiseY = noise3D(time, time + index, time) * noiseStrength;
        const noiseZ = noise3D(time, time, time + index) * noiseStrength;

        const noise = new THREE.Vector3(noiseX, noiseY, noiseZ);
        bubble.position.add(noise);
    });
}