import React from 'react';
import type { NEOListItem } from '../types';

interface NEOSelectorProps {
  neoList: NEOListItem[];
  selectedNeoId: string;
  onSelect: (neoId: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export const NEOSelector: React.FC<NEOSelectorProps> = ({ neoList, selectedNeoId, onSelect, onFetch, isLoading }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNeoId) {
      onFetch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-4">
      <select
        value={selectedNeoId}
        onChange={(e) => onSelect(e.target.value)}
        disabled={isLoading || neoList.length === 0}
        className="bg-slate-800/50 border border-sky-500/30 text-white placeholder-gray-500 rounded-md py-3 px-4 w-full sm:w-auto focus:ring-2 focus:ring-sky-400 focus:outline-none transition appearance-none text-center"
      >
        <option value="" disabled>
          {neoList.length > 0 ? 'Select an object...' : 'Loading NEO list...'}
        </option>
        {neoList.map((neo) => (
          <option key={neo.id} value={neo.id}>
            {neo.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isLoading || !selectedNeoId}
        className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded-md transition-all duration-300 disabled:bg-sky-800 disabled:cursor-not-allowed disabled:text-gray-400 box-glow text-lg w-full sm:w-auto"
      >
        {isLoading ? 'Analyzing...' : 'Analyze NEO'}
      </button>
    </form>
  );
};
