import * as THREE from 'three';
import faceBubblesFragment from './glsl/faceBubbles.frag';
import faceBubblesVert from './glsl/faceBubbles.vert';

let positions
let bubbles = []
// let originalPoints
let bubbleGroup
export function setup(mesh, scene) {
    bubbleGroup = new THREE.Group();
    bubbleGroup.scale.setScalar(6);
    bubbleGroup.rotation.x = Math.PI * 0.5;
    bubbleGroup.position.y = 1.5;
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
function addBubbleToGroupOld() {
    const radius = 0.001;
    const widthSegments = 32;
    const heightSegments = 32;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    if (bubbles.length >= 60) {
        const oldestBubble = bubbles.shift();
        bubbleGroup.remove(oldestBubble);
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
    }, 10)
}

function addBubbleToGroup() {
    const radius = 0.001;
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        'imgs/burb_a_negro.png',
        function (texture) {
            const material = new THREE.MeshMatcapMaterial(
                {
                    matcap: texture,
                    transparent: true,
                    alphaTest: 0.5,
                    // side: THREE.DoubleSide,
                    // opacity: 0.26,
                });
            const sphere = new THREE.Mesh(sphereGeometry, material);

            if (bubbles.length >= 30) {
                const oldestBubble = bubbles.shift();
                bubbleGroup.remove(oldestBubble);
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
            }, 50)
        },
        undefined,
        function (error) {
            console.error('Error al cargar la textura Matcap:', error);
        }
    );
}
