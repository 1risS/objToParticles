import './style.css'
import * as THREE from 'three';
import { WebGLRenderer } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { initBubbles, animateBubbles, showBubbles } from './bubbles';

export let camera;
export let scene;
export let renderer;

let controls;

//let bubbleTexture = new THREE.TextureLoader().load('imgs/bubble.png')

// burbujas
export const pointMaterial = new THREE.PointsMaterial({
  color: 'white',
  size: 0.015,
  //map: bubbleTexture,
  map: createCircleTexture(),
  transparent: true,
  alphaTest: 0.5,
  opacity: 0.75,
  blending: THREE.AdditiveBlending
});

init();



function init() {
  // camara
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 3);
  //escena
  scene = new THREE.Scene();
  //loader
  const loader = new GLTFLoader();
  loader.load(
    'meshes/cara_02.glb', function (gltf) {


      const object = gltf.scene;

      // object.position.set(0, 0, 0);
      // scene.add(object);
      // object.visible = false;

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

      let p = new THREE.Points(g, pointMaterial);

      p.scale.setScalar(10)
      p.rotation.x = Math.PI * 0.5

      scene.add(p)

    });

  initBubbles(scene)

  //luz
  const light = new THREE.AmbientLight(0x404040); // soft white light
  light.position.set(0, 0, 0);
  scene.add(light);

  const pointLight = new THREE.PointLight(0xff0000, 1, 100);
  pointLight.position.set(1, 1, 1);
  scene.add(pointLight);

  //renderer
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate)
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);

  //controles
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
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
}

function animate() {
  controls.update();
  animateBubbles(scene);
  renderer.render(scene, camera);
}


document.addEventListener('click', function () {
  showBubbles()
})