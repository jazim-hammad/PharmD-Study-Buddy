
import React, { useState, useCallback } from 'react';
import { DRUG_CLASSES } from '../constants';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, QuizStatus } from '../types';
import { Loader } from './Loader';

interface QuestionDisplayProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  userAnswer: string | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, onAnswer, isAnswered, userAnswer }) => {
  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-slate-100 border-slate-300';
    }
    if (option === question.correctAnswer) {
      return 'bg-green-100 border-green-400 text-green-800 ring-2 ring-green-300';
    }
    if (option === userAnswer) {
      return 'bg-red-100 border-red-400 text-red-800';
    }
    return 'bg-slate-50 border-slate-200 text-slate-500';
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800 mb-6">{question.question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={isAnswered}
            className={`p-4 border rounded-lg text-left transition-all duration-200 ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};


export const Quizzer: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [status, setStatus] = useState<QuizStatus>(QuizStatus.NOT_STARTED);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);

  const startQuiz = useCallback(async (drugClass: string) => {
    setSelectedClass(drugClass);
    setIsLoading(true);
    setError(null);
    try {
      const quizQuestions = await generateQuiz(drugClass);
      if (quizQuestions && quizQuestions.length > 0) {
        setQuestions(quizQuestions);
        setStatus(QuizStatus.IN_PROGRESS);
        setCurrentQuestionIndex(0);
        setScore(0);
        setUserAnswers(Array(quizQuestions.length).fill(null));
      } else {
        setError("No questions were generated. Please try another category.");
        setStatus(QuizStatus.NOT_STARTED);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStatus(QuizStatus.NOT_STARTED);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswer = (answer: string) => {
    if (userAnswers[currentQuestionIndex] !== null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setStatus(QuizStatus.FINISHED);
    }
  };

  const resetQuiz = () => {
    setStatus(QuizStatus.NOT_STARTED);
    setSelectedClass(null);
    setQuestions([]);
  };

  if (status === QuizStatus.NOT_STARTED) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-700 mb-1">Select a Drug Class</h2>
        <p className="text-slate-500 mb-6">Choose a category to start your quiz.</p>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader />
            <span className="ml-4 text-slate-600">Generating your quiz...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {DRUG_CLASSES.map((drugClass) => (
              <button
                key={drugClass}
                onClick={() => startQuiz(drugClass)}
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-cyan-50 hover:border-cyan-200 hover:text-cyan-700 transition-colors"
              >
                {drugClass}
              </button>
            ))}
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    );
  }

  if (status === QuizStatus.FINISHED) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Quiz Complete!</h2>
        <p className="text-lg text-slate-600 mt-2">You scored</p>
        <p className="text-6xl font-extrabold text-cyan-600 my-4">{score} / {questions.length}</p>
        <p className="text-2xl font-semibold text-slate-700">({percentage}%)</p>
        <button
          onClick={resetQuiz}
          className="mt-8 bg-cyan-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Take Another Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentAnswered = userAnswers[currentQuestionIndex] !== null;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-cyan-700">{selectedClass} Quiz</h2>
        <p className="text-sm font-medium text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </div>
      
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
      </div>
      
      <QuestionDisplay 
        question={currentQuestion}
        onAnswer={handleAnswer}
        isAnswered={isCurrentAnswered}
        userAnswer={userAnswers[currentQuestionIndex]}
      />

      {isCurrentAnswered && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={nextQuestion}
            className="bg-cyan-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
};
