import { animateEnvBubbles } from './envBubbles.js';
import { animateWaves } from './faceWaves.js';
import { updateFaceOpacity } from './fadeInFace.js';
import { animateBubbles } from './initBubbles.js';
// import { analyser, bubblesMaterial, faceMaterial, faceMesh, loadModels } from './modelLoaders.js';
import * as bubbles from './Bubbles.js';

import * as env from './environment.js';
import * as sparkling from './sparkling.js';


// let pointsMaterial;
// let faceOpacity;

init();

async function init() {
  env.create3dEnvironment(animate)
  document.getElementById('video').play();
  await bubbles.loadAssetsAndSetup(env.scene);
  sparkling.setup(bubbles.faceMesh, env.scene);
}


function animate() {
  env.controls.update();

  // Update uniforms
  if (bubbles.faceMaterial) {
    updateFaceOpacity(bubbles.faceMaterial.uniforms.u_opacity);
    bubbles.faceMaterial.uniforms.u_time.value += 0.01;
    bubbles.faceMaterial.uniforms.u_frequency.value = bubbles.analyser ? bubbles.analyser.getAverageFrequency() : 0;
  }
  if (bubbles.bubblesMaterial) {
    updateFaceOpacity(bubbles.faceMaterial.uniforms.u_opacity);
    bubbles.bubblesMaterial.uniforms.u_time.value += 0.01;
    bubbles.bubblesMaterial.uniforms.u_frequency.value = bubbles.analyser ? bubbles.analyser.getAverageFrequency() : 0;
  }

  // Move points
  animateBubbles();
  animateEnvBubbles();
  // animateFaceUp(faceBubblesMesh);
  // animateWaves(bubbles.faceMesh, bubbles.analyser);

  sparkling.update()

  // gifTexture.needsUpdate = true;

  env.render()
}




