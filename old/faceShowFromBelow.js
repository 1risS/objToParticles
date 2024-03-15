import * as THREE from 'three';

export function initFaceShow(geometry) {
    // originalPoints = mesh.geometry.clone();
    geometry.morphAttributes.position = [];

    const lowPositions = []

    for (let i = 0; i < geometry.attributes.position.count; i += 1) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 0.9 + -1.5;
        const z = Math.random() * 2 - 1;

        lowPositions.push(x, y, z)
    }

    geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(lowPositions, 3);
}





