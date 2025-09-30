import type { Coordinates } from '../types';

const API_BASE_URL = 'https://api.open-meteo.com/v1/elevation';

export async function getElevationForCoords(lat: number, lng: number): Promise<number> {
  const response = await fetch(`${API_BASE_URL}?latitude=${lat}&longitude=${lng}`);
  
  if (!response.ok) {
    throw new Error('Request to Open-Meteo Elevation API failed.');
  }
  
  const data = await response.json();

  if (!data || !data.elevation || data.elevation.length === 0) {
    throw new Error('Elevation API returned an empty or invalid response.');
  }
  
  // Open-Meteo returns an array, we take the first value.
  return data.elevation[0];
}
