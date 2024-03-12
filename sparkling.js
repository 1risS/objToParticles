
import * as THREE from 'three';


let positions
let bubbles = []
// let originalPoints
let bubbleGroup
export function setup(mesh, scene) {
    bubbleGroup = new THREE.Group();
    bubbleGroup.scale.setScalar(6);
    bubbleGroup.rotation.x = Math.PI * 0.5;
    scene.add(bubbleGroup);

    // Clonar la geometría del mesh
    let originalGeometry = mesh.geometry.clone();
    positions = originalGeometry.attributes.position;

    const targetY = -0.04241231456398964;
    const threshold = 0.01; 
    const filteredPositions = [];
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        const diffY = Math.abs(y - targetY);

        if (diffY > threshold) {
            filteredPositions.push(new THREE.Vector3(x, y, z));
        }
    }

    originalGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(filteredPositions.length * 3), 3));
    for (let i = 0; i < filteredPositions.length; i++) {
        originalGeometry.attributes.position.setXYZ(i, filteredPositions[i].x, filteredPositions[i].y, filteredPositions[i].z);
    }

    positions = originalGeometry.attributes.position;
    console.log(positions.count);

    addBubbleToGroup();
}


let counter = 0
export function update() {
    if (bubbles) {
        for (let i = 0; i < bubbles.length; i++) {
            bubbles[i].position.z -= 0.00125
        }
    }
}
function addBubbleToGroup() {

    const radius = 0.001;
    const widthSegments = 32;
    const heightSegments = 32;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    if (bubbles.length >= 10) {
        // Si hay más de 3 elementos, eliminar el más antiguo
        const oldestBubble = bubbles.shift(); // Eliminar el primer elemento del array 'bubbles'
        bubbleGroup.remove(oldestBubble); // Remover la esfera del grupo
    }

    let index = parseInt(positions.count * Math.random())
    // console.log(index)
    let x = positions.getX(index)
    let y = positions.getY(index)
    let z = positions.getZ(index)

    sphere.position.x = x
    sphere.position.y = y
    sphere.position.z = z

    bubbleGroup.add(sphere)
    bubbles.push(sphere)
    // console.log(bubbles)
    // console.log(bubbles[0].position.x)
    setTimeout(function () {
        addBubbleToGroup()
    }, 100)
}