import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import faceBubblesFragment from './glsl/faceBubbles.frag';
import faceBubblesVert from './glsl/faceBubbles.vert';
import initBubblesFragment from './glsl/initBubbles.frag';
import initBubblesVert from './glsl/initBubbles.vert';
import { setOriginalMeshPoints } from './faceWaves';
import { initBubbles } from './initBubbles.js'
import { initEnvBubbles } from './envBubbles.js'
import { initColumnBubbles } from './columnBubbles.js'
import { showBubbles } from './initBubbles.js';
import { initAudio } from './audioListener.js'
import { camera } from './main.js'
import { initFaceShow } from './faceShowFromBelow.js';

export let faceMaterial;
export let bubblesMaterial;
export let faceBubblesMesh;
export let analyser;
export let faceMesh;

let audioInitialize = false;
let faceBubblesUpMaterial;
let envBubblesMaterial;
let initBubblesMaterial;
let columnBubblesMaterial;

export function loadModels(scene) {
    const loader = new GLTFLoader();
    loader.load(
        // 'meshes/Cara11_8mar.glb', function (gltf) {
        'meshes/nuevaCara5.glb', function (gltf) {
            new THREE.TextureLoader().load('imgs/bubble_03.png', (texture, opacity) => {
                //Shader de prueba para los modelos nuevos de Ema
                //  faceMaterial = new THREE.PointsMaterial({ color: 0xffffff })

                //Shader q permite control de puntos y colores  para la cara
                faceMaterial = new THREE.ShaderMaterial({
                    vertexShader: faceBubblesVert,
                    fragmentShader: faceBubblesFragment,
                    uniforms: {
                        u_resolution: { value: [window.innerWidth, window.innerHeight] },
                        u_time: { value: 0.0 },
                        u_frequency: { value: 0.0 },
                        u_texture: { value: texture },
                        u_opacity: { value: 0.0 },
                        u_size: { value: 7.0 }
                    },
                    // blending: THREE.AdditiveBlending, 
                    depthTest: true,
                    depthWrite: false,
                    transparent: true,
                });

                console.log('esto es dentro de la fx de load', faceMaterial)

                // evento que dispara el audio para audiorreactividad
                document.addEventListener('click', function () {
                    showBubbles();
                    if (!audioInitialize) {
                        analyser = initAudio(camera);
                        audioInitialize = true;
                    }
                })

                // 
                // if (faceMaterial) {
                //     faceMaterial.uniforms.u_time.value += 0.01;
                //     faceMaterial.uniforms.u_frequency.value = analyser ? analyser.getAverageFrequency() : 0;
                // }
                // if (bubblesMaterial) {
                //     bubblesMaterial.uniforms.u_time.value += 0.01;
                //     bubblesMaterial.uniforms.u_frequency.value = analyser ? analyser.getAverageFrequency() : 0;
                // }

                // animación de la opacidad

                // function fadingInFace() {

                //     let opacity = faceMaterial.uniforms.u_opacity;

                //     opacity.value = 0.0;
                //     let fadingIn = false;
                //     let stepFade = 0.001;

                //     if (fadingIn === true) {
                //         opacity.value += stepFade;
                //         if (opacity.value >= 0.1) {
                //             opacity.value = 0.1;
                //             fadingIn = false;
                //         }
                //     }
                // }


                //Shader para el emisor de burbujas desde la cara
                faceBubblesUpMaterial = new THREE.ShaderMaterial({
                    vertexShader: faceBubblesVert,
                    fragmentShader: faceBubblesFragment,
                    uniforms: {
                        u_resolution: { value: [window.innerWidth, window.innerHeight] },
                        u_time: { value: 0.0 },
                        u_frequency: { value: 0.5 },
                        u_texture: { value: texture },
                        u_opacity: { value: 0.01 },
                        u_size: { value: 10.0 }
                    },
                    blending: THREE.AdditiveBlending,
                    depthTest: true,
                    depthWrite: false,
                    transparent: true,
                });

                // textura burbujas de inicio
                const initBubblesTexture = new THREE.TextureLoader().load('imgs/bubble_03.png', (texture2) => {
                    initBubblesMaterial = new THREE.ShaderMaterial({
                        vertexShader: initBubblesVert,
                        fragmentShader: initBubblesFragment,
                        // lights: true,
                        // onBeforeCompile: (shader) => {
                        //   console.log("vertex", shader.vertexShader);
                        //   console.log("fragment", shader.fragmentShader);
                        // },
                        uniforms: {
                            u_resolution: { value: [window.innerWidth, window.innerHeight] },
                            u_time: { value: 0.0 },
                            u_frequency: { value: 0.0 },
                            u_texture: { value: texture2 },
                            u_opacity: { value: 0.8 },
                            u_size: { value: 20.0 }
                        },
                        blending: THREE.AdditiveBlending,
                        depthTest: true,
                        depthWrite: false,
                        transparent: true,
                    });
                    initBubbles(scene, initBubblesMaterial)
                });

                // textura burbujas de ambiente
                const environmentBubblesTexture = new THREE.TextureLoader().load('imgs/bubble_03.png', (texture3) => {
                    envBubblesMaterial = new THREE.ShaderMaterial({
                        vertexShader: initBubblesVert,
                        fragmentShader: initBubblesFragment,
                        uniforms: {
                            u_resolution: { value: [window.innerWidth, window.innerHeight] },
                            u_time: { value: 0.0 },
                            u_frequency: { value: 0.0 },
                            u_texture: { value: texture3 },
                            u_opacity: { value: .75 },
                            u_size: { value: 20.0 }
                        },
                        blending: THREE.AdditiveBlending,
                        depthTest: true,
                        depthWrite: false,
                        transparent: true,
                    });
                    initEnvBubbles(scene, envBubblesMaterial);
                });
                // shader para la columna de burbujas
                const columnBubblesTexture = new THREE.TextureLoader().load('imgs/bubble_03.png', (texture4) => {
                    columnBubblesMaterial = new THREE.ShaderMaterial({
                        vertexShader: initBubblesVert,
                        fragmentShader: initBubblesFragment,
                        uniforms: {
                            u_resolution: { value: [window.innerWidth, window.innerHeight] },
                            u_time: { value: 0.0 },
                            u_frequency: { value: 0.0 },
                            u_texture: { value: texture4 },
                            u_opacity: { value: .75 },
                            u_size: { value: 20.0 }
                        },
                        blending: THREE.AdditiveBlending,
                        depthTest: true,
                        depthWrite: false,
                        transparent: true,
                    });
                    // initColumnBubbles(scene, columnBubblesMaterial);
                });



                const object = gltf.scene;

                object.position.set(0, 0, 0);
                scene.add(object);

                object.visible = false;

                let pts = [];
                let v3 = new THREE.Vector3();
                object.traverse(child => {
                    if (child.isMesh) {
                        let pos = child.geometry.attributes.position;
                        for (let i = 0; i < pos.count * 3; i++) {
                            v3.fromBufferAttribute(pos, i);
                            pts.push(v3.clone());
                        }
                    }
                });

                let g = new THREE.BufferGeometry().setFromPoints(pts);
                g.center();

                // Bubble colors (unused)
                // const colorArray = [];
                // for (let i = 0; i < pts.length; i++) {
                //   colorArray.push(1, 1, 1); // Valores iniciales de color blanco para cada punto
                // }
                // const colorAttribute = new THREE.BufferAttribute(new Float32Array(colorArray), 3); // 3 componentes (RGB) por color
                // g.setAttribute('color', colorAttribute);

                // Bubble sizes (se combina con el size en el vertex shader)
                const sizeArray = [];
                for (let i = 0; i < pts.length; i++) {
                    sizeArray.push((Math.random() * 25.0));
                }
                const sizeAttribute = new THREE.BufferAttribute(new Float32Array(sizeArray), 1);
                g.setAttribute('size', sizeAttribute);

                initFaceShow(g);

                faceMesh = new THREE.Points(g, faceMaterial);

                faceMesh.morphTargetInfluences[0] = 0.125;

                faceMesh.scale.setScalar(6);
                faceMesh.rotation.x = Math.PI * 0.5;
                setOriginalMeshPoints(faceMesh);

                // copia de la cara que asciende
                faceBubblesMesh = new THREE.Points(g.clone(), faceBubblesUpMaterial);
                faceBubblesMesh.scale.setScalar(10);
                faceBubblesMesh.rotation.x = Math.PI * 0.5;

                scene.add(faceMesh);

                // copia de la cara que asciende
                // scene.add(faceBubblesMesh);
            })
            console.log('esto es en modelLoaders fuera de la fx de load', faceMaterial)
        })
}
