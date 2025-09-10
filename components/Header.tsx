
import React from 'react';
import { IconMortarPestle } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center p-4">
        <IconMortarPestle className="h-8 w-8 text-cyan-600" />
        <h1 className="ml-3 text-2xl font-bold text-slate-800 tracking-tight">
          PharmD Study Buddy
        </h1>
      </div>
    </header>
  );
};
