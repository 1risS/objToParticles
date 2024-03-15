import { animateEnvBubbles, initEnvBubbles } from './envBubbles.js';
// import { animateWaves } from './faceWaves.js';
// import { updateFaceOpacity } from './fadeInFace.js';
import { initBubbles, animateBubbles } from './initBubbles.js';
// import { analyser, bubblesMaterial, faceMaterial, faceMesh, loadModels } from './modelLoaders.js';
// import * as bubbles from './Bubbles.js';


import * as env from './environment.js';
import * as sparkling from './sparkling.js';
// import * as bubblesToFace from './bubblesToFace.js'
import * as models from './models.js'
import * as textures from './textures.js'
import * as bubbles from './bubbles2.js'
// let pointsMaterial;
// let faceOpacity;

init();

async function init() {
  // document.getElementById('video').play();

  env.create3dEnvironment(animate)
  // await bubbles.loadAssetsAndSetup(env.scene);
  // sparkling.setup(bubbles.faceMesh, env.scene)
  // bubblesToFace.setup(bubbles.faceMesh, env.scene)

  // Load models
  await models.load('meshes/doja_46_j.glb', 'cara')
  await models.load('meshes/Oreja2.glb', 'oreja')
  await models.load('meshes/Pulgar1.glb', 'pulgar')

  // Load textures
  const bubbleTexture = await textures.load('imgs/burbuja_sintransparencia.png');

  // const cara = await models.getPointsArray('cara')
  // console.log('cara', cara.length)
  // const oreja = await models.getPointsArray('oreja')
  // console.log('oreja', oreja.length)
  // console.log(models.getMaxPoints())
  bubbles.create(env.scene, models.getMaxPoints())

  initBubbles(env.scene, bubbleTexture);
  initEnvBubbles(env.scene, bubbleTexture);
}


function animate() {
  env.controls.update();
  env.render()
  bubbles.update()
  animateBubbles();
  animateEnvBubbles();
}



/* EVENTS */
function onKeyPress(event) {
  switch (event.key) {
    case '1':
      console.log('1');
      bubbles.setPointsPositions(models.getPointsArray('cara'));

      break;
    case '2':
      console.log('2');
      bubbles.setPointsPositions(models.getPointsArray('oreja'));
      break;
    case '3':
      console.log('3');
      bubbles.setPointsPositions(models.getPointsArray('pulgar'));

      break;
    default:
      break;
  }
}

document.addEventListener('keydown', onKeyPress);
