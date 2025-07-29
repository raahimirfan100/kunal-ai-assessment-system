import fs from 'fs';
import path from 'path';
import { Question, Test, Candidate, TestSubmission, User } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');
const TESTS_FILE = path.join(DATA_DIR, 'tests.json');
const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Generic file operations
const readJsonFile = <T>(filePath: string): T[] => {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJsonFile = <T>(filePath: string, data: T[]): void => {
  ensureDataDir();
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// Question operations
export const getAllQuestions = (): Question[] => {
  return readJsonFile<Question>(QUESTIONS_FILE);
};

export const getQuestionById = (id: string): Question | undefined => {
  const questions = getAllQuestions();
  return questions.find(q => q.id === id);
};

export const createQuestion = (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question => {
  const questions = getAllQuestions();
  const newQuestion: Question = {
    ...question,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  questions.push(newQuestion);
  writeJsonFile(QUESTIONS_FILE, questions);
  return newQuestion;
};

export const updateQuestion = (id: string, updates: Partial<Question>): Question | null => {
  const questions = getAllQuestions();
  const index = questions.findIndex(q => q.id === id);
  if (index === -1) return null;
  
  questions[index] = {
    ...questions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile(QUESTIONS_FILE, questions);
  return questions[index];
};

export const deleteQuestion = (id: string): boolean => {
  const questions = getAllQuestions();
  const filteredQuestions = questions.filter(q => q.id !== id);
  if (filteredQuestions.length === questions.length) return false;
  
  writeJsonFile(QUESTIONS_FILE, filteredQuestions);
  return true;
};

// Test operations
export const getAllTests = (): Test[] => {
  return readJsonFile<Test>(TESTS_FILE);
};

export const getTestById = (id: string): Test | undefined => {
  const tests = getAllTests();
  return tests.find(t => t.id === id);
};

export const createTest = (test: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>): Test => {
  const tests = getAllTests();
  const newTest: Test = {
    ...test,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tests.push(newTest);
  writeJsonFile(TESTS_FILE, tests);
  return newTest;
};

export const updateTest = (id: string, updates: Partial<Test>): Test | null => {
  const tests = getAllTests();
  const index = tests.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  tests[index] = {
    ...tests[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile(TESTS_FILE, tests);
  return tests[index];
};

export const deleteTest = (id: string): boolean => {
  const tests = getAllTests();
  const filteredTests = tests.filter(t => t.id !== id);
  if (filteredTests.length === tests.length) return false;
  
  writeJsonFile(TESTS_FILE, filteredTests);
  return true;
};

// Candidate operations
export const getAllCandidates = (): Candidate[] => {
  return readJsonFile<Candidate>(CANDIDATES_FILE);
};

export const getCandidateById = (id: string): Candidate | undefined => {
  const candidates = getAllCandidates();
  return candidates.find(c => c.id === id);
};

export const createCandidate = (candidate: Omit<Candidate, 'id' | 'createdAt'>): Candidate => {
  const candidates = getAllCandidates();
  const newCandidate: Candidate = {
    ...candidate,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  candidates.push(newCandidate);
  writeJsonFile(CANDIDATES_FILE, candidates);
  return newCandidate;
};

export const updateCandidate = (id: string, updates: Partial<Candidate>): Candidate | null => {
  const candidates = getAllCandidates();
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  candidates[index] = { ...candidates[index], ...updates };
  writeJsonFile(CANDIDATES_FILE, candidates);
  return candidates[index];
};

export const deleteCandidate = (id: string): boolean => {
  const candidates = getAllCandidates();
  const filteredCandidates = candidates.filter(c => c.id !== id);
  if (filteredCandidates.length === candidates.length) return false;
  
  writeJsonFile(CANDIDATES_FILE, filteredCandidates);
  return true;
};

// Submission operations
export const getAllSubmissions = (): TestSubmission[] => {
  return readJsonFile<TestSubmission>(SUBMISSIONS_FILE);
};

export const getSubmissionById = (id: string): TestSubmission | undefined => {
  const submissions = getAllSubmissions();
  return submissions.find(s => s.id === id);
};

export const getSubmissionsByCandidate = (candidateId: string): TestSubmission[] => {
  const submissions = getAllSubmissions();
  return submissions.filter(s => s.candidateId === candidateId);
};

export const getSubmissionsByTest = (testId: string): TestSubmission[] => {
  const submissions = getAllSubmissions();
  return submissions.filter(s => s.testId === testId);
};

export const createSubmission = (submission: Omit<TestSubmission, 'id'>): TestSubmission => {
  const submissions = getAllSubmissions();
  const newSubmission: TestSubmission = {
    ...submission,
    id: generateId(),
  };
  submissions.push(newSubmission);
  writeJsonFile(SUBMISSIONS_FILE, submissions);
  return newSubmission;
};

export const updateSubmission = (id: string, updates: Partial<TestSubmission>): TestSubmission | null => {
  const submissions = getAllSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  submissions[index] = { ...submissions[index], ...updates };
  writeJsonFile(SUBMISSIONS_FILE, submissions);
  return submissions[index];
};

export const cleanupIncompleteSubmissions = (candidateId: string, testId: string, keepSubmissionId: string): void => {
  const submissions = getAllSubmissions();
  const filteredSubmissions = submissions.filter(s => 
    !(s.candidateId === candidateId && 
      s.testId === testId && 
      !s.isCompleted && 
      s.id !== keepSubmissionId)
  );
  writeJsonFile(SUBMISSIONS_FILE, filteredSubmissions);
};

// User operations
export const getAllUsers = (): User[] => {
  return readJsonFile<User>(USERS_FILE);
};

export const getUserById = (id: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.email === email);
};

export const createUser = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getAllUsers();
  const newUser: User = {
    ...user,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeJsonFile(USERS_FILE, users);
  return newUser;
};

// Utility function to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Initialize with dummy data if files are empty
export const initializeDummyData = () => {
  ensureDataDir();
  
  // Initialize questions if empty
  if (getAllQuestions().length === 0) {
    const dummyQuestions: Question[] = [
      {
        id: 'q1',
        type: 'mcq',
        title: 'What is JavaScript?',
        content: 'Choose the best description of JavaScript:',
        options: [
          'A programming language for web development',
          'A database management system',
          'An operating system',
          'A web browser'
        ],
        correctAnswer: 'A programming language for web development',
        points: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'q2',
        type: 'fill-in-blank',
        title: 'Complete the sentence',
        content: 'React is a _____ library for building user interfaces.',
        correctAnswer: 'JavaScript',
        points: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'q3',
        type: 'coding',
        title: 'Write a function to add two numbers',
        content: 'Create a function that takes two numbers as parameters and returns their sum.',
        codeTemplate: 'function add(a, b) {\n  // Your code here\n}',
        language: 'javascript',
        points: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'q4',
        type: 'drag-drop',
        title: 'Arrange the steps in order',
        content: 'First step|Second step|Third step|Fourth step',
        correctAnswer: ['First step', 'Second step', 'Third step', 'Fourth step'],
        points: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'q5',
        type: 'short-text',
        title: 'Explain the concept of variables',
        content: 'In your own words, explain what variables are in programming and why they are useful.',
        points: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    writeJsonFile(QUESTIONS_FILE, dummyQuestions);
  }

  // Initialize tests if empty
  if (getAllTests().length === 0) {
    const dummyTests: Test[] = [
      {
        id: 't1',
        title: 'JavaScript Fundamentals',
        description: 'Basic JavaScript knowledge assessment',
        questions: ['q1', 'q2', 'q3', 'q4', 'q5'],
        timeLimit: 30,
        totalPoints: 48,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    writeJsonFile(TESTS_FILE, dummyTests);
  }

  // Initialize candidates if empty
  if (getAllCandidates().length === 0) {
    const dummyCandidates: Candidate[] = [
      {
        id: 'c1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        assignedTests: ['t1'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'c2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        assignedTests: ['t1'],
        createdAt: new Date().toISOString(),
      },
    ];
    writeJsonFile(CANDIDATES_FILE, dummyCandidates);
  }

  // Initialize users if empty
  if (getAllUsers().length === 0) {
    const dummyUsers: User[] = [
      {
        id: 'u1',
            name: 'Assessments Manager',
    email: 'assessments@company.com',
    role: 'assessments',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'u2',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'take-assessment',
        createdAt: new Date().toISOString(),
      },
    ];
    writeJsonFile(USERS_FILE, dummyUsers);
  }
}; 