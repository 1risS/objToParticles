import * as THREE from 'three';

export let bubbles = [];
let bubbleGroup;
let destinations = [];
// let offsets = []

let radius = 0.009;
const widthSegments = 32;
const heightSegments = 32;
const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

export function create(scene, texture, totalBubbles) {
    bubbleGroup = new THREE.Group();
    //    bubbleGroup.scale.setScalar(6);
    //    bubbleGroup.rotation.x = Math.PI * 0.5;
    scene.add(bubbleGroup);

    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        map: texture
    });

    for (let i = 0; i < totalBubbles; i++) {
        const sphere = new THREE.Mesh(sphereGeometry, material);
        let x = (Math.random() - 0.5) * 0.75;
        let y = (Math.random() - 0.5) * 0.75 - 3;
        let z = (Math.random() - 0.5) * 0.75;

        sphere.position.set(x, y, z);
        bubbleGroup.add(sphere);
        bubbles.push(sphere);


        destinations.push(new THREE.Vector3(x, y, z))
    }
    console.log('bubbles.length:', bubbles.length);
}

export function setPointsPositions(pointsArray) {
    destinations = []
    destinations = pointsArray.map(p => new THREE.Vector3(p.x, p.y, p.z));
}

export function update() {
    const bubbleVelocity = 0.05;
    bubbles.forEach((bubble, index) => {
        if (index < destinations.length) {
            const destination = destinations[index];
            bubble.position.lerp(destination, bubbleVelocity);
        } else {
            bubble.position.set(1000, 1000, 1000);
        }
    });
}
