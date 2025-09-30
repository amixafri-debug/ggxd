export const EARTH_TEXTURE_URL =
'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
export const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
export const TILE_SIZE = 256;
export const EARTH_INCLINATION = 23.5;
export const EARTH_RADIUS = 1;
export const MIN_ZOOM = 4;
export const MAX_RENDER_LATITUDE = 85; //Maximum latitude to render tiles
export const CONTROL_MIN_DISTANCE = EARTH_RADIUS * 1.0003; //Min distance to zoom in
export const CONTROL_MAX_DISTANCE = 10;
export const NEAREST_DISTANCE = CONTROL_MIN_DISTANCE - EARTH_RADIUS - 0.0001; //Nearest distance from surface
