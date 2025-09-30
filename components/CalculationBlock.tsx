import React from 'react';

interface CalculationBlockProps {
  title: string;
  formula: React.ReactNode;
  calculation: React.ReactNode;
  result: string;
}

export const CalculationBlock: React.FC<CalculationBlockProps> = ({ title, formula, calculation, result }) => {
  return (
    <div className="bg-slate-900/50 p-4 rounded-md border border-sky-700/30 space-y-3">
      <h4 className="text-lg font-bold text-sky-300">{title}</h4>
      <div className="font-mono text-sm bg-black/30 p-3 rounded">
        <p className="text-gray-400">Formula:</p>
        <p className="text-sky-400 text-base">{formula}</p>
      </div>
      <div className="font-mono text-sm bg-black/30 p-3 rounded">
        <p className="text-gray-400">Substitution:</p>
        <p className="text-white text-base break-words">{calculation}</p>
      </div>
       <div className="font-mono text-sm bg-black/30 p-3 rounded">
        <p className="text-gray-400">Result:</p>
        <p className="text-green-400 font-bold text-base whitespace-pre-wrap">{result}</p>
      </div>
    </div>
  );
};
