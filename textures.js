import { TextureLoader } from 'three';

export async function load(file) {
    return new Promise((resolve, reject) => {
        const loader = new TextureLoader();
        loader.load(file, (texture) => {
            console.log(file + ' texture loaded successfully.');
            resolve(texture);
        }, undefined, (error) => {
            console.error('An error happened while loading ' + file);
            reject(error);
        });
    });
}