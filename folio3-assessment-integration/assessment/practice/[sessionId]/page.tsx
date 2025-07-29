'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Code, Target, CheckCircle, XCircle, Play, Lightbulb } from 'lucide-react';

const Editor = dynamic(() => import('react-simple-code-editor'), { ssr: false });

interface Question {
  id: string;
  type: 'MCQ' | 'Code';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  starterCode?: string;
  hints: string[];
}

interface PracticeSession {
  id: string;
  title: string;
  description: string;
  domain: string;
  questions: Question[];
}

export default function PracticeSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [codeAnswers, setCodeAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = getSessionData(sessionId);
        setSession(sessionData);
        setAnswers(new Array(sessionData.questions.length).fill(''));
        setCodeAnswers(new Array(sessionData.questions.length).fill(''));
      } catch (error) {
        console.error('Failed to load practice session:', error);
        router.push('/assessment/practice');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId, router]);

  const getSessionData = (id: string): PracticeSession => {
    const sessions = {
      'js-basics-practice': {
        id: 'js-basics-practice',
        title: 'JavaScript Fundamentals Practice',
        description: 'Practice JavaScript basics with interactive exercises',
        domain: 'JavaScript',
        questions: [
          {
            id: '1',
            type: 'MCQ',
            question: 'What is the output of: console.log(typeof null)?',
            options: ['object', 'null', 'undefined', 'number'],
            answer: 'object',
            explanation: 'In JavaScript, typeof null returns "object" due to a legacy bug in the language implementation. This is a well-known quirk of JavaScript.',
            hints: ['Think about what typeof returns for different data types', 'This is a famous JavaScript gotcha']
          },
          {
            id: '2',
            type: 'Code',
            question: 'Write a function named add that returns the sum of two numbers.',
            starterCode: 'function add(a, b) {\n  // your code here\n}',
            answer: 'function add(a, b) { return a + b; }',
            explanation: 'The function should take two parameters and return their sum using the + operator. This is a basic arithmetic operation in JavaScript.',
            hints: ['Use the + operator to add numbers', 'Make sure to return the result']
          },
          {
            id: '3',
            type: 'Code',
            question: 'Write a function that reverses a string.',
            starterCode: 'function reverseString(str) {\n  // your code here\n}',
            answer: 'function reverseString(str) { return str.split("").reverse().join(""); }',
            explanation: 'Split the string into an array of characters, reverse the array, then join it back together into a string.',
            hints: ['Use split() to convert string to array', 'Use reverse() to reverse the array', 'Use join() to convert back to string']
          }
        ]
      },
      'python-algorithms': {
        id: 'python-algorithms',
        title: 'Python Algorithms Practice',
        description: 'Solve algorithmic problems using Python',
        domain: 'Python',
        questions: [
          {
            id: '1',
            type: 'Code',
            question: 'Write a function that calculates the factorial of a number.',
            starterCode: 'def factorial(n):\n    # your code here\n    pass',
            answer: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)',
            explanation: 'Use recursion to calculate factorial. The base case is when n <= 1, return 1. Otherwise, multiply n by factorial of n-1.',
            hints: ['Think about the base case', 'Use recursion', 'Remember: n! = n * (n-1)!']
          },
          {
            id: '2',
            type: 'Code',
            question: 'Write a function that checks if a number is prime.',
            starterCode: 'def is_prime(n):\n    # your code here\n    pass',
            answer: 'def is_prime(n):\n    if n < 2:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True',
            explanation: 'Check if the number is divisible by any number from 2 to its square root. If yes, it\'s not prime.',
            hints: ['Numbers less than 2 are not prime', 'Only check up to square root of n', 'Use modulo operator %']
          }
        ]
      }
    };

    return sessions[id as keyof typeof sessions] || sessions['js-basics-practice'];
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleCodeChange = (code: string) => {
    const newCodeAnswers = [...codeAnswers];
    newCodeAnswers[currentQuestion] = code;
    setCodeAnswers(newCodeAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (session?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setShowHint(false);
      setCodeOutput('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
      setShowHint(false);
      setCodeOutput('');
    }
  };

  const isAnswerCorrect = () => {
    const currentQ = session?.questions[currentQuestion];
    if (!currentQ) return false;
    
    if (currentQ.type === 'Code') {
      const userAnswer = codeAnswers[currentQuestion]?.trim().toLowerCase();
      const expectedAnswer = currentQ.answer?.trim().toLowerCase();
      return userAnswer && expectedAnswer && userAnswer.includes(expectedAnswer.replace(/[^a-zA-Z0-9]/g, ''));
    } else {
      return answers[currentQuestion] === currentQ.answer;
    }
  };

  const runCode = async () => {
    const currentQ = session?.questions[currentQuestion];
    if (!currentQ || currentQ.type !== 'Code') return;
    
    setCodeOutput('Running code...');
    
    try {
      const code = codeAnswers[currentQuestion] || currentQ.starterCode || '';
      
      if (session?.domain === 'Python') {
        // For Python, we'll simulate execution
        setCodeOutput('Code executed successfully (Python execution simulated)');
      } else {
        // For JavaScript, we can use eval (be careful in production)
        const result = eval(code);
        setCodeOutput(String(result || 'Code executed successfully'));
      }
    } catch (error) {
      setCodeOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading practice session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Practice session not found</h2>
          <Link
            href="/assessment/practice"
            className="text-green-600 hover:text-green-700"
          >
            Back to practice sessions
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = session.questions[currentQuestion];
  const isCorrect = isAnswerCorrect();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/assessment/practice"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{session.title}</h1>
                  <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {session.questions.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Practice Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / session.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {currentQ.question}
            </h3>
            
            {currentQ.type === 'MCQ' && currentQ.options && (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      answers[currentQuestion] === option
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            
            {currentQ.type === 'Code' && (
              <div>
                <div className="mb-4">
                  <Editor
                    value={codeAnswers[currentQuestion] || currentQ.starterCode || ''}
                    onValueChange={handleCodeChange}
                    highlight={(code: string) => code}
                    padding={10}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 14,
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      minHeight: '200px'
                    }}
                  />
                </div>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={runCode}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Run Code
                  </button>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors flex items-center gap-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                </div>
                
                {showHint && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Hint:</h4>
                    <p className="text-yellow-700 text-sm">
                      {currentQ.hints[0]}
                    </p>
                  </div>
                )}
                
                {codeOutput && (
                  <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Output:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{codeOutput}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Explanation */}
          {showExplanation && (
            <div className={`mb-6 p-4 rounded-lg border ${
              isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <h4 className={`font-medium ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
              </div>
              <p className={`text-sm ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {currentQ.explanation}
              </p>
            </div>
          )}
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {currentQuestion < session.questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Next Question
                </button>
              ) : (
                <Link
                  href="/assessment/practice"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Finish Practice
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 