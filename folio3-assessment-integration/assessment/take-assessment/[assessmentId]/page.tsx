'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Clock, CheckCircle, XCircle, Play, Pause, SkipForward } from 'lucide-react';

const Editor = dynamic(() => import('react-simple-code-editor'), { ssr: false });

interface Question {
  id: string;
  type: 'MCQ' | 'Code';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  starterCode?: string;
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  questions: Question[];
}

export default function AssessmentSessionPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params?.assessmentId as string;
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [codeAnswers, setCodeAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [codeOutput, setCodeOutput] = useState<string>('');

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        // In a real app, this would fetch from API
        const assessmentData = getAssessmentData(assessmentId);
        setAssessment(assessmentData);
        setTimeLeft(assessmentData.timeLimit * 60); // Convert to seconds
        setAnswers(new Array(assessmentData.questions.length).fill(''));
        setCodeAnswers(new Array(assessmentData.questions.length).fill(''));
      } catch (error) {
        console.error('Failed to load assessment:', error);
        router.push('/assessment/take-assessment');
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      loadAssessment();
    }
  }, [assessmentId, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isStarted && !isPaused && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [isStarted, isPaused, timeLeft]);

  const getAssessmentData = (id: string): Assessment => {
    const assessments = {
      'js-basics': {
        id: 'js-basics',
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics',
        totalQuestions: 10,
        timeLimit: 20,
        questions: [
          {
            id: '1',
            type: 'MCQ' as 'MCQ' | 'Code',
            question: 'What is the output of: console.log(typeof null)?',
            options: ['object', 'null', 'undefined', 'number'],
            answer: 'object',
            explanation: 'In JavaScript, typeof null returns "object" due to a legacy bug.',
            points: 10
          },
          {
            id: '2',
            type: 'MCQ' as 'MCQ' | 'Code',
            question: 'Which method is used to add an element to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            answer: 'push()',
            explanation: 'The push() method adds one or more elements to the end of an array.',
            points: 10
          },
          {
            id: '3',
            type: 'Code' as 'MCQ' | 'Code',
            question: 'Write a function named add that returns the sum of two numbers.',
            starterCode: 'function add(a, b) {\n  // your code here\n}',
            answer: 'function add(a, b) { return a + b; }',
            explanation: 'The function should take two parameters and return their sum.',
            points: 20
          }
        ]
      },
      'python-intermediate': {
        id: 'python-intermediate',
        title: 'Python Intermediate Concepts',
        description: 'Advanced Python concepts and problem solving',
        totalQuestions: 15,
        timeLimit: 30,
        questions: [
          {
            id: '1',
            type: 'MCQ' as 'MCQ' | 'Code',
            question: 'Which keyword is used to define a function in Python?',
            options: ['function', 'def', 'lambda', 'fun'],
            answer: 'def',
            explanation: 'The "def" keyword is used to define a function in Python.',
            points: 10
          },
          {
            id: '2',
            type: 'Code' as 'MCQ' | 'Code',
            question: 'Write a function that calculates the factorial of a number.',
            starterCode: 'def factorial(n):\n    # your code here\n    pass',
            answer: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)',
            explanation: 'Use recursion to calculate factorial.',
            points: 25
          }
        ]
      }
    };

    return assessments[id as keyof typeof assessments] || assessments['js-basics'];
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleCodeChange = (code: string) => {
    const newCodeAnswers = [...codeAnswers];
    newCodeAnswers[currentQuestion] = code;
    setCodeAnswers(newCodeAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCodeOutput('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCodeOutput('');
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    if (!assessment) return { correct: 0, total: 0, percentage: 0, points: 0 };
    
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    assessment.questions.forEach((question, index) => {
      totalPoints += question.points;
      
      if (question.type === 'Code') {
        const userAnswer = codeAnswers[index]?.trim().toLowerCase();
        const expectedAnswer = question.answer?.trim().toLowerCase();
        if (userAnswer && expectedAnswer && userAnswer.includes(expectedAnswer.replace(/[^a-zA-Z0-9]/g, ''))) {
          correct++;
          earnedPoints += question.points;
        }
      } else {
        if (answers[index] === question.answer) {
          correct++;
          earnedPoints += question.points;
        }
      }
    });

    return {
      correct,
      total: assessment.questions.length,
      percentage: Math.round((correct / assessment.questions.length) * 100),
      points: earnedPoints,
      totalPoints
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Assessment not found</h2>
          <Link
            href="/assessment/take-assessment"
            className="text-blue-600 hover:text-blue-700"
          >
            Back to assessments
          </Link>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              score.percentage >= 70 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {score.percentage >= 70 ? (
                <CheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
            <div className={`text-4xl font-bold mb-4 ${
              score.percentage >= 70 ? 'text-green-600' : 'text-red-600'
            }`}>
              {score.percentage}%
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="text-gray-600">
                You got {score.correct} out of {score.total} questions correct
              </p>
              <p className="text-gray-600">
                Points earned: {score.points}/{score.totalPoints}
              </p>
            </div>
            
            <div className="space-y-3">
              <Link
                href="/assessment/take-assessment"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Take Another Assessment
              </Link>
              <Link
                href="/assessment"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/assessment/take-assessment"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{assessment.title}</h1>
                  <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {assessment.questions.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isStarted && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="font-mono text-lg font-semibold text-gray-900">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
                
                {isStarted && (
                  <button
                    onClick={handlePause}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isPaused ? <Play className="h-5 w-5 text-gray-600" /> : <Pause className="h-5 w-5 text-gray-600" />}
                  </button>
                )}
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
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {!isStarted ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
              <p className="text-gray-600 mb-6">{assessment.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Questions:</span>
                    <span className="ml-2 text-gray-600">{assessment.totalQuestions}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time Limit:</span>
                    <span className="ml-2 text-gray-600">{assessment.timeLimit} minutes</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleStart}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Play className="h-5 w-5" />
                Start Assessment
              </button>
            </div>
          ) : (
            <div>
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
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                          answers[currentQuestion] === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
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
                  </div>
                )}
              </div>
              
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
                  {currentQuestion < assessment.questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      Next
                      <SkipForward className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 