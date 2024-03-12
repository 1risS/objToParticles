import GUI from 'lil-gui';
import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import './style.css';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

import { animateEnvBubbles } from './envBubbles.js';
import { updateFaceOpacity } from './fadeInFace.js';
import { animateBubbles } from './initBubbles.js';
import { analyser, bubblesMaterial, faceMaterial, loadModels } from './modelLoaders.js';

import { animateColumnBubbles } from './columnBubbles.js';

export let camera;
export let scene;
export let renderer;

let controls;
let pointsMaterial;
let faceOpacity;
const postprocessing = {};



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


  //loader
  loadModels(scene);

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

  // profundidad de campo

  const effectController = {
    focus: 0.0,
    aperture: 0.0,
    maxblur: 0.0,
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

  gui.destroy();

  matChanger();
}

// textura de círculos para reemplazar los cuadrados del PointsMaterial
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

  // Update uniforms
  if (faceMaterial) {
    updateFaceOpacity(faceMaterial.uniforms.u_opacity);
    faceMaterial.uniforms.u_time.value += 0.01;
    faceMaterial.uniforms.u_frequency.value = analyser ? analyser.getAverageFrequency() : 0;
  }
  if (bubblesMaterial) {
    bubblesMaterial.uniforms.u_time.value += 0.01;
    bubblesMaterial.uniforms.u_frequency.value = analyser ? analyser.getAverageFrequency() : 0;
  }

  // Move points
  animateBubbles();
  animateEnvBubbles();
  animateColumnBubbles();
  // animateFaceUp(faceBubblesMesh);
  // animateWaves(faceMesh, analyser);
  // renderer.render(scene, camera);
  postprocessing.composer.render(0.1);
}

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
  // composer.addPass(bokehPass);
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
