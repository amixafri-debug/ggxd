import React from 'react';
import type { CalculatedMetrics } from '../types';
import { MetricCardGroup } from './MetricCard';
import { AnalogyCard, ShockwaveExplanation } from './SummaryVisuals';

const getEnergyAnalogy = (tntEquivalent: number): string => {
  const megatons = tntEquivalent / 1000;
  if (megatons <= 0.02) return "Similar to the Hiroshima atomic bomb (15 kilotons). Capable of destroying a city center.";
  if (megatons <= 1) return "Comparable to a large modern thermonuclear weapon. Could devastate a large metropolitan area.";
  if (megatons <= 50) return "Approaching the power of the Tsar Bomba, the largest nuclear weapon ever detonated. Would cause unprecedented destruction over a vast region.";
  if (megatons <= 100000) return "This is in the range of the Chicxulub impactor that led to the extinction of the dinosaurs. A global catastrophe.";
  return "An event far beyond any recorded in human history, posing a severe threat to all life on Earth.";
};

const getCraterAnalogy = (diameterKm: number): string => {
  if (diameterKm <= 0.1) return "A relatively small crater, about the size of a large sports stadium.";
  if (diameterKm <= 1) return "The resulting crater would be large enough to engulf a small town or airport.";
  if (diameterKm <= 10) return "This would create a crater roughly the size of a major city like San Francisco. The immediate area would be obliterated.";
  if (diameterKm <= 50) return "A crater of this size would cover a large metropolitan area, like the entire Dallas-Fort Worth metroplex.";
  if (diameterKm <= 180) return "Comparable in size to the Chicxulub crater. This impact would have long-lasting global consequences.";
  return "The impact would create a crater larger than many small countries, triggering catastrophic global environmental changes.";
};

const getSeismicAnalogy = (magnitude: number): string => {
  if (magnitude <= 0) return "No noticeable seismic activity.";
  if (magnitude < 4) return "Comparable to a minor earthquake, felt locally but causing no damage.";
  if (magnitude < 6) return `A magnitude ${magnitude.toFixed(1)} event, similar to a moderate earthquake. It could cause damage to buildings near the impact site.`;
  if (magnitude < 8) return `A magnitude ${magnitude.toFixed(1)} event, equivalent to a major earthquake. Capable of causing widespread, heavy damage.`;
  return `A magnitude ${magnitude.toFixed(1)} event, a 'great' earthquake. It would cause catastrophic destruction for hundreds of kilometers around.`;
};

const getTsunamiAnalogy = (waveHeight: number, isPossible: boolean): string => {
  if (!isPossible || waveHeight <= 0) return "An ocean impact would not generate a significant tsunami.";
  if (waveHeight < 2) return `A small tsunami with waves around ${waveHeight.toFixed(1)} meters high. Dangerous for coastal areas but not catastrophic.`;
  if (waveHeight < 10) return `A dangerous tsunami with waves up to ${waveHeight.toFixed(1)} meters, about the height of a 3-story building. Widespread coastal flooding is expected.`;
  if (waveHeight < 30) return `A major tsunami with waves up to ${waveHeight.toFixed(1)} meters high. Catastrophic for coastal cities and infrastructure.`;
  return `A mega-tsunami with waves exceeding ${waveHeight.toFixed(1)} meters. This would cause devastation on a continental scale.`;
};


export const ThreatSummary: React.FC<{ metrics: CalculatedMetrics }> = ({ metrics }) => {
  const tooltipText = "This summary translates the technical data into relatable terms to help visualize the scale and potential effects of the impact event.";
  const { energetics, crater, seismic, tsunami, shockwave } = metrics;

  return (
    <MetricCardGroup 
      title="Impact Visualization Summary" 
      titleTooltip={tooltipText}
    >
      <div className="space-y-6 p-4">
        <AnalogyCard
          iconType="energy"
          title="Impact Energy"
          value={(energetics.tntEquivalent / 1000).toFixed(2)}
          unit="Megatons"
          analogyText={getEnergyAnalogy(energetics.tntEquivalent)}
        />

        {crater.craterDiameter > 0 && (
          <AnalogyCard
            iconType="crater"
            title="Crater Size"
            value={(crater.craterDiameter / 1000).toFixed(2)}
            unit="km Diameter"
            analogyText={getCraterAnalogy(crater.craterDiameter / 1000)}
          />
        )}

        <ShockwaveExplanation
            lethalKm={shockwave.lethalRadius}
            severeKm={shockwave.severeDamageRadius}
            moderateKm={shockwave.moderateDamageRadius}
            lightKm={shockwave.lightDamageRadius}
        />
        
        <AnalogyCard
          iconType="seismic"
          title="Seismic Shock"
          value={seismic.seismicMagnitude.toFixed(1)}
          unit="Magnitude (Mw)"
          analogyText={getSeismicAnalogy(seismic.seismicMagnitude)}
        />
        
        {metrics.topographyEffects.impactLocationElevation !== undefined && metrics.topographyEffects.impactLocationElevation <= 0 && (
          <AnalogyCard
            iconType="tsunami"
            title="Tsunami Potential"
            value={tsunami.initialWaveHeight.toFixed(1)}
            unit="m Wave Height"
            analogyText={getTsunamiAnalogy(tsunami.initialWaveHeight, tsunami.isTsunamiPossible)}
          />
        )}
      </div>
    </MetricCardGroup>
  );
};