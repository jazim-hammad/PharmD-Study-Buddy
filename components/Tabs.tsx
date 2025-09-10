
import React from 'react';
import { AppMode } from '../types';
import { IconBookOpen, IconClipboardCheck, IconPill, IconQuiz } from './Icons';

interface TabsProps {
  activeTab: AppMode;
  onTabChange: (tab: AppMode) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppMode.DRUG_INFO, label: 'Drug Cards', icon: <IconPill className="w-5 h-5 mr-2" /> },
    { id: AppMode.STUDY_NOTES_GENERATOR, label: 'Study Tools', icon: <IconBookOpen className="w-5 h-5 mr-2" /> },
    { id: AppMode.QUIZZER, label: 'Quizzer', icon: <IconQuiz className="w-5 h-5 mr-2" /> },
    { id: AppMode.OTC_ADVISOR, label: 'OTC Advisor', icon: <IconClipboardCheck className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${activeTab === tab.id
                ? 'border-cyan-500 text-cyan-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
