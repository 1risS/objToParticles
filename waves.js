import * as THREE from 'three';

let threshold;
let step = 0.02;
let waveParams = {
    isActive: false,
    center: new THREE.Vector3(0, -0.15, 0),
    amplitude: 0.00575,
    startTime: null,
    speed: 5.31,
};

export function start() {
    waveParams.isActive = true;
    // waveParams.center = center;
    // waveParams.amplitude = amplitude;
    waveParams.startTime = Date.now();
    threshold = 0.4;
}

export function update2(bubbles) {
    if (!waveParams.isActive) return;

    threshold += step;
    bubbles.forEach((bubble, index) => {
        const distance = bubble.position.distanceTo(waveParams.center);
        // if (index == 0) console.log(threshold, distance)
        // const distance = bubble.position.distanceTo(waveParams.center) * 20;
        // const diminishingAmplitude = waveParams.amplitude * (1 - waveTime / waveDuration);
        // let offset = Math.sin(distance * 1.5 - waveTime * waveParams.speed) * diminishingAmplitude;
        // // if (offset < 0) offset = 0
        // bubble.position.z += offset;

        // if (bubble.position.y < 0) {
        // if (offset < 0) {
        let selected = false
        if (distance < threshold) {
            if (distance > (threshold - 0.1)) {
                selected = true
            }
        }

        if (selected) {
            bubble.material.color.set(0xff0000)
            bubble.position.z += 0.005;

        } else {

            bubble.material.color.set(0xffffff)
        }
    });
}

export function update(bubbles) {
    if (!waveParams.isActive) return;

    const currentTime = Date.now();
    const waveTime = (currentTime - waveParams.startTime) / 1000;

    const waveDuration = 2;

    if (waveTime > waveDuration) {
        waveParams.isActive = false;
        bubbles.forEach(bubble => {
            bubble.material.color.set(0xffffff)
        });
        return;
    }

    bubbles.forEach(bubble => {
        const distance = bubble.position.distanceTo(waveParams.center) * 20;

        const diminishingAmplitude = waveParams.amplitude * (1 - waveTime / waveDuration);
        let offset = Math.sin(distance * 1.5 - waveTime * waveParams.speed) * diminishingAmplitude;
        // if (offset < 0) offset = 0

        bubble.position.z += offset;

        // if (bubble.position.y < 0) {
        if (offset < 0) {
            bubble.material.color.set(0xff0000)
        } else {
            bubble.material.color.set(0xffffff)
        }
    });

}