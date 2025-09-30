import * as THREE from 'three';


// Mercator projection helpers

// lon --> tile
export function tileXToLon(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180
}

// lat --> tile
export function tileYToLat(y, z) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z)
  return THREE.MathUtils.radToDeg(Math.atan(Math.sinh(n)))
}

// tile --> lon/lat
export function latLonToTile(lat, lon, zoom) {
  const latRad = (lat * Math.PI) / 180
  const n = Math.pow(2, zoom)

  let xtile = Math.floor(((lon + 180) / 360) * n)
  let ytile = Math.floor(
    (1 -
      Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
      2 * n
  )
  // Wrap-around to avoid negative or overflow tile numbers
  xtile = ((xtile % n) + n) % n
  ytile = Math.min(Math.max(ytile, 0), n - 1)

  return { x: xtile, y: ytile }
}

// calculates center lat/lon from camera view direction.
// quaternion takes into account the angle of inclination
export function cameraCenterLatLon(camera, quaternion) {
  const dir = new THREE.Vector3()
  camera.getWorldDirection(dir) // direction to which the camera is looking
  dir.negate() // vector from origin to the point on the sphere
  dir.normalize()
  // Invert earth inclination
  const invQuat = quaternion.clone().invert()
  dir.applyQuaternion(invQuat)
  const lat = THREE.MathUtils.radToDeg(Math.asin(dir.y))// -90..90
  const lon = THREE.MathUtils.radToDeg(Math.atan2(dir.x, dir.z)) -90// -180..180
  return { lat, lon }
}


// crops a texture image from a bottom ratio to a top ratio
export function cropTexture(image, topRatio, bottomRatio) {
  const width = image.width;
  const height = image.height;
  const cropHeight = height * (bottomRatio - topRatio);
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(
    image,
    0, height * topRatio, width, cropHeight,
    0, 0, width, cropHeight
  );
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}