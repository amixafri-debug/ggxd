import React from 'react';

interface EntryParametersControlProps {
  impactAngle: number;
  onAngleChange: (angle: number) => void;
  impactVelocity: number;
  onVelocityChange: (velocity: number) => void;
}

const Slider: React.FC<{
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}> = ({ label, value, onChange, min, max, step, unit }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-baseline mb-2">
      <label className="text-sky-300 font-semibold">{label}</label>
      <span className="font-mono text-lg text-white">{value.toFixed(1)} {unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
    />
  </div>
);

export const EntryParametersControl: React.FC<EntryParametersControlProps> = ({
  impactAngle,
  onAngleChange,
  impactVelocity,
  onVelocityChange,
}) => {
  // A reasonable range for impact velocities.
  const VELOCITY_RANGE = { min: 10, max: 75 };
  const ANGLE_RANGE = { min: 1, max: 90 };

  return (
    <div className="p-6 bg-slate-800/30 backdrop-blur-sm border border-sky-500/20 rounded-lg box-glow space-y-6">
      <h3 className="text-xl font-bold text-sky-300 text-glow text-center border-b-2 border-sky-500/30 pb-3">
        Entry Parameter Simulation
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Slider
          label="Entry Angle"
          value={impactAngle}
          onChange={(e) => onAngleChange(parseFloat(e.target.value))}
          min={ANGLE_RANGE.min}
          max={ANGLE_RANGE.max}
          step={1}
          unit="°"
        />
        <Slider
          label="Impact Velocity"
          value={impactVelocity}
          onChange={(e) => onVelocityChange(parseFloat(e.target.value))}
          min={VELOCITY_RANGE.min}
          max={VELOCITY_RANGE.max}
          step={0.5}
          unit="km/s"
        />
      </div>
    </div>
  );
};