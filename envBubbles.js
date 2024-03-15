import * as THREE from 'three';

let particleCount, particles, positions;
let _showBubbles = true;

const baseAccel = 0.2;
const accelStep = 0.0005;
const maxAccel = 0.01;
const accel = [];

export function initEnvBubbles(scene, texture) {
    const material = new THREE.PointsMaterial({
        color: 'white',
        size: 0.05,
        map: texture,
        alphaTest: 0.5,
        opacity: 1.0,
    });

    particleCount = 100;
    particles = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 4 + -5.5;
        const z = Math.random() * 8 - 4;

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    for (let i = 0; i < particleCount; i += 1) {
        accel.push(baseAccel);
    }

    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);
}

export function showEnvBubbles() {
    _showBubbles = true
}

export function animateEnvBubbles() {
    if (_showBubbles) {

        if (particles) {

            const positionAttribute = particles.getAttribute('position');
            const array = positionAttribute.array;

            for (let i = 0, j = 0; i < particleCount * 3; i += 3, j += 1) {
                array[i + 1] += Math.random() * accel[j];

                // Reset particles that reach top
                if (array[i + 1] > 3) {
                    const x = Math.random() * 2 - 1;
                    const y = Math.random() * 3 + -3.5;
                    const z = Math.random() * 8 - 4;

                    array[i] = x;
                    array[i + 1] = y;
                    array[i + 2] = z;
                }

                // Increase acceleration (unless reached the maximum)
                if (accel[j] < maxAccel) {
                    accel[j] += accelStep;
                }
            }

            positionAttribute.needsUpdate = true;
        }
    }
}
