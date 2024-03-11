import * as THREE from 'three';

let particleCount, particles, positions;
let _showBubbles = true;

export function initColumnBubbles(scene, pointMaterial) {
    particleCount = 1000;
    particles = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 0.9 + -1.5;
        const z = Math.random() * 2 - 1;

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleSystem = new THREE.Points(particles, pointMaterial);
    scene.add(particleSystem);
}

export function showBubbles() {
    _showBubbles = true
}

export function animateColumnBubbles() {
    if (_showBubbles) {

        if (particles) {

            const positionAttribute = particles.getAttribute('position');
            const array = positionAttribute.array;
            let speed = 1;
            let acceleration = 0.003;
            for (let i = 0; i < particleCount * 3; i += 3) {
                array[i + 1] += Math.random() * 0.004 * speed;
                array[i] += Math.sin(array[i + 1] * Math.random() + i) * 0.003;

                //Reset particles that reach top
                // if (array[i + 1] > 3) {
                //     acceleration = 0.000003;

                //     array[i + 1] = -2;
                //     array[i] = Math.random() * 2 - 1;
                //     array[i + 2] = Math.random() * 2 - 1;
                //     speed = 0.2;
                // }

                // Increase speed for next iteration
                speed += acceleration;
            }

            positionAttribute.needsUpdate = true;
        }
    }
}
