import React from 'react';
import type { CalculatedMetrics, NEOData, Coordinates } from '../types';
import { MetricCard, MetricCardGroup } from './MetricCard';

interface DashboardProps {
  metrics: CalculatedMetrics;
  neoData: NEOData;
  selectedCoords: Coordinates | null;
}

const formatNumber = (num: number, digits = 2) => {
  if (num === 0) return "0";
  if (Math.abs(num) > 0 && Math.abs(num) < 1e-2) return num.toExponential(digits);

  if (Math.abs(num) >= 1e6) {
    const tiers = [
      { value: 1e24, symbol: "septillion" },
      { value: 1e21, symbol: "sextillion" },
      { value: 1e18, symbol: "quintillion" },
      { value: 1e15, symbol: "quadrillion" },
      { value: 1e12, symbol: "trillion" },
      { value: 1e9, symbol: "billion" },
      { value: 1e6, symbol: "million" },
    ];
    const tier = tiers.find(t => Math.abs(num) >= t.value);
    if (tier) {
      const value = (num / tier.value).toLocaleString(undefined, { maximumFractionDigits: digits });
      return `${value} ${tier.symbol}`;
    }
  }

  return num.toLocaleString(undefined, { maximumFractionDigits: digits });
};

export const Dashboard: React.FC<DashboardProps> = ({ metrics, selectedCoords }) => {
  const { topographyEffects } = metrics;
  
  const getCraterTitle = () => {
    if (selectedCoords && topographyEffects.impactLocationElevation !== undefined && topographyEffects.impactLocationElevation < 0) {
      return "Seabed Crater";
    }
    return "Crater Formation (in rock)";
  };

  return (
    <div className="space-y-8">
      <div className="text-center p-4 bg-slate-800/50 backdrop-blur-sm border border-sky-500/20 rounded-lg box-glow">
        <h2 className="text-3xl font-bold text-sky-300 text-glow">Impact Analysis: {metrics.name}</h2>
        <p className={`mt-2 text-lg ${metrics.isHazardous ? 'text-red-400' : 'text-green-400'}`}>
          {metrics.isHazardous ? 'POTENTIALLY HAZARDOUS' : 'NOT HAZARDOUS'}
        </p>
        <p className="text-sm text-gray-400">Estimated Diameter: {formatNumber(metrics.diameter)} m</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCardGroup title="Entry Parameters">
          <MetricCard title="Impact Velocity" value={formatNumber(metrics.entry.impactVelocity)} unit="km/s" />
          <MetricCard title="Entry Angle" value={formatNumber(metrics.entry.impactAngle)} unit="degrees" />
          <MetricCard title="Dynamic Pressure (max)" value={formatNumber(metrics.entry.dynamicPressure)} unit="MPa" />
        </MetricCardGroup>

        <MetricCardGroup title="Impact Energetics">
          <MetricCard title="Estimated Mass" value={formatNumber(metrics.energetics.mass)} unit="kg" />
          <MetricCard title="Kinetic Energy" value={formatNumber(metrics.energetics.kineticEnergy)} unit="Joules" />
          <MetricCard title="TNT Equivalent" value={formatNumber(metrics.energetics.tntEquivalent / 1000)} unit="Megatons" />
        </MetricCardGroup>

        <MetricCardGroup title={getCraterTitle()}>
          {metrics.crater.craterDiameter > 0 ? (
            <>
              <MetricCard title="Crater Diameter" value={formatNumber(metrics.crater.craterDiameter / 1000)} unit="km" />
              <MetricCard title="Crater Depth" value={formatNumber(metrics.crater.craterDepth / 1000)} unit="km" />
            </>
          ) : (
            <p className="text-center text-gray-400 p-4">No crater forms on the seabed.</p>
          )}
        </MetricCardGroup>
        
        <MetricCardGroup title="Seismic Effects">
            <MetricCard title="Seismic Magnitude (Mw)" value={formatNumber(metrics.seismic.seismicMagnitude)} unit="" />
        </MetricCardGroup>

        <MetricCardGroup title="Tsunamis (Oceanic Impact)">
            <MetricCard title="Tsunami Possibility" value={metrics.tsunami.isTsunamiPossible ? 'High' : 'Low'} unit="" />
            {metrics.tsunami.isTsunamiPossible && <MetricCard title="Initial Wave Height (est.)" value={formatNumber(metrics.tsunami.initialWaveHeight)} unit="m" />}
        </MetricCardGroup>

        <MetricCardGroup title="Orbital Parameters">
            <MetricCard title="Semi-Major Axis" value={formatNumber(metrics.orbital.semiMajorAxis)} unit="AU" />
            <MetricCard title="Eccentricity" value={formatNumber(metrics.orbital.eccentricity)} unit="" />
            <MetricCard title="Inclination" value={formatNumber(metrics.orbital.inclination)} unit="degrees" />
        </MetricCardGroup>
      </div>
      
       <MetricCardGroup title="Atmospheric Shockwave Damage Zones (Base Radius)">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Lethal Radius (~35 kPa)" value={formatNumber(metrics.shockwave.lethalRadius)} unit="km" />
            <MetricCard title="Severe Damage (~17 kPa)" value={formatNumber(metrics.shockwave.severeDamageRadius)} unit="km" />
            <MetricCard title="Moderate Damage (~7 kPa)" value={formatNumber(metrics.shockwave.moderateDamageRadius)} unit="km" />
            <MetricCard title="Light Damage (~3 kPa)" value={formatNumber(metrics.shockwave.lightDamageRadius)} unit="km" />
          </div>
       </MetricCardGroup>

      {selectedCoords && topographyEffects.impactLocationElevation !== undefined ? (
        <MetricCardGroup title={`Location-Specific Analysis (${formatNumber(selectedCoords.lat, 4)}, ${formatNumber(selectedCoords.lng, 4)})`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard title="Elevation/Depth" value={formatNumber(topographyEffects.impactLocationElevation)} unit="m" />
              <MetricCard title="Impact Type" value={topographyEffects.oceanImpactType || 'N/A'} unit="" />
              {topographyEffects.locationDamageRadiusModifier !== undefined && topographyEffects.oceanImpactType === 'Land' && (
                <MetricCard 
                  title="Damage Radius Modifier" 
                  value={`${topographyEffects.locationDamageRadiusModifier > 1 ? '+' : ''}${formatNumber((topographyEffects.locationDamageRadiusModifier - 1) * 100)}%`} 
                  unit="" />
              )}
          </div>
        </MetricCardGroup>
      ) : (
       <MetricCardGroup title="Topographic & Bathymetric Effects (Hypothetical Scenarios)">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard title="Ocean Impact (4km depth)" value={topographyEffects.oceanImpactTypeHypothetical} unit="" />
            <MetricCard title="Water Penetration" value={formatNumber(topographyEffects.penetrationDepthHypothetical)} unit="m" />
            <MetricCard title="Crater Mod. (Mountain)" value="-10%" unit="diameter" />
            <MetricCard title="Blast Wave Inc. (Mountain 3km)" value={`+${formatNumber((topographyEffects.mountainDamageFactor - 1) * 100)}%`} unit="radius" />
            <MetricCard title="Blast Wave Dec. (Valley -1km)" value={`${formatNumber((topographyEffects.valleyDamageFactor - 1) * 100)}%`} unit="radius" />
          </div>
       </MetricCardGroup>
      )}
    </div>
  );
};