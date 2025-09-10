import React from 'react';
import { OtcRecommendationInfo } from '../types';
import { IconLightbulb, IconUserCheck, IconShieldExclamation, IconClipboardList } from './Icons';

interface OtcRecommendationCardProps {
  data: OtcRecommendationInfo;
}

interface CardSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'warning';
}

const CardSection: React.FC<CardSectionProps> = ({ title, icon, children, variant = 'default' }) => {
    const iconBgColor = variant === 'warning' ? 'bg-red-100' : 'bg-cyan-100';
    const iconTextColor = variant === 'warning' ? 'text-red-700' : 'text-cyan-700';

    return (
        <div className="py-4 border-b border-slate-200 last:border-b-0">
        <div className="flex items-center mb-2">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${iconBgColor} ${iconTextColor} flex items-center justify-center`}>
            {icon}
            </div>
            <h3 className="ml-3 text-lg font-semibold text-slate-700">{title}</h3>
        </div>
        <div className="pl-11 text-slate-600">{children}</div>
        </div>
    );
};


export const OtcRecommendationCard: React.FC<OtcRecommendationCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
        <p className="text-sm font-medium text-cyan-200">Recommended Product</p>
        <h2 className="text-3xl font-bold">{data.recommendedDrug}</h2>
      </div>

      <div className="p-6 divide-y divide-slate-200">
        <CardSection title="Reasoning" icon={<IconLightbulb className="w-5 h-5" />}>
          <p>{data.reasoning}</p>
        </CardSection>

        <CardSection title="Counseling Points" icon={<IconClipboardList className="w-5 h-5" />}>
          <ul className="list-disc list-inside space-y-1">
            {data.counselingPoints.map((point, index) => <li key={index}>{point}</li>)}
          </ul>
        </CardSection>

        <CardSection title="Warnings" icon={<IconShieldExclamation className="w-5 h-5" />} variant="warning">
          <ul className="list-disc list-inside space-y-1 text-red-800">
            {data.warnings.map((warning, index) => <li key={index}>{warning}</li>)}
          </ul>
        </CardSection>
        
        <CardSection title="When to See a Doctor" icon={<IconUserCheck className="w-5 h-5" />}>
            <p className="italic bg-slate-100 p-3 rounded-md">{data.whenToSeeDoctor}</p>
        </CardSection>
      </div>
    </div>
  );
};
