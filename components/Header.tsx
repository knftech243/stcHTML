
import React from 'react';
import { Icon } from './Icon';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Icon name="logo" className="w-10 h-10 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Convertisseur Statique vers Dynamique
          </h1>
        </div>
        <a 
          href="https://github.com/google/generative-ai-docs" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-2 text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <Icon name="github" className="w-6 h-6" />
          <span className="hidden sm:block">Voir sur GitHub</span>
        </a>
      </div>
    </header>
  );
};
