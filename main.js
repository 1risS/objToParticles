import './style.css'
import * as THREE from 'three';
import { WebGLRenderer } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer;

let controls;

init();

function init() {
  // camara
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(1, 1, 1);
  //escena
  scene = new THREE.Scene();
  //loader
  const loader = new GLTFLoader();
  loader.load(
    'meshes/cara_01.glb', function (gltf) {


      const object = gltf.scene;

      object.position.set(0, 0, 0);

      object.visible = false;
      scene.add(object);

      let pts = [];
      let v3 = new THREE.Vector3();
      object.traverse(child => {
        if (child.isMesh) {
          let pos = child.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            pts.push(v3.clone());
          }
        }
      });

      let g = new THREE.BufferGeometry().setFromPoints(pts);
      g.center();
      let m = new THREE.PointsMaterial({ color: "aqua", size: 0.025 });

      let p = new THREE.Points(g, m);

      p.scale.setScalar(10)

      scene.add(p)

    });

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

//responsive canvas
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
}
