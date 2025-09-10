
import React, { useState } from 'react';
import { generateStudyMaterials } from '../services/geminiService';
import { StudyContentType, GeneratedStudyContent } from '../types';
import { Loader } from './Loader';
import { IconUpload } from './Icons';
import { StudyContentDisplay } from './StudyContentDisplay';

const ContentTypeSelector: React.FC<{ selected: StudyContentType; onSelect: (type: StudyContentType) => void; disabled: boolean; }> = ({ selected, onSelect, disabled }) => {
  const types = Object.values(StudyContentType);
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Select Content Type</label>
      <div className="flex w-full sm:w-auto rounded-lg bg-slate-200 p-1 space-x-1">
        {types.map(type => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            disabled={disabled}
            className={`w-full px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ease-in-out disabled:cursor-not-allowed
              ${selected === type
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'bg-transparent text-slate-600 hover:bg-slate-300/60'
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export const StudyNotesGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<StudyContentType>(StudyContentType.FLASHCARDS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedStudyContent | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
       if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('Please select a file to generate study materials.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const content = await generateStudyMaterials(file, contentType);
      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-700">Study Tools Generator</h2>
          <p className="text-slate-500 mt-1">Upload your PDF notes or slides to create study materials.</p>
        </div>
        
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Upload PDF</label>
            <label htmlFor="file-upload" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <IconUpload className="w-6 h-6 text-slate-500" />
                <span className="ml-3 text-slate-600 font-medium">
                    {file ? `Selected: ${file.name}` : 'Click to select a file'}
                </span>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} disabled={isLoading} />
        </div>
        
        <ContentTypeSelector selected={contentType} onSelect={setContentType} disabled={isLoading} />

        <div>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !file}
            className="flex justify-center items-center w-full sm:w-auto bg-cyan-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-cyan-700 disabled:bg-cyan-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? <Loader /> : 'Generate Materials'}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {isLoading && (
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-600">Brewing knowledge from your notes...</p>
        </div>
      )}
      
      {generatedContent && 
        <div className="animate-fade-in">
          <StudyContentDisplay content={generatedContent} type={contentType} />
        </div>
      }
    </div>
  );
};
