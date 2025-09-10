
import { GoogleGenAI, Type } from "@google/genai";
import { DrugCardInfo, OtcRecommendationInfo, QuizQuestion, StudyContentType, GeneratedStudyContent, Flashcard, SummaryNotes, LearningObjectives } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schemas
const drugCardSchema = {
  type: Type.OBJECT,
  properties: {
    drugName: { type: Type.STRING, description: "The official name of the drug." },
    drugClass: { type: Type.STRING, description: "The pharmacological class of the drug." },
    mechanismOfAction: { type: Type.STRING, description: "A concise explanation of how the drug works." },
    commonUses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of common clinical uses or indications for the drug."
    },
    sideEffects: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of major or common side effects."
    },
    contraindications: { type: Type.STRING, description: "Key contraindications or warnings for the drug." },
    mnemonic: { type: Type.STRING, description: "A creative and memorable mnemonic to help remember key information about the drug." }
  },
  required: ["drugName", "drugClass", "mechanismOfAction", "commonUses", "sideEffects", "contraindications", "mnemonic"]
};

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "The multiple-choice question." },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 4 possible answers."
      },
      correctAnswer: { type: Type.STRING, description: "The correct answer from the options list." }
    },
    required: ["question", "options", "correctAnswer"]
  }
};

const otcRecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendedDrug: { type: Type.STRING, description: "The recommended Over-the-Counter (OTC) drug or active ingredient." },
    reasoning: { type: Type.STRING, description: "A clear and concise rationale for why this drug is recommended for the presented symptoms." },
    counselingPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of key counseling points for the patient, such as how to take the medication, what to expect, and non-drug advice."
    },
    warnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of important warnings, potential side effects, or contraindications, especially considering any patient-specific conditions mentioned."
    },
    whenToSeeDoctor: { type: Type.STRING, description: "Clear criteria on when the patient should stop using the OTC and consult a doctor." }
  },
  required: ["recommendedDrug", "reasoning", "counselingPoints", "warnings", "whenToSeeDoctor"]
};

const studyMaterialSchemas = {
  [StudyContentType.FLASHCARDS]: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: "A concise question derived from the text, suitable for a flashcard." },
        answer: { type: Type.STRING, description: "A concise answer to the question, derived from the text." },
      },
      required: ["question", "answer"],
    },
    description: "An array of question-answer pairs for flashcards.",
  },
  [StudyContentType.NOTES]: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A suitable title for the summary notes, derived from the document's content." },
      summaryPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of key summary points, in bullet-point format.",
      },
    },
    required: ["title", "summaryPoints"],
    description: "A title and a list of key summary points from the document.",
  },
  [StudyContentType.OBJECTIVES]: {
    type: Type.OBJECT,
    properties: {
      mainTopic: { type: Type.STRING, description: "The main topic or subject of the document." },
      learningObjectives: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of clear, actionable learning objectives based on the document's content.",
      },
    },
    required: ["mainTopic", "learningObjectives"],
    description: "The main topic and a list of learning objectives.",
  },
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};


export const generateDrugCard = async (drugName: string): Promise<DrugCardInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a detailed study card for the drug: ${drugName}. Provide information relevant to a pharmacy student.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: drugCardSchema,
      },
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as DrugCardInfo;
  } catch (error) {
    console.error("Error generating drug card:", error);
    throw new Error("Failed to generate drug card from AI. Please check the drug name and try again.");
  }
};

export const generateQuiz = async (drugClass: string): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a 5-question multiple-choice quiz about the ${drugClass} drug class for a PharmD student. Ensure one option is correct and the others are plausible distractors.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz from AI. Please select another category.");
  }
};

export const generateOtcRecommendation = async (patientCase: string): Promise<OtcRecommendationInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following patient case and recommend an appropriate OTC medication. Patient case: "${patientCase}"`,
      config: {
        systemInstruction: "You are an AI assistant for pharmacy students, providing educational guidance on OTC product selection. Your response must prioritize patient safety, considering all provided patient information. Your output must be a JSON object following the provided schema. This is for educational purposes and not real medical advice.",
        responseMimeType: "application/json",
        responseSchema: otcRecommendationSchema,
      },
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as OtcRecommendationInfo;
  } catch (error) {
    console.error("Error generating OTC recommendation:", error);
    throw new Error("Failed to generate an OTC recommendation. Please check the patient case and try again.");
  }
};

export const generateStudyMaterials = async (file: File, contentType: StudyContentType): Promise<GeneratedStudyContent> => {
  try {
    const filePart = await fileToGenerativePart(file);
    const schema = studyMaterialSchemas[contentType];
    
    if (!filePart) {
        throw new Error("Could not process file.");
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { text: `Based on the content of this document, generate ${contentType} for a pharmacy student. Ensure the output is concise, accurate, and relevant for studying.` },
          filePart,
        ],
      },
      config: {
        systemInstruction: "You are an AI study assistant for PharmD students. Your task is to extract key information from the provided document and format it as a JSON object according to the requested schema. Focus on accuracy and educational value.",
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as GeneratedStudyContent;
  } catch (error) {
    console.error(`Error generating ${contentType}:`, error);
    throw new Error(`Failed to generate ${contentType} from the document. The file might be corrupted, unreadable, or very large.`);
  }
};
