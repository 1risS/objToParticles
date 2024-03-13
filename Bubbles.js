import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import faceBubblesFragment from './glsl/faceBubbles.frag';
import faceBubblesVert from './glsl/faceBubbles.vert';
import initBubblesFragment from './glsl/initBubbles.frag';
import initBubblesVert from './glsl/initBubbles.vert';

import { setOriginalMeshPoints } from './faceWaves';
import { initBubbles } from './initBubbles.js'
import { initEnvBubbles } from './envBubbles.js'
import { showBubbles } from './initBubbles.js';
import { initAudio } from './audioListener.js'
import { camera } from './environment.js'

export let faceMaterial;
export let bubblesMaterial;
export let faceBubblesMesh;
export let analyser;
export let faceMesh;

let audioInitialized = false;
let faceBubblesUpMaterial;
let envBubblesMaterial;
let initBubblesMaterial;

export async function loadAssetsAndSetup(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('meshes/nueva_carav2.glb', function (gltf) {

            new THREE.TextureLoader().load('imgs/burb_a.png', (texture) => {
                faceMaterial = createFaceMaterial(texture);
                initBubblesMaterial = createInitBubblesMaterial(texture);
                envBubblesMaterial = createEnvBubblesMaterial(texture);
                initBubbles(scene, initBubblesMaterial)
                initEnvBubbles(scene, envBubblesMaterial);


                document.addEventListener('click', function () {
                    showBubbles();
                    if (!audioInitialized) {
                        analyser = initAudio(camera);
                        audioInitialized = true;
                    }
                });

                const object = gltf.scene;
                object.position.set(0, 0, 0);
                scene.add(object);
                object.visible = false;

                const pts = [];
                const v3 = new THREE.Vector3();
                object.traverse(child => {
                    if (child.isMesh) {
                        const pos = child.geometry.attributes.position;
                        for (let i = 0; i < pos.count * 3; i++) {
                            v3.fromBufferAttribute(pos, i);
                            pts.push(v3.clone());
                        }
                    }
                });

                let geom = new THREE.BufferGeometry().setFromPoints(pts);
                geom.center();

                const sizeArray = [];
                for (let i = 0; i < pts.length; i++) {
                    sizeArray.push((Math.random() * 25.0));
                }
                const sizeAttribute = new THREE.BufferAttribute(new Float32Array(sizeArray), 1);
                geom.setAttribute('size', sizeAttribute);

                faceMesh = createFaceMesh(geom);
                faceMesh.position.set(0, 1.3, 0);

                // burbujas para la copia de la cara que sube
                faceBubblesMesh = createFaceBubblesMesh(geom);

                scene.add(faceMesh);

                resolve();
            }, undefined, reject);
        });
    });
}

function createFaceMaterial(texture) {
    return new THREE.ShaderMaterial({
        vertexShader: faceBubblesVert,
        fragmentShader: faceBubblesFragment,
        uniforms: {
            u_resolution: { value: [window.innerWidth, window.innerHeight] },
            u_time: { value: 0.0 },
            u_frequency: { value: 0.0 },
            u_texture: { value: texture },
            u_opacity: { value: 0.0 },
            u_size: { value: 6.0 }
        },
        depthTest: true,
        depthWrite: false,
        transparent: true,
    });
}

function createInitBubblesMaterial(texture) {
    return new THREE.ShaderMaterial({
        vertexShader: initBubblesVert,
        fragmentShader: initBubblesFragment,
        uniforms: {
            u_resolution: { value: [window.innerWidth, window.innerHeight] },
            u_time: { value: 0.0 },
            u_frequency: { value: 0.0 },
            u_texture: { value: texture },
            u_opacity: { value: 0.8 },
            u_size: { value: 10.0 }
        },
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
    });
}

function createEnvBubblesMaterial(texture) {
    return new THREE.ShaderMaterial({
        vertexShader: initBubblesVert,
        fragmentShader: initBubblesFragment,
        uniforms: {
            u_resolution: { value: [window.innerWidth, window.innerHeight] },
            u_time: { value: 0.0 },
            u_frequency: { value: 0.0 },
            u_texture: { value: texture },
            u_opacity: { value: .75 },
            u_size: { value: 10.0 }
        },
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
    });
}

function createFaceMesh(geometry) {
    const faceMesh = new THREE.Points(geometry, faceMaterial);
    faceMesh.scale.setScalar(6);
    faceMesh.rotation.x = Math.PI * 0.5;
    setOriginalMeshPoints(faceMesh);
    return faceMesh;
}

function createFaceBubblesMesh(geometry) {
    const faceBubblesMesh = new THREE.Points(geometry.clone(), faceBubblesUpMaterial);
    faceBubblesMesh.scale.setScalar(10);
    faceBubblesMesh.rotation.x = Math.PI * 0.5;
    return faceBubblesMesh;
}
