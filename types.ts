export interface ResumeExperience {
  role: string;
  company: string;
  location?: string;
  dates: string;
  description: string[]; // Bullet points
}

export interface ResumeEducation {
  degree: string;
  school: string;
  location?: string;
  dates: string;
}

export interface ResumeProject {
  name: string;
  description: string;
  link?: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  contact: {
    email: string;
    phone: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects?: ResumeProject[];
}

export enum TemplateType {
  SOFTWARE_ENGINEER = 'Software Engineer Chronological',
  ENHANCED_CHRONOLOGICAL = 'Enhanced Chronological',
  STRATEGIC_HYBRID = 'Strategic Hybrid',
  ATS_OPTIMIZED = 'ATS-Optimized',
  VISUAL_STRATEGIC = 'Visual-Strategic',
  REVERSE_CHRONOLOGICAL = 'Reverse-Chronological',
  FUNCTIONAL = 'Functional Skills-Focused',
  COMBINED_HYBRID = 'Combined Hybrid',
}

export interface ProcessingState {
  status: 'idle' | 'reading' | 'processing' | 'complete' | 'error';
  message?: string;
}
