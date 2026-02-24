
export enum SimulationState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  BRIEFING = 'BRIEFING',
  READY = 'READY',
  RUNNING = 'RUNNING',
  EXAMINATION = 'EXAMINATION', // New state
  WARNING = 'WARNING',
  ENDED = 'ENDED',
  VIVA = 'VIVA',
  EVALUATING = 'EVALUATING',
  COMPLETE = 'COMPLETE',
  DASHBOARD = 'DASHBOARD',
  VERIFICATION_REQUIRED = 'VERIFICATION_REQUIRED',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export interface VivaQuestion {
  id: string;
  question: string;
  completed: boolean;
}

export interface CaseBrief {
  title: string;
  briefingText: string;
  patientName: string;
  patientAge: string;
  gender: 'Male' | 'Female';
  icNumber?: string;
  personaName: string;
  chiefComplaint: string;
  systemInstruction: string;
  vivaQuestions: string[];
  patientImage?: string; // New field for generated body image
}

export interface EvaluationResult {
  actualDiagnosis: string;
  diagnosis: string;
  diagnosisGrade: 'Excellent' | 'Proficient' | 'Average' | 'Poor';
  diagnosisScore: number;
  problemSolving: string;
  problemSolvingGrade: 'Excellent' | 'Proficient' | 'Average' | 'Poor';
  problemSolvingScore: number;
  communication: string;
  communicationGrade: 'Excellent' | 'Proficient' | 'Average' | 'Poor';
  communicationScore: number;
  clinicalSkills: string;
  clinicalSkillsGrade: 'Excellent' | 'Proficient' | 'Average' | 'Poor';
  clinicalSkillsScore: number;
  totalScore: number;
  summary: string;
  checklist: {
    clinicalStructure: {
      opening: { label: string; checked: boolean }[];
      exploration: { label: string; checked: boolean }[];
      historyGating: { label: string; checked: boolean }[];
      closing: { label: string; checked: boolean }[];
    };
    communicationSkills: { label: string; checked: boolean }[];
    diagnosisReasoning: { label: string; checked: boolean }[];
    problemSolving: { label: string; checked: boolean }[];
  };
  suggestedQuestions: { question: string; rationale: string }[];
  vivaAnswers: { question: string; answer: string }[];
}

export interface TranscriptionItem {
  role: 'user' | 'patient' | 'examiner';
  text: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  caseTitle: string;
  actualDiagnosis?: string;
  score: number;
  date: number;
  summary: string;
}

export interface UserData {
  name: string;
  email: string;
  password?: string;
  history: HistoryItem[];
  dismissedReminders?: string[];
  repetitionLevel: number; // 0 for 1st reminder, 1 for 2nd, etc.
}
