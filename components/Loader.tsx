import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center p-8">
      <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sky-300 text-lg">{message || 'Calculating...'}</p>
    </div>
  );
};
