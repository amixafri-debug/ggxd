import { NASA_API_KEY } from '../constants';
import type { NEOData, NEOListItem } from '../types';

const API_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export async function getNEOData(neoId: string): Promise<NEOData> {
  const response = await fetch(`${API_BASE_URL}/neo/${neoId}?api_key=${NASA_API_KEY}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Near-Earth Object (NEO) not found.');
    }
    const errorData = await response.json();
    throw new Error(errorData.error_message || `API Error: ${response.status}`);
  }
  
  const data: NEOData = await response.json();
  return data;
}

export async function getNEOList(): Promise<NEOListItem[]> {
  const response = await fetch(`${API_BASE_URL}/neo/browse?api_key=${NASA_API_KEY}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_message || `API Error: ${response.status}`);
  }

  const data = await response.json();
  const neoList: NEOListItem[] = data.near_earth_objects.map((neo: any) => ({
    id: neo.id,
    name: neo.name.replace(/[()]/g, ''),
  }));

  return neoList;
}
