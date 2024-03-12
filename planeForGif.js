import * as THREE from 'three';

export let gifTexture;

async function loadTextureAsync(url) {
    return new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
            url,
            (texture) => resolve(texture),
            undefined,
            (error) => reject(error)
        );
    });
}

export async function gifPlane(scene) {
    const gifTextures = [];
    const numFrames = 89; // Adjust based on the number of frames in your GIF

    for (let i = 0; i < numFrames; i++) {
        const texture = await loadTextureAsync(`./gifs/burbuja_semueve/${i}.png`);
        gifTextures.push(texture);
    }

    // Create a material using the first frame of the GIF
    const initialTexture = gifTextures[1];

    const material = new THREE.MeshBasicMaterial({
        map: initialTexture,
        //transparent: true 
    });

    const geometry = new THREE.PlaneGeometry(0.25, 3);

    const plane = new THREE.Mesh(geometry, material);
    // scene.add(plane);

}