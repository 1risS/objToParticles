import * as THREE from 'three';


let time = 0
let waveOrigin = new THREE.Vector3(0, 0, 0); // Punto de origen de la onda
let waveStrength = 0.05; // Fuerza de la onda

let originalPoints

export function setOriginalMeshPoints(mesh) {
    originalPoints = mesh.geometry.clone();
}

export function animateWaves(mesh) {
    if (!originalPoints) return; // Si los puntos originales no están definidos, salir de la función

    time += 0.1
    let freq = 90
    let amplitud = 0.00045
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

        // position.normalize().multiplyScalar(offset);

        // position.x += Math.sin(time + y * 100) * 0.0001
        // position.y += Math.sin(time + x * 100) * 0.0001
        // position.y += Math.sin(time + x * 100 + y * 100) * 0.0001

        // var distance = Math.sqrt(x * x + z * z);
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

    positions.needsUpdate = true;
}
