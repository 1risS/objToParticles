import * as THREE from 'three';
// import { initAudio } from './audioListener';


let time = 0
let waveOrigin = new THREE.Vector3(0, 0, 0); // Punto de origen de la onda
// let waveStrength = 0.05; // Fuerza de la onda

let originalPoints

export function setOriginalMeshPoints(mesh) {
    originalPoints = mesh.geometry.clone();
}

export function animateFaceUp(mesh) {
    if (!originalPoints) return; // Si los puntos originales no están definidos, salir de la función

    //posiciones originales de los puntos de la cara 
    const positions = mesh.geometry.attributes.position;
    const originalPositions = originalPoints.attributes.position;

    const count = positions.count;

    for (let i = 0; i < count; i++) {
        let speed = 1;
        let acceleration = 0.003;

        speed += acceleration;

        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        const position = new THREE.Vector3(x, y, z);

        position.z -= 0.0008;

        //cómo hacer para que suban dispersandose en los ejes x e y? 


        // position.x += acceleration * Math.random() * originalPositions.getX(i);
        // position.z -= Math.random() * 0.001 * speed;
        // position.x += Math.sin(originalPositions.getY(i) * Math.random() + i) * 0.0003;

        // let particleCount = positions.count;
        // const positionAttribute = positions.getAttribute('position');

        // for (let i = 0; i < position * 3; i += 3) {
        //     array[i + 1] += Math.random() * 0.004 * speed;
        //     array[i] += Math.sin(array[i + 1] * Math.random() + i) * 0.003;

        //     speed += acceleration;
        // }


        // // Actualiza la posición del punto
        positions.setXYZ(i, position.x, position.y, position.z);

    }

    positions.needsUpdate = true;

}

export function animateWaves(mesh, analyser) {
    if (!originalPoints) return; // Si los puntos originales no están definidos, salir de la función

    const avgFq = analyser ? analyser.getAverageFrequency() : 0;

    time += 0.1
    let freq = 90
    let amplitud = 0.00045 * avgFq * 0.5
    var startX = 0.0;
    var startZ = -0.2;

    const positions = mesh.geometry.attributes.position;
    const count = positions.count;

    for (let i = 0; i < count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        const position = new THREE.Vector3(x, y, z);

        // const distance = position.distanceTo(waveOrigin);
        // const offset = Math.sin(distance * waveStrength - time) * 0.1;

        // position.normalize().multiplyScalar(offset);const positions = mesh.geometry.attributes.position;g

        // position.x += Math.sin(time + y * 100) * 0.0001
        // position.y += Math.sin(time + x * 100) * 0.0001
        // position.y += Math.sin(time + x * 100 + y * 100) * 0.0001

        var distance = Math.sqrt(x * x + z * z);
        var distanceX = x - startX;
        var distanceZ = z - startZ;
        var distance = Math.sqrt(distanceX * distanceX + distanceZ * distanceZ);


        // Calcular la altura del riple en función de la distancia y el tiempo
        var offset = Math.sin(distance * freq + time) * (amplitud);
        position.y += offset
        // if (i == 0) console.log(offset)
        // position.x += offset



        // Actualiza la posición del punto
        positions.setXYZ(i, position.x, position.y, position.z);

    }

    positions.needsUpdate = false;
}
