import * as THREE from 'three';

export function initAudio(camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const analyser = new THREE.AudioAnalyser(sound, 32);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('audio/audio_00.mp3', function (buffer) {
        sound.setBuffer(buffer);
        window.addEventListener('click', function () {
            sound.play();
        })
    })

    return analyser;
}

