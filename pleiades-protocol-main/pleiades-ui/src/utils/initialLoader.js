import * as THREE from 'three'
import { EARTH_RADIUS, NEAREST_DISTANCE } from '../constants'

export const loadTiles = (earth, camera) => {
  if (typeof earth?.userData?.updateTiles === 'function') {
    earth.userData.updateTiles(camera)
  }
}

export const initTiles = (earth) => {
  if (typeof earth?.userData?.initTiles === 'function') {
    earth.userData.initTiles()
  }
}

export const getUpdateControls = (controls, camera) => {
  return () => {
    const dist = camera.position.length() - EARTH_RADIUS
    const variationScale = 2
    const offsetScale = NEAREST_DISTANCE / 2
    controls.rotateSpeed = THREE.MathUtils.clamp(dist/variationScale + offsetScale, NEAREST_DISTANCE, 1)
    controls.zoomSpeed = THREE.MathUtils.clamp(dist/variationScale + offsetScale, NEAREST_DISTANCE, 1)
  }
}
