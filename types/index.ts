export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  content: string;
  options?: string[];
  correctAnswer?: string | string[];
  codeTemplate?: string;
  language?: string;
  points: number;
  timeLimit?: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

export type QuestionType = 
  | 'mcq' 
  | 'fill-in-blank' 
  | 'coding' 
  | 'drag-drop' 
  | 'short-text';

export interface Test {
  id: string;
  title: string;
  description: string;
  questions: string[]; // Question IDs
  timeLimit: number; // in minutes
  totalPoints: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  assignedTests: string[]; // Test IDs
  createdAt: string;
}

export interface TestSubmission {
  id: string;
  candidateId: string;
  testId: string;
  answers: Answer[];
  startTime: string;
  endTime?: string;
  totalScore?: number;
  maxScore: number;
  isCompleted: boolean;
  timeSpent?: number; // in seconds
}

export interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  points?: number;
  timeSpent: number; // in seconds
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'assessments' | 'take-assessment';
  createdAt: string;
}

export interface DragDropItem {
  id: string;
  content: string;
  order: number;
}

export interface CodingQuestion extends Question {
  type: 'coding';
  codeTemplate: string;
  language: string;
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
} 