import { ASTEROID_DENSITIES, PHYSICAL_CONSTANTS } from '../constants';
import type { NEOData, CalculatedMetrics, ImpactOptions } from '../types';

export function calculateImpactMetrics(neoData: NEOData, options: ImpactOptions): CalculatedMetrics {
  const { impactAngle, impactVelocity, elevation } = options;
  
  const diameter = (neoData.estimated_diameter.meters.estimated_diameter_min + neoData.estimated_diameter.meters.estimated_diameter_max) / 2;
  
  const impactVelocityMeters = impactVelocity * 1000; // m/s
  
  const impactAngleRad = impactAngle * (Math.PI / 180);

  const density = ASTEROID_DENSITIES.S_TYPE; // Assume stony asteroid
  const volume = (4/3) * Math.PI * Math.pow(diameter / 2, 3);
  const mass = density * volume;
  const kineticEnergy = 0.5 * mass * Math.pow(impactVelocityMeters, 2); // Joules
  const tntEquivalent = kineticEnergy / PHYSICAL_CONSTANTS.TNT_JOULES; // kilotons

  const g = PHYSICAL_CONSTANTS.GRAVITY;
  const v = impactVelocityMeters;
  const D = diameter;
  const rho_ast = density;
  const rho_target = PHYSICAL_CONSTANTS.RHO_TARGET_ROCK;
  
  // Base crater calculation for land impact
  let craterDiameter = 1.161 * Math.pow(rho_ast / rho_target, 1/3) * Math.pow((g * D) / (2 * Math.pow(v, 2)), -0.22) * D * Math.pow(Math.sin(impactAngleRad), 1/3);
  let craterDepth = craterDiameter / 3;

  const Y = tntEquivalent;
  const shockwaveConstants = { lethal: 1.5, severe: 2.5, moderate: 4.6, light: 10.0 };
  const lethalRadius = shockwaveConstants.lethal * Math.pow(Y, 1/3);
  const severeDamageRadius = shockwaveConstants.severe * Math.pow(Y, 1/3);
  const moderateDamageRadius = shockwaveConstants.moderate * Math.pow(Y, 1/3);
  const lightDamageRadius = shockwaveConstants.light * Math.pow(Y, 1/3);

  const seismicEnergy = kineticEnergy * PHYSICAL_CONSTANTS.SEISMIC_EFFICIENCY;
  const seismicMagnitudeMw = (2/3) * Math.log10(seismicEnergy) - 6.0;

  // Base tsunami calculation
  let isTsunamiPossible = false;
  let initialWaveHeight = 0;
  
  const dynamicPressure = PHYSICAL_CONSTANTS.RHO_AIR_SEA_LEVEL * Math.pow(impactVelocityMeters, 2) / 1e6; // in MPa

  const topographyEffects: CalculatedMetrics['topographyEffects'] = {} as any;
  const visualRadii: CalculatedMetrics['visualRadii'] = {
    crater: 0,
    tsunami: 0,
    shockwave: {
      lethal: lethalRadius * 1000,
      severe: severeDamageRadius * 1000,
      moderate: moderateDamageRadius * 1000,
      light: lightDamageRadius * 1000
    }
  };

  const hypotheticalOceanDepth = 4000; // meters
  topographyEffects.oceanImpactTypeHypothetical = (diameter / hypotheticalOceanDepth) < 0.17 ? 'Deep Water' : 'Shallow Water';
  const penetrationDepthInWater = (density / PHYSICAL_CONSTANTS.RHO_WATER) * diameter * Math.pow(impactVelocityMeters / PHYSICAL_CONSTANTS.SOUND_SPEED_WATER, 0.5);
  topographyEffects.penetrationDepthHypothetical = penetrationDepthInWater;

  const airDensityAtAltitude = (h: number) => PHYSICAL_CONSTANTS.RHO_AIR_SEA_LEVEL * Math.exp(-h / PHYSICAL_CONSTANTS.ATMOSPHERE_SCALE_HEIGHT);
  const mountainAltitude = 3000;
  const valleyAltitude = -1000;
  
  topographyEffects.mountainDamageFactor = Math.pow(PHYSICAL_CONSTANTS.RHO_AIR_SEA_LEVEL / airDensityAtAltitude(mountainAltitude), 0.3);
  topographyEffects.valleyDamageFactor = Math.pow(PHYSICAL_CONSTANTS.RHO_AIR_SEA_LEVEL / airDensityAtAltitude(valleyAltitude), 0.3);
  
  if (elevation !== undefined) {
    topographyEffects.impactLocationElevation = elevation;
    
    if (elevation > 0) { // Land impact
      topographyEffects.oceanImpactType = 'Land';
      const densityAtImpact = airDensityAtAltitude(elevation);
      const modifier = Math.pow(PHYSICAL_CONSTANTS.RHO_AIR_SEA_LEVEL / densityAtImpact, 0.3);
      topographyEffects.locationDamageRadiusModifier = modifier;
      visualRadii.shockwave.lethal *= modifier;
      visualRadii.shockwave.severe *= modifier;
      visualRadii.shockwave.moderate *= modifier;
      visualRadii.shockwave.light *= modifier;
      visualRadii.crater = craterDiameter;

    } else { // Water impact (includes sea level at elevation 0)
      const waterDepth = Math.abs(elevation);
      topographyEffects.oceanImpactType = (waterDepth > 0 && (diameter / waterDepth) < 0.17) ? 'Deep Water' : 'Shallow Water';
      topographyEffects.locationDamageRadiusModifier = 1.0; 
      isTsunamiPossible = kineticEnergy > 1e12; 

      if (isTsunamiPossible) {
        if (topographyEffects.oceanImpactType === 'Shallow Water') {
           initialWaveHeight = 0.5 * Math.sqrt(craterDiameter * g);
           visualRadii.tsunami = craterDiameter * 5; 
        } else {
           initialWaveHeight = 0.1 * Math.pow(kineticEnergy / (PHYSICAL_CONSTANTS.RHO_WATER * g), 0.25);
           visualRadii.tsunami = initialWaveHeight * 200;
        }
      }

      if (penetrationDepthInWater < waterDepth) {
        // Asteroid explodes in water column, no crater on seabed
        craterDiameter = 0;
        craterDepth = 0;
        visualRadii.crater = 0;
      } else {
        // Crater forms on seabed, we keep the calculated diameter
        visualRadii.crater = craterDiameter;
      }
    }
  } else {
     // No location selected, so only land-based crater is shown hypothetically
     visualRadii.crater = craterDiameter;
  }

  return {
    name: neoData.name.replace(/[()]/g, ''),
    isHazardous: neoData.is_potentially_hazardous_asteroid,
    diameter: diameter,
    entry: {
      impactVelocity: impactVelocity,
      impactAngle: impactAngle,
      dynamicPressure: dynamicPressure,
    },
    energetics: {
      mass: mass,
      kineticEnergy: kineticEnergy,
      tntEquivalent: tntEquivalent,
    },
    crater: {
      craterDiameter: craterDiameter,
      craterDepth: craterDepth,
    },
    seismic: {
      seismicMagnitude: seismicMagnitudeMw < 0 ? 0 : seismicMagnitudeMw,
    },
    tsunami: {
      isTsunamiPossible: isTsunamiPossible,
      initialWaveHeight: initialWaveHeight,
    },
    orbital: {
      semiMajorAxis: parseFloat(neoData.orbital_data.semi_major_axis),
      eccentricity: parseFloat(neoData.orbital_data.eccentricity),
      inclination: parseFloat(neoData.orbital_data.inclination),
    },
    shockwave: {
      lethalRadius: lethalRadius,
      severeDamageRadius: severeDamageRadius,
      moderateDamageRadius: moderateDamageRadius,
      lightDamageRadius: lightDamageRadius,
    },
    topographyEffects: topographyEffects,
    visualRadii: visualRadii,
  };
}