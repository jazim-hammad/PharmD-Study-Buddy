
export enum AppMode {
  DRUG_INFO = 'drug-info',
  QUIZZER = 'quizzer',
  OTC_ADVISOR = 'otc-advisor',
  STUDY_NOTES_GENERATOR = 'study-notes-generator',
}

export interface DrugCardInfo {
  drugName: string;
  drugClass: string;
  mechanismOfAction: string;
  commonUses: string[];
  sideEffects: string[];
  contraindications: string;
  mnemonic: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum QuizStatus {
  NOT_STARTED,
  IN_PROGRESS,
  FINISHED,
}

export interface OtcRecommendationInfo {
  recommendedDrug: string;
  reasoning: string;
  counselingPoints: string[];
  warnings: string[];
  whenToSeeDoctor: string;
}

export enum StudyContentType {
  FLASHCARDS = 'Flashcards',
  NOTES = 'Summary Notes',
  OBJECTIVES = 'Learning Objectives',
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface SummaryNotes {
  title: string;
  summaryPoints: string[];
}

export interface LearningObjectives {
  mainTopic: string;
  learningObjectives: string[];
}

export type GeneratedStudyContent = Flashcard[] | SummaryNotes | LearningObjectives;
