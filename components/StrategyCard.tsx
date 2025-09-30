import React from 'react';

interface StrategyCardProps {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  feasibility: string;
}

const getFeasibilityClass = (feasibility: string) => {
  switch (feasibility.toLowerCase()) {
    case 'high':
      return 'bg-green-500 text-green-900';
    case 'medium':
      return 'bg-yellow-500 text-yellow-900';
    case 'low':
      return 'bg-red-500 text-red-900';
    default:
      return 'bg-gray-500 text-gray-900';
  }
};

export const StrategyCard: React.FC<StrategyCardProps> = ({ title, description, pros, cons, feasibility }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-sky-500/20 rounded-lg p-6 space-y-4 box-glow transition-all hover:border-sky-400/50">
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-2xl font-bold text-sky-300 text-glow">{title}</h3>
        <span className={`flex-shrink-0 px-3 py-1 text-sm font-bold rounded-full ${getFeasibilityClass(feasibility)}`}>
          {feasibility}
        </span>
      </div>
      <p className="text-gray-300">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-green-400 mb-2">Advantages</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            {pros.map((pro, index) => <li key={index}>{pro}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-400 mb-2">Disadvantages</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            {cons.map((con, index) => <li key={index}>{con}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};
