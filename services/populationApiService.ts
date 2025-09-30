import type { Coordinates } from '../types';

export async function getPopulationDensity(coords: Coordinates): Promise<{ density: number }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  // This is a mocked service providing a rough approximation of global population density.
  // In a real-world application, this would call a dedicated GIS or demographic data API.
  // The function simulates higher densities in common populated latitudes and lower densities at poles and over oceans.
  
  const lat = Math.abs(coords.lat);
  let density = 0;

  // Highest density in mid-latitudes
  if (lat < 60) {
    density = 250 * Math.cos(lat * Math.PI / 180);
  }
  
  // Drastically reduce density over major oceans (very rough approximation)
  // Pacific
  if (coords.lat > -40 && coords.lat < 50 && coords.lng < -120 && coords.lng > -180) {
    density *= 0.01;
  }
  // Atlantic
  if (coords.lat > -40 && coords.lat < 60 && coords.lng < -15 && coords.lng > -60) {
    density *= 0.05;
  }

  // Add some high-density spots for major cities to make it more realistic
  const cities = [
    { name: 'Tokyo', lat: 35.68, lng: 139.69, popDensity: 6158 },
    { name: 'New York', lat: 40.71, lng: -74.00, popDensity: 11000 },
    { name: 'London', lat: 51.50, lng: -0.12, popDensity: 5598 },
    { name: 'Lagos', lat: 6.52, lng: 3.37, popDensity: 7900 },
    { name: 'Mumbai', lat: 19.07, lng: 72.87, popDensity: 21000 },
  ];

  for (const city of cities) {
    const dist = Math.sqrt(Math.pow(coords.lat - city.lat, 2) + Math.pow(coords.lng - city.lng, 2));
    if (dist < 1.0) { // If within ~1 degree
      density = city.popDensity;
      break;
    }
  }

  return { density: Math.floor(Math.max(0, density)) };
}