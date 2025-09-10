
import React from 'react';
import { GeneratedStudyContent, StudyContentType, Flashcard, SummaryNotes, LearningObjectives } from '../types';

interface StudyContentDisplayProps {
  content: GeneratedStudyContent;
  type: StudyContentType;
}

const FlashcardView: React.FC<{ cards: Flashcard[] }> = ({ cards }) => (
  <div className="space-y-4">
    {cards.map((card, index) => (
      <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
        <p className="font-semibold text-slate-700">
          <span className="text-cyan-600">Q:</span> {card.question}
        </p>
        <hr className="my-2 border-slate-200" />
        <p className="text-slate-600">
          <span className="font-semibold text-teal-600">A:</span> {card.answer}
        </p>
      </div>
    ))}
  </div>
);

const SummaryNotesView: React.FC<{ notes: SummaryNotes }> = ({ notes }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-800 mb-4">{notes.title}</h3>
    <ul className="list-disc list-inside space-y-2 text-slate-700">
      {notes.summaryPoints.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
);

const LearningObjectivesView: React.FC<{ objectives: LearningObjectives }> = ({ objectives }) => (
  <div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">Learning Objectives for: {objectives.mainTopic}</h3>
    <ul className="list-decimal list-inside space-y-2 text-slate-700 mt-4">
      {objectives.learningObjectives.map((objective, index) => (
        <li key={index}>{objective}</li>
      ))}
    </ul>
  </div>
);


export const StudyContentDisplay: React.FC<StudyContentDisplayProps> = ({ content, type }) => {
  const renderContent = () => {
    switch (type) {
      case StudyContentType.FLASHCARDS:
        return <FlashcardView cards={content as Flashcard[]} />;
      case StudyContentType.NOTES:
        return <SummaryNotesView notes={content as SummaryNotes} />;
      case StudyContentType.OBJECTIVES:
        return <LearningObjectivesView objectives={content as LearningObjectives} />;
      default:
        return <p>Unsupported content type.</p>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{type}</h2>
        <p className="text-slate-600">Generated from your document.</p>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
};
