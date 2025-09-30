import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit }) => {
  return (
    <div className="bg-slate-900/50 p-4 rounded-md border border-sky-700/30">
      <h4 className="text-sm text-sky-400 uppercase tracking-wider">{title}</h4>
      <p className="text-2xl font-bold text-white">
        {value} <span className="text-lg text-gray-300 font-normal">{unit}</span>
      </p>
    </div>
  );
};


interface MetricCardGroupProps {
    title: string;
    children: React.ReactNode;
    titleTooltip?: string;
}

export const MetricCardGroup: React.FC<MetricCardGroupProps> = ({ title, children, titleTooltip }) => {
    return (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-sky-500/20 rounded-lg p-4 space-y-4 box-glow">
            <div className="flex items-center gap-2 border-b-2 border-sky-500/30 pb-2">
              <h3 className="text-xl font-bold text-sky-300 text-glow">{title}</h3>
              {titleTooltip && (
                <div className="relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400/70" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="absolute bottom-full mb-2 w-64 bg-slate-900 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-sky-500/30 shadow-lg z-10 -translate-x-1/2 left-1/2">
                    {titleTooltip}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {children}
            </div>
        </div>
    )
}
