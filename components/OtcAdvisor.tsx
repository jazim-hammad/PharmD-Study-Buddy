import React, { useState } from 'react';
import { generateOtcRecommendation } from '../services/geminiService';
import { OtcRecommendationInfo } from '../types';
import { OtcRecommendationCard } from './OtcRecommendationCard';
import { Loader } from './Loader';

export const OtcAdvisor: React.FC = () => {
  const [patientCase, setPatientCase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<OtcRecommendationInfo | null>(null);

  const handleGenerate = async () => {
    if (!patientCase.trim()) {
      setError('Please enter a patient case description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const result = await generateOtcRecommendation(patientCase);
      setRecommendation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-700 mb-2">OTC Advisor</h2>
        <p className="text-slate-500 mb-4">Describe a patient's symptoms and conditions to get an educational OTC recommendation.</p>
        <div className="flex flex-col gap-3">
          <textarea
            value={patientCase}
            onChange={(e) => setPatientCase(e.target.value)}
            placeholder="e.g., A 35-year-old male with a headache and stuffy nose, has high blood pressure."
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow min-h-[100px] resize-y bg-white text-slate-900 placeholder:text-slate-500"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex justify-center items-center self-start bg-cyan-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? <Loader /> : 'Get Recommendation'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {isLoading && (
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-600">Analyzing patient case and consulting guidelines...</p>
        </div>
      )}
      
      {recommendation && 
        <div className="animate-fade-in">
          <OtcRecommendationCard data={recommendation} />
        </div>
      }
    </div>
  );
};