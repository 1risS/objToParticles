
import * as THREE from 'three';

let facePointsPositions
let bottomPositions = [];
let topPositions = [];


let bubbles = []
let bubbleGroup
let progressToFace = []
let progressToTop = []

let bottomDelay = []
let onFaceDelay = []
export function setup(mesh, scene) {
    bubbleGroup = new THREE.Group();
    bubbleGroup.scale.setScalar(6);
    bubbleGroup.rotation.x = Math.PI * 0.5;
    scene.add(bubbleGroup);

    let originalGeometry = mesh.geometry.clone();
    facePointsPositions = originalGeometry.attributes.position;

    // // Filtrar puntos repetidos
    // const filteredPositionsSet = new Set();

    // for (let i = 0; i < facePointsPositions.count; i++) {
    //     const x = facePointsPositions.getX(i);
    //     const y = facePointsPositions.getY(i);
    //     const z = facePointsPositions.getZ(i);

    //     const positionKey = `${x},${y},${z}`;
    //     filteredPositionsSet.add(positionKey);
    // }

    // // Convertir el conjunto a un array de posiciones únicas
    // const filteredPositions = Array.from(filteredPositionsSet).map(positionKey => {
    //     const [x, y, z] = positionKey.split(',').map(parseFloat);
    //     return new THREE.Vector3(x, y, z);
    // });

    const targetY = -0.04241231456398964;
    const threshold = 0.01;
    const filteredPositions = [];
    for (let i = 0; i < facePointsPositions.count; i++) {
        const x = facePointsPositions.getX(i);
        const y = facePointsPositions.getY(i);
        const z = facePointsPositions.getZ(i);

        const diffY = Math.abs(y - targetY);

        if (diffY > threshold) {
            filteredPositions.push(new THREE.Vector3(x, y, z));
        }
    }

    // Crear un nuevo atributo de buffer con las posiciones filtradas
    originalGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(filteredPositions.length * 3), 3));
    for (let i = 0; i < filteredPositions.length; i++) {
        originalGeometry.attributes.position.setXYZ(i, filteredPositions[i].x, filteredPositions[i].y, filteredPositions[i].z);
    }

    facePointsPositions = originalGeometry.attributes.position;
    console.log(facePointsPositions.count);

    createBubbles();
}

function createBubbles() {
    const radius = 0.001;
    const widthSegments = 32;
    const heightSegments = 32;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
        // 'imgs/matcap3.jpg',
        'imgs/bubble_03.png',
        function (texture) {
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.25,
                map: texture
            });
            const material2 = new THREE.MeshMatcapMaterial({
                matcap: texture,
                transparent: true,
                alphaTest: 0.5,
                // side: THREE.DoubleSide,
                // opacity: 0.26,
            });

            for (let i = 0; i < facePointsPositions.count; i++) {
                const sphere = new THREE.Mesh(sphereGeometry, material);
                // const sphere = new THREE.Sprite(material);

                let x = (Math.random() - 0.5) * 0.125 * 0
                let y = (Math.random() - 0.5) * 0.125 * 0
                let z = (Math.random() - 0.5) + 0.5
                z = 0.52
                bottomPositions.push(new THREE.Vector3(x, y, z));

                const x2 = facePointsPositions.getX(i);
                const y2 = facePointsPositions.getY(i);
                const z2 = -0.2 //facePointsPositions.getZ(i);
                topPositions.push(new THREE.Vector3(x2, y2, z2));

                sphere.position.set(x, y, z);

                bubbleGroup.add(sphere)
                bubbles.push(sphere)
            }
            console.log(bubbles.length)
            resetProgress()
        },
        undefined,
        function (error) {
            console.error('Error al cargar la textura Matcap:', error);
        }
    );
}
function resetProgress() {
    // if (bubbles) {
    progressToFace = []
    progressToTop = []
    bottomDelay = []
    onFaceDelay = []
    for (let i = 0; i < bubbles.length; i++) {
        progressToFace.push(0)
        progressToTop.push(0)
        bottomDelay.push(parseInt(Math.random() * 1200))
        // onFaceDelay.push(parseInt(Math.random() * 16000))
        onFaceDelay.push(300)

    }
}

export function update() {
    if (bubbleGroup) {
        // bubbleGroup.rotation.z += 0.01;
    }

    if (bubbles) {
        for (let i = 0; i < bubbles.length; i++) {
            /// from bottom to face
            if (bottomDelay[i] > 0) {
                bottomDelay[i]--
                if (bottomDelay[i] < 0) bottomDelay[i] = 0
            } else {
                if (progressToFace[i] < 1) {
                    // let progressStep = 0.0025 + Math.random() * 0.0025
                    let progressStep = 0.0025
                    progressToFace[i] += progressStep
                    if (progressToFace[i] > 1) progressToFace[i] = 1
                    let easing = easeFunction(progressToFace[i])

                    const facePoint = new THREE.Vector3();
                    facePoint.fromBufferAttribute(facePointsPositions, i);

                    const newPosition = new THREE.Vector3()
                        .lerpVectors(
                            bottomPositions[i],
                            facePoint,
                            easing);
                    bubbles[i].position.copy(newPosition);
                } else {
                    /// from face to top
                    if (onFaceDelay[i] > 0) {
                        onFaceDelay[i]--
                        if (onFaceDelay[i] < 0) onFaceDelay[i] = 0
                    } else {
                        // if (i % 2 == 0) progressToTop[i] = 1
                        // if (i % 3 == 0) progressToTop[i] = 1
                        progressToTop[i] = 1
                        if (progressToTop[i] < 1) {
                            // let progressStep = 0.0025 + Math.random() * 0.0025
                            let progressStep = 0.005


                            progressToTop[i] += progressStep
                            if (progressToTop[i] > 1) progressToTop[i] = 1
                            let easing = easeFunction(progressToTop[i])

                            const facePoint = new THREE.Vector3();
                            facePoint.fromBufferAttribute(facePointsPositions, i);

                            const newPosition = new THREE.Vector3()
                                .lerpVectors(
                                    facePoint,
                                    topPositions[i],
                                    easing);
                            bubbles[i].position.copy(newPosition);
                        } else {
                            progressToFace[i] = 0
                            progressToTop[i] = 0
                            bottomDelay[i] = parseInt(Math.random() * 1200)
                            // onFaceDelay[i] = parseInt(Math.random() * 22600)
                            onFaceDelay[i] = 300

                            bubbles[i].position.copy(bottomPositions[0]);

                        }
                    }
                }
            }
        }
    }
}

function easeFunction(x) {
    // return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); // OUT
    return 1 - Math.cos((x * Math.PI) / 2); /// IN
}