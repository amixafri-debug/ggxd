import React from 'react';

interface ThreatBarProps {
  label: string;
  level: number;
  iconType: 'tsunami' | 'energy' | 'damage';
}

// Fix: Use React.ReactElement instead of JSX.Element to avoid namespace error.
const ICONS: { [key: string]: React.ReactElement } = {
  tsunami: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7" />
      <path d="M2 7c.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7" />
       <path d="M2 17c.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7.9.9 2.1 1.7 3.5 1.7 1.4 0 2.6-.8 3.5-1.7" />
    </svg>
  ),
  energy: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 L14 10 L22 10 L16 15 L18 22 L12 18 L6 22 L8 15 L2 10 L10 10 Z"/>
    </svg>
  ),
  damage: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 10 L19 4 L5 4 L3.5 10" />
      <path d="M4 10 L4 20 L20 20 L20 10" />
      <path d="M12 10 L12 20" />
      <path d="M8 20 L8 15" />
      <path d="M16 20 L16 15" />
      <path d="M10 4 L14 4" />
      <path d="M6 8 L18 8" />
    </svg>
  )
};

const THREAT_LEVELS = [
  { text: 'None', color: 'bg-gray-700', textColor: 'text-gray-400' },
  { text: 'Minimal', color: 'bg-green-600', textColor: 'text-green-300' },
  { text: 'Low', color: 'bg-lime-600', textColor: 'text-lime-300' },
  { text: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-200' },
  { text: 'High', color: 'bg-orange-600', textColor: 'text-orange-200' },
  { text: 'Extreme', color: 'bg-red-700', textColor: 'text-red-300' },
];

export const ThreatBar: React.FC<ThreatBarProps> = ({ label, level, iconType }) => {
  const maxLevel = 5;
  const levelData = THREAT_LEVELS[level];

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-16 text-center">
        {ICONS[iconType]}
      </div>
      <div className="w-full">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sky-300 font-bold text-lg">{label}</span>
          <span className={`font-bold text-sm ${levelData.textColor}`}>{levelData.text}</span>
        </div>
        <div className="flex h-6 rounded-md bg-slate-900/50 border border-slate-700 overflow-hidden">
          {Array.from({ length: maxLevel }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-slate-700 last:border-r-0">
              <div
                className={`h-full w-full transition-colors duration-500 ${
                  i < level ? levelData.color : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};