import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export let controls;
export let camera;
export let scene;
export let renderer;

export function create3dEnvironment(animate) {
    // camara
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 3);

    //escena
    scene = new THREE.Scene();

    //luz
    const light = new THREE.AmbientLight(0x404040); // soft white light
    light.position.set(10, 10, 10);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    //renderer
    renderer = new WebGLRenderer({ antialias: false, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.background = 'none';
    renderer.setPixelRatio(window.devicePixelRatio * 2);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate)
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);


    //controles
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

}

export function render() {
    renderer.render(scene, camera);
}

//responsive canvas
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}