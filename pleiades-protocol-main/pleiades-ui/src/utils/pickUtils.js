import * as THREE from 'three'

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export function pickFocusableObject(event, camera, scene) {
  // Coordenadas del click normalizadas (-1 a 1)
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Lanza el rayo
  raycaster.setFromCamera(pointer, camera);

  // intersecta contra la escena completa (o array de objetos)
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Busca el primer objeto que sea "focusable"
  for (const object of intersects) {
    const obj = object.object;
    //Comprobamos que sea una etiqueta y devolvemos el cuerpo etiquetado
    if (obj) {
        return obj
    }
  }
  return null;
}