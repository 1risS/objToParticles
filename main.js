// import { animateEnvBubbles } from './envBubbles.js';
// import { animateWaves } from './faceWaves.js';
import { updateFaceOpacity } from './fadeInFace.js';
import { animateBubbles } from './initBubbles.js';
import { analyser, bubblesMaterial, faceMaterial, faceMesh, loadModels } from './modelLoaders.js';

import * as ENV from './environment.js';


// let pointsMaterial;
// let faceOpacity;

init();

function init() {
  ENV.create3dEnvironment(animate)
  document.getElementById('video').play();
  loadModels(ENV.scene);
}


function animate() {
  ENV.controls.update();

  // Update uniforms
  if (faceMaterial) {
    updateFaceOpacity(faceMaterial.uniforms.u_opacity);
    faceMaterial.uniforms.u_time.value += 0.01;
    faceMaterial.uniforms.u_frequency.value = analyser ? analyser.getAverageFrequency() : 0;
  }
  if (bubblesMaterial) {
    updateFaceOpacity(faceMaterial.uniforms.u_opacity);
    bubblesMaterial.uniforms.u_time.value += 0.01;
    bubblesMaterial.uniforms.u_frequency.value = analyser ? analyser.getAverageFrequency() : 0;
  }

  // Move points
  animateBubbles();
  // animateEnvBubbles();
  // animateFaceUp(faceBubblesMesh);
  // animateWaves(faceMesh, analyser);

  ENV.render()
}




