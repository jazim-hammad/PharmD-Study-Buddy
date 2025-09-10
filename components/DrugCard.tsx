import React from 'react';
import { DrugCardInfo } from '../types';
// FIX: Removed unused 'IconShieldExclamation' as it is not exported from './Icons'.
import { IconBrain, IconClipboardList, IconHeartbeat, IconSparkles, IconXCircle } from './Icons';

interface DrugCardProps {
  data: DrugCardInfo;
}

interface CardSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const CardSection: React.FC<CardSectionProps> = ({ title, icon, children }) => (
  <div className="py-4 border-b border-slate-200 last:border-b-0">
    <div className="flex items-center mb-2">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="ml-3 text-lg font-semibold text-slate-700">{title}</h3>
    </div>
    <div className="pl-11 text-slate-600">{children}</div>
  </div>
);

export const DrugCard: React.FC<DrugCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
        <h2 className="text-3xl font-bold">{data.drugName}</h2>
        <p className="text-cyan-100 font-medium mt-1">{data.drugClass}</p>
      </div>

      <div className="p-6 divide-y divide-slate-200">
        <CardSection title="Mechanism of Action" icon={<IconBrain className="w-5 h-5" />}>
          <p>{data.mechanismOfAction}</p>
        </CardSection>

        <CardSection title="Common Uses" icon={<IconClipboardList className="w-5 h-5" />}>
          <ul className="list-disc list-inside space-y-1">
            {data.commonUses.map((use, index) => <li key={index}>{use}</li>)}
          </ul>
        </CardSection>

        <CardSection title="Side Effects" icon={<IconHeartbeat className="w-5 h-5" />}>
          <ul className="list-disc list-inside space-y-1">
            {data.sideEffects.map((effect, index) => <li key={index}>{effect}</li>)}
          </ul>
        </CardSection>

        <CardSection title="Contraindications" icon={<IconXCircle className="w-5 h-5" />}>
          <p>{data.contraindications}</p>
        </CardSection>
        
        <CardSection title="Mnemonic" icon={<IconSparkles className="w-5 h-5" />}>
          <p className="italic text-teal-700 bg-teal-50 p-3 rounded-lg">{data.mnemonic}</p>
        </CardSection>
      </div>
    </div>
  );
};
