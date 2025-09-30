import React from 'react';
import type { CalculatedMetrics, NEOData } from '../types';
import { MetricCardGroup } from './MetricCard';
import { CalculationBlock } from './CalculationBlock';
import { PHYSICAL_CONSTANTS, ASTEROID_DENSITIES } from '../pleiades-protocol-main/pleiades-ui/src/constants';

const formatNumber = (num: number, precision: number = 3) => {
  if (num === 0) return "0";
  if (Math.abs(num) > 0 && Math.abs(num) < 1e-3) return num.toExponential(precision);

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
      const value = (num / tier.value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: precision });
      return `${value} ${tier.symbol}`;
    }
  }

  return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: precision });
};

export const CalculationDetails: React.FC<{ metrics: CalculatedMetrics; neoData: NEOData }> = ({ metrics }) => {
  const impactVelocityMeters = metrics.entry.impactVelocity * 1000;
  const { topographyEffects } = metrics;
  const hasLocationData = topographyEffects.impactLocationElevation !== undefined;

  return (
    <div className="space-y-8">
      <div className="text-center p-4 bg-slate-800/50 backdrop-blur-sm border border-sky-500/20 rounded-lg box-glow">
        <h2 className="text-3xl font-bold text-sky-300 text-glow">Calculation Details: {metrics.name}</h2>
      </div>

      <MetricCardGroup title="Impact Energetics">
        <CalculationBlock
          title="Estimated Mass (Assuming Stony Asteroid)"
          formula="M = ρ × (4/3) × π × (D/2)³"
          calculation={`${formatNumber(ASTEROID_DENSITIES.S_TYPE)} kg/m³ × (4/3) × π × (${formatNumber(metrics.diameter / 2)} m)³`}
          result={`${formatNumber(metrics.energetics.mass)} kg`}
        />
        <CalculationBlock
          title="Kinetic Energy"
          formula="Eₖ = 0.5 × M × v²"
          calculation={`0.5 × ${formatNumber(metrics.energetics.mass)} kg × (${formatNumber(impactVelocityMeters)} m/s)²`}
          result={`${formatNumber(metrics.energetics.kineticEnergy)} Joules`}
        />
        <CalculationBlock
          title="TNT Equivalent"
          formula="TNTₖₜ = Eₖ / E₍J/kt₎"
          calculation={`${formatNumber(metrics.energetics.kineticEnergy)} J / ${PHYSICAL_CONSTANTS.TNT_JOULES.toExponential(3)} J/kt`}
          result={`${formatNumber(metrics.energetics.tntEquivalent)} kilotons`}
        />
      </MetricCardGroup>

      <MetricCardGroup title="Crater Formation (Holsapple-Schmidt Scaling)">
        <CalculationBlock
          title="Crater Diameter"
          formula="D꜀ᵣ = 1.161 × (ρₐₛₜ/ρₒᵦⱼ)¹ᐟ³ × (gD/2v²)⁻⁰·²² × D × sin(θ)¹ᐟ³"
          calculation={`1.161 × (${formatNumber(ASTEROID_DENSITIES.S_TYPE)}/${formatNumber(PHYSICAL_CONSTANTS.RHO_TARGET_ROCK)})¹ᐟ³ × (${formatNumber(PHYSICAL_CONSTANTS.GRAVITY)}×${formatNumber(metrics.diameter)}/2×${formatNumber(impactVelocityMeters)}²)⁻⁰·²² × ${formatNumber(metrics.diameter)} × sin(${metrics.entry.impactAngle}°)¹ᐟ³`}
          result={`${formatNumber(metrics.crater.craterDiameter)} meters`}
        />
         <CalculationBlock
          title="Crater Depth (Approx.)"
          formula="P꜀ᵣ ≈ D꜀ᵣ / 3"
          calculation={`${formatNumber(metrics.crater.craterDiameter)} m / 3`}
          result={`${formatNumber(metrics.crater.craterDepth)} meters`}
        />
      </MetricCardGroup>

      <MetricCardGroup title="Atmospheric Shockwave (Empirical Formula)">
         <CalculationBlock
          title="Base Damage Radius (Sea Level)"
          formula="R = C × Y¹ᐟ³"
          calculation={`Where 'Y' is the energy in kilotons (${formatNumber(metrics.energetics.tntEquivalent)} kt) and 'C' is a damage constant.`}
          result={
            `Lethal (C=1.5): ${formatNumber(metrics.shockwave.lethalRadius)} km\n` +
            `Severe (C=2.5): ${formatNumber(metrics.shockwave.severeDamageRadius)} km\n` +
            `Moderate (C=4.6): ${formatNumber(metrics.shockwave.moderateDamageRadius)} km\n` +
            `Light (C=10.0): ${formatNumber(metrics.shockwave.lightDamageRadius)} km`
          }
        />
      </MetricCardGroup>
      
      <MetricCardGroup title="Topographic & Bathymetric Effects">
        {hasLocationData ? (
           <>
            <CalculationBlock
              title="Impact Type (Specific Location)"
              formula={topographyEffects.impactLocationElevation! < 0 ? "If D/d < 0.17 ⇒ Deep Water" : "Elevation > 0 ⇒ Land"}
              calculation={topographyEffects.impactLocationElevation! < 0 ? `${formatNumber(metrics.diameter)}m / ${formatNumber(Math.abs(topographyEffects.impactLocationElevation!))}m = ${formatNumber(metrics.diameter / Math.abs(topographyEffects.impactLocationElevation!))}` : `Elevation of ${formatNumber(topographyEffects.impactLocationElevation!)}m`}
              result={`Considered Impact: ${topographyEffects.oceanImpactType}`}
            />
            <CalculationBlock
              title="Altitude-Corrected Damage Radius"
              formula="R(h) = R₀ × (ρ₀/ρ(h))⁰·³"
              calculation={`Modification Factor: (${PHYSICAL_CONSTANTS.RHO_AIR_SEA_LEVEL.toFixed(3)} / ρ_atm(${formatNumber(topographyEffects.impactLocationElevation!)}m))⁰·³`}
              result={`Factor: ${formatNumber(topographyEffects.locationDamageRadiusModifier!, 2)}x (${topographyEffects.locationDamageRadiusModifier! > 1 ? '+' : ''}${formatNumber((topographyEffects.locationDamageRadiusModifier! - 1) * 100, 1)}%)`}
            />
           </>
        ) : (
          <>
            <CalculationBlock
              title="Ocean Impact Criterion (Hypothetical, d=4km)"
              formula="If D/d < 0.17 ⇒ Deep Water"
              calculation={`${formatNumber(metrics.diameter)}m / 4000m = ${formatNumber(metrics.diameter/4000)}`}
              result={`Result is < 0.17, therefore it is considered a ${topographyEffects.oceanImpactTypeHypothetical} impact`}
            />
            <CalculationBlock
              title="Water Penetration Depth"
              formula="dₚₑₙ = (ρₐ/ρₙ) × D × (v/vₛₒᵤₙ┱)⁰·⁵"
              calculation={`(${ASTEROID_DENSITIES.S_TYPE}/${PHYSICAL_CONSTANTS.RHO_WATER}) × ${formatNumber(metrics.diameter)}m × (${formatNumber(impactVelocityMeters)}/${PHYSICAL_CONSTANTS.SOUND_SPEED_WATER})⁰·⁵`}
              result={`${formatNumber(topographyEffects.penetrationDepthHypothetical)} meters`}
            />
          </>
        )}
      </MetricCardGroup>
    </div>
  );
};