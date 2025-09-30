import * as THREE from 'three'

export function adjustCamera(anchor, controls, camera, justChanged=false) {
    const vector = new THREE.Vector3();
    anchor.getWorldPosition(vector); // <— usa el anchor, no el group portador

    // current offset: distance between the viewer (camera position) and the target (where controls point)
    // if justChanged, the anchor has just been set to this body, so offset should be fixed
    const offset = 
    justChanged ? 
    new THREE.Vector3(0, anchor.userData.initialDistance/4, anchor.userData.initialDistance) :
    new THREE.Vector3().subVectors(camera.position, controls.target)

    // centers target in earth anchor
    controls.target.copy(vector); // or: controls.target.lerp(earthWorld, 0.2);

    // sets the camera mantaining same distance (offset) to target
    camera.position.copy(vector).add(offset);
    controls.update();
}