import { GoogleGenAI, Schema, Type } from "@google/genai";
import { ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const resumeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING, description: "The full name of the candidate" },
    jobTitle: { type: Type.STRING, description: "The professional title (e.g., Senior Software Engineer)" },
    contact: {
      type: Type.OBJECT,
      properties: {
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        website: { type: Type.STRING },
      },
      required: ["email"],
    },
    summary: { type: Type.STRING, description: "A professional summary, rewritten to be impactful and result-oriented." },
    skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of technical and soft skills" },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          dates: { type: Type.STRING },
          description: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of achievements and responsibilities, rewritten to include metrics and action verbs."
          },
        },
        required: ["role", "company", "dates", "description"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          school: { type: Type.STRING },
          location: { type: Type.STRING },
          dates: { type: Type.STRING },
        },
        required: ["degree", "school", "dates"],
      },
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          link: { type: Type.STRING },
        },
      },
    },
  },
  required: ["fullName", "contact", "summary", "experience", "education", "skills"],
};

function cleanJsonText(text: string): string {
    // Remove markdown code blocks (e.g., ```json ... ```)
    let cleaned = text.replace(/^```(json)?\s*/i, "").replace(/\s*```$/, "");
    return cleaned.trim();
}

export async function processResume(fileBase64: string, mimeType: string, jobDescription?: string): Promise<ResumeData> {
  const model = "gemini-2.5-flash";
  
  let systemInstruction = `
    You are an expert Resume Consultant and Professional Writer. 
    Your task is to extract information from the provided resume document and structure it into a JSON format.
    CRITICAL: You must IMPROVE the content while extracting it. 
    1.  Rewrite bullet points to be action-oriented and results-driven (e.g., "Managed a team" -> "Led a cross-functional team of 10...").
    2.  If metrics are missing but implied, suggest plausible placeholders or maximize the language impact.
    3.  Ensure the tone is professional, modern, and suitable for 2025 standards.
    4.  Fix any grammar or spelling errors.
    5.  Categorize skills logically if possible, but return them as a flat list for now.
    6.  IMPORTANT: Do NOT summarize, cut, or truncate the work history to fit a specific page limit. Include ALL relevant roles, dates, and details found in the source. We want a comprehensive upgrade of the entire resume content. If the resume is long, the output should be long.
  `;

  if (jobDescription) {
    systemInstruction += `
      Additionally, tailor the keywords and summary to align with the following Job Description context provided by the user:
      "${jobDescription}"
    `;
  }

  try {
    const result = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: fileBase64,
            },
          },
          {
            text: "Parse this resume and return the structured data following the schema. Rewrite descriptions to be ATS-friendly and high-impact. Capture all experience entries.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
        temperature: 0.3,
        systemInstruction: systemInstruction 
      },
    });

    if (result.text) {
      return JSON.parse(cleanJsonText(result.text)) as ResumeData;
    } else {
      throw new Error("No data returned from AI");
    }
  } catch (error) {
    console.error("Error processing resume:", error);
    throw error;
  }
}

export async function processTextResume(text: string, jobDescription?: string): Promise<ResumeData> {
    const model = "gemini-2.5-flash";
    
    let systemInstruction = `
      You are an expert Resume Consultant. 
      Parse the following raw text resume and structure it into JSON. 
      Rewrite the content to be professional, results-oriented, and error-free.
      Do NOT truncate the resume. Include all experience.
    `;
  
    if (jobDescription) {
      systemInstruction += ` Optimize for this job description: "${jobDescription}"`;
    }
  
    try {
      const result = await ai.models.generateContent({
        model,
        contents: {
            parts: [{ text: `Resume Text:\n${text}` }]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: resumeSchema,
          systemInstruction: systemInstruction,
        },
      });
  
      if (result.text) {
        return JSON.parse(cleanJsonText(result.text)) as ResumeData;
      } else {
        throw new Error("No data returned from AI");
      }
    } catch (error) {
      console.error("Error processing text resume:", error);
      throw error;
    }
  }