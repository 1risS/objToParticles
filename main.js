import { animateEnvBubbles, initEnvBubbles } from './envBubbles.js';
import { animateInitBubbles, initBubbles } from './initBubbles.js';

import * as bubbles from './bubbles.js';
import * as env from './environment.js';
import * as models from './models.js';
import * as textures from './helpers.js';
import * as noise from './noise.js';
import * as waves from './waves.js'

init();

async function init() {
  // document.getElementById('video').play();

  env.create3dEnvironment(animate)
  // sparkling.setup(bubbles.faceMesh, env.scene)

  // Load models
  await models.load('meshes/idle.glb', 'idle')
  await models.load('meshes/doja_70.glb', 'cara')
  await models.load('meshes/oreja.glb', 'oreja')
  await models.load('meshes/mano.glb', 'pulgar')

  // bubbles
  const bubbleTexture = await textures.load('imgs/burbuja_sintransparencia.png');
  bubbles.create(env.scene, bubbleTexture, models.getMaxPoints());

  // initBubbles(env.scene, bubbleTexture);
  initEnvBubbles(env.scene, bubbleTexture);
}

function animate() {
  env.controls.update();
  env.render()
  bubbles.update()

  // applyRandom(bubbles.bubbles)
  noise.applyNoise(bubbles.bubbles)
  // noise.applyNoise2(bubbles.bubbles)
  waves.update2(bubbles.bubbles)

  // animateInitBubbles();
  animateEnvBubbles();
}

/* EVENTS */
function onKeyPress(event) {
  switch (event.key) {
    case '1':
      console.log('1');
      bubbles.setPointsPositions(models.getPointsArray('idle'));

      break;
    case '2':
      console.log('2');
      bubbles.setPointsPositions(models.getPointsArray('cara'));
      break;
    case '3':
      console.log('3');
      bubbles.setPointsPositions(models.getPointsArray('oreja'));

      break;
    case '4':
      console.log('3');
      bubbles.setPointsPositions(models.getPointsArray('pulgar'));

      break;
    case '5':
      console.log('4');
      waves.start()

      break;
    default:
      break;
  }
}

document.addEventListener('keydown', onKeyPress);
