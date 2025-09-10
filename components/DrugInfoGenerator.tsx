import React, { useState } from 'react';
import { generateDrugCard } from '../services/geminiService';
import { DrugCardInfo } from '../types';
import { DrugCard } from './DrugCard';
import { Loader } from './Loader';
import { IconSearch } from './Icons';

export const DrugInfoGenerator: React.FC = () => {
  const [drugName, setDrugName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drugCard, setDrugCard] = useState<DrugCardInfo | null>(null);

  const handleGenerate = async () => {
    if (!drugName.trim()) {
      setError('Please enter a drug name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setDrugCard(null);

    try {
      const card = await generateDrugCard(drugName);
      setDrugCard(card);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Drug Card Generator</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Atorvastatin"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow bg-slate-800 text-slate-50 placeholder:text-slate-400"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex justify-center items-center bg-cyan-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? <Loader /> : 'Generate Card'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {isLoading && (
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-600">Consulting the digital pharmacopoeia...</p>
        </div>
      )}
      
      {drugCard && 
        <div className="animate-fade-in">
          <DrugCard data={drugCard} />
        </div>
      }
    </div>
  );
};
