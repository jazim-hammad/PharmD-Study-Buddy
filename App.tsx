
import React, { useState } from 'react';
import { DrugInfoGenerator } from './components/DrugInfoGenerator';
import { Quizzer } from './components/Quizzer';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { AppMode } from './types';
import { OtcAdvisor } from './components/OtcAdvisor';
import { StudyNotesGenerator } from './components/StudyNotesGenerator';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DRUG_INFO);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      <Header />
      <main className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <Tabs activeTab={mode} onTabChange={setMode} />
        <div className="mt-6">
          {mode === AppMode.DRUG_INFO && <DrugInfoGenerator />}
          {mode === AppMode.QUIZZER && <Quizzer />}
          {mode === AppMode.OTC_ADVISOR && <OtcAdvisor />}
          {mode === AppMode.STUDY_NOTES_GENERATOR && <StudyNotesGenerator />}
        </div>
      </main>
      <footer className="w-full text-center p-4 text-xs text-slate-500 mt-auto">
        <p>Disclaimer: This tool is for educational purposes only and is not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
