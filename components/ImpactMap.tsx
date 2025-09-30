import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../pleiades-protocol-main/pleiades-ui/src/constants';
import type { CalculatedMetrics, Coordinates } from '../types';

interface ImpactMapProps {
  metrics: CalculatedMetrics;
  onMapClick: (coords: Coordinates) => void;
  selectedCoords: Coordinates | null;
  infoWindowContent: string;
}

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: 20,
  lng: 0,
};

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['geometry'];

const DAMAGE_COLORS = {
  CRATER: '#A9A9A9',          // Dark Gray
  TSUNAMI: '#00FFFF',         // Cyan
  SHOCKWAVE_LIGHT: '#FFFF00',     // Yellow
  SHOCKWAVE_MODERATE: '#FFA500',  // Orange
  SHOCKWAVE_SEVERE: '#FF4500',    // OrangeRed
  SHOCKWAVE_LETHAL: '#8B0000',    // DarkRed
};

const circleOptions = {
  strokeOpacity: 0.9,
  strokeWeight: 1,
  fillOpacity: 0.3,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1,
};

const Legend = ({ metrics }: { metrics: CalculatedMetrics }) => (
  <div className="map-legend">
    <h4 className="text-sky-300 font-bold mb-2 text-sm border-b border-sky-500/30 pb-1">Damage Legend</h4>
    <div className="space-y-1.5">
      {metrics.visualRadii.crater > 0 && (
        <div className="legend-item">
          <div className="legend-color-box" style={{ backgroundColor: DAMAGE_COLORS.CRATER }}></div>
          <span className="text-white text-xs">Crater</span>
        </div>
      )}
      {metrics.visualRadii.tsunami > 0 && (
        <div className="legend-item">
          <div className="legend-color-box" style={{ backgroundColor: DAMAGE_COLORS.TSUNAMI }}></div>
          <span className="text-white text-xs">Tsunami Zone</span>
        </div>
      )}
      <div className="legend-item">
        <div className="legend-color-box" style={{ backgroundColor: DAMAGE_COLORS.SHOCKWAVE_LETHAL }}></div>
        <span className="text-white text-xs">Shockwave (Lethal)</span>
      </div>
      <div className="legend-item">
        <div className="legend-color-box" style={{ backgroundColor: DAMAGE_COLORS.SHOCKWAVE_SEVERE }}></div>
        <span className="text-white text-xs">Shockwave (Severe)</span>
      </div>
      <div className="legend-item">
        <div className="legend-color-box" style={{ backgroundColor: DAMAGE_COLORS.SHOCKWAVE_MODERATE }}></div>
        <span className="text-white text-xs">Shockwave (Moderate)</span>
      </div>
      <div className="legend-item">
        <div className="legend-color-box" style={{ backgroundColor: DAMAGE_COLORS.SHOCKWAVE_LIGHT }}></div>
        <span className="text-white text-xs">Shockwave (Light)</span>
      </div>
    </div>
  </div>
);


export const ImpactMap: React.FC<ImpactMapProps> = ({ metrics, onMapClick, selectedCoords, infoWindowContent }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // Fix: Changed type from 'google.maps.MapMouseEvent' to 'any' because the type
  // definition file 'google.maps' could not be found, causing a compilation error.
  // This workaround allows the map click handler to function correctly without the type definitions.
  const handleMapClick = (e: any) => {
    if (e.latLng) {
      onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };
  
  const mapCenter = selectedCoords || defaultCenter;
  
  if (loadError) {
    return <div style={containerStyle} className="flex justify-center items-center bg-slate-800 rounded-lg text-red-400 p-4 text-center">Error loading map. Please check that the Google Maps API key in `constants.ts` is valid and enabled.</div>;
  }

  if (!isLoaded) {
    return (
      <div style={containerStyle} className="flex justify-center items-center bg-slate-800 rounded-lg">
        <p className="text-sky-300">Loading map...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={selectedCoords ? 6 : 2}
        onClick={handleMapClick}
        options={{
          mapTypeId: 'satellite',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
            { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 }] }
          ]
        }}
      >
        {selectedCoords && (
          <>
            <Marker position={selectedCoords} />
            
            {infoWindowContent && (
              <InfoWindow position={selectedCoords}>
                <div className="text-black p-1 text-sm font-sans">
                  <div dangerouslySetInnerHTML={{ __html: infoWindowContent }} />
                </div>
              </InfoWindow>
            )}

            {metrics.visualRadii.crater > 0 && (
              <Circle
                center={selectedCoords}
                radius={metrics.visualRadii.crater}
                options={{ ...circleOptions, strokeColor: DAMAGE_COLORS.CRATER, fillColor: DAMAGE_COLORS.CRATER }}
              />
            )}

            {metrics.visualRadii.tsunami > 0 && (
              <Circle
                center={selectedCoords}
                radius={metrics.visualRadii.tsunami}
                options={{ ...circleOptions, strokeColor: DAMAGE_COLORS.TSUNAMI, fillColor: DAMAGE_COLORS.TSUNAMI }}
              />
            )}

            <Circle
              center={selectedCoords}
              radius={metrics.visualRadii.shockwave.light}
              options={{ ...circleOptions, strokeColor: DAMAGE_COLORS.SHOCKWAVE_LIGHT, fillColor: DAMAGE_COLORS.SHOCKWAVE_LIGHT }}
            />
            <Circle
              center={selectedCoords}
              radius={metrics.visualRadii.shockwave.moderate}
              options={{ ...circleOptions, strokeColor: DAMAGE_COLORS.SHOCKWAVE_MODERATE, fillColor: DAMAGE_COLORS.SHOCKWAVE_MODERATE }}
            />
            <Circle
              center={selectedCoords}
              radius={metrics.visualRadii.shockwave.severe}
              options={{ ...circleOptions, strokeColor: DAMAGE_COLORS.SHOCKWAVE_SEVERE, fillColor: DAMAGE_COLORS.SHOCKWAVE_SEVERE }}
            />
            <Circle
              center={selectedCoords}
              radius={metrics.visualRadii.shockwave.lethal}
              options={{ ...circleOptions, strokeColor: DAMAGE_COLORS.SHOCKWAVE_LETHAL, fillColor: DAMAGE_COLORS.SHOCKWAVE_LETHAL }}
            />
          </>
        )}
      </GoogleMap>
      {selectedCoords && <Legend metrics={metrics} />}
    </div>
  );
};
