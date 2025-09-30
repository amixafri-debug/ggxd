import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-5xl md:text-6xl font-bold text-sky-300 text-glow tracking-widest uppercase">
        Pleiades Control
      </h1>
      <p className="text-sky-400 opacity-80 mt-2">NEO Risk Analysis Terminal</p>
    </header>
  );
};
