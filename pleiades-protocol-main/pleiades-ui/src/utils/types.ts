export interface NEOListItem {
  id: string;
  name: string;
}

export interface NEOData {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: {
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }[];
  orbital_data: {
    semi_major_axis: string;
    eccentricity: string;
    inclination: string;
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ImpactOptions {
  impactAngle: number;
  impactVelocity: number; // in km/s
  elevation?: number; // in meters
}

export interface CalculatedMetrics {
  name: string;
  isHazardous: boolean;
  diameter: number;
  entry: {
    impactVelocity: number;
    impactAngle: number;
    dynamicPressure: number;
  };
  energetics: {
    mass: number;
    kineticEnergy: number;
    tntEquivalent: number;
  };
  crater: {
    craterDiameter: number;
    craterDepth: number;
  };
  seismic: {
    seismicMagnitude: number;
  };
  tsunami: {
    isTsunamiPossible: boolean;
    initialWaveHeight: number;
  };
  orbital: {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
  };
  shockwave: {
    lethalRadius: number;
    severeDamageRadius: number;
    moderateDamageRadius: number;
    lightDamageRadius: number;
  };
  topographyEffects: {
    impactLocationElevation?: number;
    oceanImpactType?: 'Deep Water' | 'Shallow Water' | 'Land';
    locationDamageRadiusModifier?: number;
    oceanImpactTypeHypothetical: 'Deep Water' | 'Shallow Water';
    penetrationDepthHypothetical: number;
    mountainDamageFactor: number;
    valleyDamageFactor: number;
  };
  visualRadii: {
    crater: number; // in meters
    tsunami: number; // in meters
    shockwave: {
      lethal: number; // in meters
      severe: number; // in meters
      moderate: number; // in meters
      light: number; // in meters
    };
  };
}