import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const modelData = {};


export async function load(file, name) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(file, (gltf) => {

            gltf.scene.position.set(0, 0, 0);

            const points = [];
            const uniquePoints = {};
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    const geometry = child.geometry;
                    const vertices = geometry.attributes.position.array;
                    for (let i = 0; i < vertices.length; i += 3) {
                        const x = vertices[i];
                        const y = vertices[i + 1];
                        const z = vertices[i + 2];

                        const key = `${x.toFixed(3)}_${y.toFixed(3)}_${z.toFixed(3)}`;
                        if (!uniquePoints[key]) {
                            uniquePoints[key] = true;
                            points.push(new THREE.Vector3(x, y, z));
                        }
                    }
                }
            });

            console.log(name, points.length, 'points.');


            modelData[name] = points;

            resolve(gltf.scene);
        }, undefined, (error) => {
            console.error('An error happened while loading ' + name);
            reject(error);
        });
    });
}


export function getPointsArray(name) {
    if (modelData[name]) {
        return modelData[name];
    } else {
        return new Error('Model not found: ' + name);
    }
}


export function getMaxPoints() {
    let maxPoints = 0;
    for (const modelName in modelData) {
        const points = modelData[modelName].length;
        if (points > maxPoints) {
            maxPoints = points;
        }
    }
    return maxPoints;
}