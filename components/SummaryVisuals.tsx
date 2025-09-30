import React from 'react';

type IconType = 'tsunami' | 'energy' | 'shockwave' | 'crater' | 'seismic';

// Fix: Refactored ICONS from an object of React elements to an object of functional components.
// This allows passing props like `className` directly and avoids TypeScript errors with `React.cloneElement`.
const ICONS: { [key in IconType]: React.FC<{ className?: string }> } = {
  tsunami: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7" />
      <path d="M2 7c.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7" />
       <path d="M2 17c.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7" />
    </svg>
  ),
  energy: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 L14 10 L22 10 L16 15 L18 22 L12 18 L6 22 L8 15 L2 10 L10 10 Z"/>
    </svg>
  ),
  shockwave: ({ className }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 10 L19 4 L5 4 L3.5 10" />
      <path d="M4 10 L4 20 L20 20 L20 10" />
      <path d="M12 10 L12 20" />
      <path d="M8 20 L8 15" />
      <path d="M16 20 L16 15" />
      <path d="M10 4 L14 4" />
      <path d="M6 8 L18 8" />
    </svg>
  ),
  crater: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12,2a10,10 0 1,0 10,10A10,10 0 0,0 12,2M12,8a4,4 0 1,1 -4,4A4,4 0 0,1 12,8Z" />
    </svg>
  ),
  seismic: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 12 5 12 7 6 10 18 13 6 16 18 19 12 22 12" />
    </svg>
  ),
};

interface AnalogyCardProps {
  iconType: IconType;
  title: string;
  value: string;
  unit: string;
  analogyText: string;
}

export const AnalogyCard: React.FC<AnalogyCardProps> = ({ iconType, title, value, unit, analogyText }) => {
  // Fix: Render icon as a component instead of using cloneElement to resolve type errors.
  const Icon = ICONS[iconType];
  return (
    <div className="flex items-start gap-6 bg-slate-900/40 p-4 rounded-lg border border-sky-700/20">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-800 rounded-full">
        <Icon className="h-7 w-7 text-sky-400" />
      </div>
      <div className="w-full">
        <h4 className="text-xl font-bold text-sky-300">{title}</h4>
        <p className="text-2xl font-mono text-white mb-2">
          {value} <span className="text-lg text-gray-400 font-sans">{unit}</span>
        </p>
        <p className="text-gray-300 text-base">{analogyText}</p>
      </div>
    </div>
  );
};

interface ShockwaveExplanationProps {
  lethalKm: number;
  severeKm: number;
  moderateKm: number;
  lightKm: number;
}

const DamageRow: React.FC<{level: string, radiusKm: number, description: string, color: string}> = ({level, radiusKm, description, color}) => (
    <div className="grid grid-cols-3 gap-4 items-center border-t border-slate-700 py-3">
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="font-semibold text-white">{level}</span>
        </div>
        <div className="font-mono text-sky-300 text-center">{radiusKm.toFixed(1)} km radius</div>
        <div className="text-gray-400 text-sm">{description}</div>
    </div>
);


export const ShockwaveExplanation: React.FC<ShockwaveExplanationProps> = ({lethalKm, severeKm, moderateKm, lightKm}) => {
    // Fix: Render icon as a component instead of using cloneElement to resolve type errors.
    const Icon = ICONS['shockwave'];
    return (
        <div className="flex items-start gap-6 bg-slate-900/40 p-4 rounded-lg border border-sky-700/20">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-800 rounded-full">
                <Icon className="h-7 w-7 text-sky-400" />
            </div>
            <div className="w-full">
                <h4 className="text-xl font-bold text-sky-300 mb-2">Atmospheric Shockwave</h4>
                <div className="text-sm">
                    <div className="grid grid-cols-3 gap-4 font-bold text-sky-400/80 pb-2">
                        <span>Severity</span>
                        <span className="text-center">Effect Radius</span>
                        <span>Description</span>
                    </div>
                    <DamageRow level="Lethal" radiusKm={lethalKm} description="Total destruction of most buildings." color="bg-red-600" />
                    <DamageRow level="Severe" radiusKm={severeKm} description="Residences collapse, widespread fatalities." color="bg-orange-500" />
                    <DamageRow level="Moderate" radiusKm={moderateKm} description="Widespread window shattering, some structural damage." color="bg-yellow-400" />
                    <DamageRow level="Light" radiusKm={lightKm} description="Windows break, minor damage to some structures." color="bg-lime-400" />
                </div>
            </div>
        </div>
    );
};
