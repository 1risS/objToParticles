import * as THREE from 'three';

let waveParams = {
    isActive: false,
    center: new THREE.Vector3(0, 0, 0),
    amplitude: 0,
    startTime: null,
    speed: 20.31,
};

export function apply(amplitude) {
    waveParams.isActive = true;
    // waveParams.center = center;
    waveParams.amplitude = amplitude;
    waveParams.startTime = Date.now();
}

export function update(bubbles) {
    if (!waveParams.isActive) return;

    const currentTime = Date.now();
    const waveTime = (currentTime - waveParams.startTime) / 1000;

    const waveDuration = 0.941;

    if (waveTime > waveDuration) {
        waveParams.isActive = false;
        return;
    }

    bubbles.forEach(bubble => {
        const distance = bubble.position.distanceTo(waveParams.center) * 20;

        const diminishingAmplitude = waveParams.amplitude * (1 - waveTime / waveDuration);
        let offset = Math.sin(distance - waveTime * waveParams.speed) * diminishingAmplitude;
        if (offset < 0) offset = 0

        bubble.position.y += offset;

        // if (bubble.position.y < 0) {
        if (offset > 0) {

            bubble.material.color.set(0xff0000)
        } else {
            bubble.material.color.set(0xffffff)
        }
    });

}