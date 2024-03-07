import './style.css'
import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import GUI from 'lil-gui';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { initBubbles, animateBubbles, showBubbles } from './initBubbles.js';

import { initEnvBubbles, animateEnvBubbles, showEnvBubbles } from './envBubbles.js';

import { setOriginalMeshPoints, animateFaceUp, animateWaves } from './faceWaves';

import { initAudio } from './audioListener.js'

import initBubblesFragment from './glsl/initBubbles.frag';
import initBubblesVert from './glsl/initBubbles.vert';
import faceBubblesFragment from './glsl/faceBubbles.frag';
import faceBubblesVert from './glsl/faceBubbles.vert';

export let camera;
export let scene;
export let renderer;

const gui = new GUI();

let controls;
let pointsMaterial, bubblesMaterial, faceMaterial, envBubblesMaterial, initBubblesMaterial;
let faceMesh, faceBubblesMesh;
let analyser;
let audioInitialize = false;
const postprocessing = {};

// burbujas

init();

function init() {
  // camara
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 3);

  //escena
  scene = new THREE.Scene();

  // video de fondo
  const video = document.getElementById('video');
  video.play();

  const texture = new THREE.VideoTexture(video);
  scene.background = texture;

  // textura burbujas de inicio
  const initBubblesTexture = new THREE.TextureLoader().load('imgs/bubble_03.png', (texture2) => {
    initBubblesMaterial = new THREE.ShaderMaterial({
      vertexShader: initBubblesVert,
      fragmentShader: initBubblesFragment,
      uniforms: {
        u_time: { value: 0.0 },
        u_frequency: { value: 0.0 },
        u_texture: { value: texture2 },
        u_opacity: { value: .75 },
        u_size: { value: 20.0 }
      },
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
    });

    // textura burbujas de ambiente
    const environmentBubblesTexture = new THREE.TextureLoader().load('imgs/bubble_03.png', (texture3) => {
      envBubblesMaterial = new THREE.ShaderMaterial({
        vertexShader: initBubblesVert,
        fragmentShader: initBubblesFragment,
        uniforms: {
          u_time: { value: 0.0 },
          u_frequency: { value: 0.0 },
          u_texture: { value: texture3 },
          u_opacity: { value: .75 },
          u_size: { value: 18.0 }
        },
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
      });

      //loader
      const loader = new GLTFLoader();
      loader.load(
        'meshes/cara_06.glb', function (gltf) {
          new THREE.TextureLoader().load('imgs/bubble_03.png', (texture) => {
            //Shader q permite control de puntos y colores  para la cara

            // faceMaterial = new THREE.MeshPhysicalMaterial({color: 0xffffff})

            faceMaterial = new THREE.ShaderMaterial({
              vertexShader: faceBubblesVert,
              fragmentShader: faceBubblesFragment,
              uniforms: {
                u_time: { value: 0.0 },
                u_frequency: { value: 0.0 },
                u_texture: { value: texture },
                u_opacity: { value: 0.2 },
                u_size: { value: 6.0 }
              },
              //blending: THREE.AdditiveBlending,
              depthTest: true,
              depthWrite: false,
              transparent: true,
            });

            initBubbles(scene, initBubblesMaterial)

            initEnvBubbles(scene, envBubblesMaterial)

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
            const colorArray = [];
            for (let i = 0; i < pts.length; i++) {
              colorArray.push(1, 1, 1); // Valores iniciales de color blanco para cada punto
            }
            const colorAttribute = new THREE.BufferAttribute(new Float32Array(colorArray), 3); // 3 componentes (RGB) por color
            g.setAttribute('color', colorAttribute);

            // Bubble sizes
            const sizeArray = [];
            for (let i = 0; i < pts.length; i++) {
              sizeArray.push((Math.random() * 25.0));
            }
            const sizeAttribute = new THREE.BufferAttribute(new Float32Array(sizeArray), 1);
            g.setAttribute('size', sizeAttribute);

            faceMesh = new THREE.Points(g, faceMaterial);

            faceMesh.scale.setScalar(10);
            faceMesh.rotation.x = Math.PI * 0.5;
            setOriginalMeshPoints(faceMesh);

            // copia de la cara que asciende
            faceBubblesMesh = new THREE.Points(g.clone(), pointsMaterial);
            faceBubblesMesh.scale.setScalar(10);
            faceBubblesMesh.rotation.x = Math.PI * 0.5;

            scene.add(faceMesh);
            // copia de la cara que asciende
            //scene.add(faceBubblesMesh);
          })
        })
    })
  });

  //luz
  const light = new THREE.AmbientLight(0x404040); // soft white light
  light.position.set(10, 10, 10);
  scene.add(light);

  const pointLight = new THREE.PointLight(0xff0000, 1, 100);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  //renderer
  renderer = new WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio * 2);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate)
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);

  initPostprocessing();

  //controles
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  const effectController = {
    focus: 500.0,
    aperture: 5,
    maxblur: 0.01
  };

  const matChanger = function () {
    postprocessing.bokeh.uniforms['focus'].value = effectController.focus;
    postprocessing.bokeh.uniforms['aperture'].value = effectController.aperture * 0.00001;
    postprocessing.bokeh.uniforms['maxblur'].value = effectController.maxblur;
  };

  const gui = new GUI();
  gui.add(effectController, 'focus', 10.0, 3000.0, 10).onChange(matChanger);
  gui.add(effectController, 'aperture', 0, 10, 0.1).onChange(matChanger);
  gui.add(effectController, 'maxblur', 0.0, 0.01, 0.001).onChange(matChanger);
  gui.close();

  matChanger();
}

export function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = "#FFF"; // Color blanco
  context.fill();

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}

//responsive canvas
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  postprocessing.composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  controls.update();
  // if (faceMaterial) {
  //   faceMaterial.uniforms.u_time.value += 0.01;
  //   faceMaterial.uniforms.u_frequency.value = analyser ? analyser.getAverageFrequency() : 0;
  // }
  if (bubblesMaterial) {
    bubblesMaterial.uniforms.u_time.value += 0.01;
    bubblesMaterial.uniforms.u_frequency.value = analyser ? analyser.getAverageFrequency() : 0;
  }
  animateBubbles();
  animateEnvBubbles();
  animateFaceUp(faceBubblesMesh);
  // animateWaves(faceMesh, analyser);
  // renderer.render(scene, camera);
  postprocessing.composer.render(0.1);
}

document.addEventListener('click', function () {
  showBubbles();
  if (!audioInitialize) {
    analyser = initAudio(camera);
    audioInitialize = true;
  }

})

function initPostprocessing() {
  const renderPass = new RenderPass(scene, camera);

  const bokehPass = new BokehPass(scene, camera, {
    focus: 1,
    aperture: 0.00025,
    maxblur: 0.01
  });

  const outputPass = new OutputPass();

  const composer = new EffectComposer(renderer);

  composer.addPass(renderPass);
  composer.addPass(bokehPass);
  composer.addPass(outputPass);

  postprocessing.composer = composer;
  postprocessing.bokeh = bokehPass;
}

// Puntos o burbujas png
// pointsMaterial = new THREE.PointsMaterial({
//   color: 'white',
//   size: 0.05,
//   // para tener el estadío 1 mutear los dos maps

//   // burbujas png
//   map: texture,

//   //circulitos
//   // map: createCircleTexture(),
//   transparent: false,
//   alphaTest: 0.5,
//   opacity: 1,
//   blending: THREE.AdditiveBlending
// });
