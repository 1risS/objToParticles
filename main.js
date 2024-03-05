import './style.css'
import * as THREE from 'three';
import { WebGLRenderer } from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { initBubbles, animateBubbles, showBubbles } from './bubbles.js';

export let camera;
export let scene;
export let renderer;

let controls, pointsMaterial;

const pointsVertexShader = `
attribute vec3 color;
varying vec3 vColor;

uniform float time;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

//	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vColor = color;

  vec3 pos = position;
  float size = 10.0;

  // Alteration: Displace the points based on a sinewave
  // pos = pos + 0.01 * sin(10.0 * pos.x + time);
  // size = size * 0.5;

  pos = pos + 0.001 * snoise(pos*50.0 + time*0.5);

  // pos = vec3(rand(pos.xy), rand(pos.yz), rand(pos.xz));

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_PointSize = (size / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const pointsFragmentShader = `
varying vec3 vColor;

uniform float time;

void main() {
  vec3 color = vColor;

  // Alteration: Add a bit of noise to the color
  // color = color + 0.4 * sin(time*2.);

  gl_FragColor = vec4(color, 1.0);
}
`;

// burbujas

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
      new THREE.TextureLoader().load('imgs/pepsi-bubble.png', (texture) => {
        // const pointsMaterial = new THREE.PointsMaterial({
        //   color: 'white',
        //   size: 0.05,
        //   map: texture,
        //   //map: createCircleTexture(),
        //   transparent: false,
        //   alphaTest: 0.5,
        //   opacity: 1,
        //   blending: THREE.AdditiveBlending
        // });

        pointsMaterial = new THREE.ShaderMaterial({
          vertexShader: pointsVertexShader,
          fragmentShader: pointsFragmentShader,
          uniforms: {
            time: { value: 0.0 },
          },
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true
        });

        initBubbles(scene, pointsMaterial)

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

        let p = new THREE.Points(g, pointsMaterial);

        p.scale.setScalar(10)
        p.rotation.x = Math.PI * 0.5

        scene.add(p)
      })
    });

  //luz
  // const light = new THREE.AmbientLight(0x404040); // soft white light
  // light.position.set(10, 10, 10);
  // scene.add(light);

  // const pointLight = new THREE.PointLight(0xff0000, 1, 100);
  // pointLight.position.set(10, 10, 10);
  // scene.add(pointLight);

  //renderer
  renderer = new WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio * 2);
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
  if (pointsMaterial) {
    pointsMaterial.uniforms.time.value += 0.01;
  }
  animateBubbles(scene);
  renderer.render(scene, camera);
}

document.addEventListener('click', function () {
  showBubbles();
})
