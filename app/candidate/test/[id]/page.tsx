'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  Circle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Play,
  Pause,
  List,
  HelpCircle,
  X
} from 'lucide-react';
import { Test, Question, Answer } from '@/types';
import MCQQuestion from '@/components/questions/MCQQuestion';
import FillInBlankQuestion from '@/components/questions/FillInBlankQuestion';
import CodingQuestion from '@/components/questions/CodingQuestion';
import ShortTextQuestion from '@/components/questions/ShortTextQuestion';
import DragDropQuestion from '@/components/questions/DragDropQuestion';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showQuestionOverview, setShowQuestionOverview] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  useEffect(() => {
    // Get submission ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlSubmissionId = urlParams.get('submissionId');
    setSubmissionId(urlSubmissionId);
    console.log('URL submission ID:', urlSubmissionId);
    
    // If no submission ID in URL, try to find an existing incomplete submission
    if (!urlSubmissionId) {
      fetch('/api/submissions?candidateId=c1')
        .then(res => res.json())
        .then(submissions => {
          const existingSubmission = submissions.find((s: any) => 
            s.testId === testId && !s.isCompleted
          );
          if (existingSubmission) {
            console.log('Found existing submission:', existingSubmission.id);
            setSubmissionId(existingSubmission.id);
          }
        })
        .catch(error => {
          console.error('Error fetching submissions:', error);
        });
    }
  }, [testId]);

  useEffect(() => {
    if (submissionId !== null) {
      fetchTestData();
    }
  }, [testId, submissionId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          
          // Show warning when 5 minutes left
          if (prev === 300) {
            setShowTimeWarning(true);
          }
          
          // Show urgent warning when 1 minute left
          if (prev === 60) {
            setShowTimeWarning(true);
          }
          
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Warn user before leaving the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testStarted && !isSubmitting) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress may be lost.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [testStarted, isSubmitting]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;
      
      const isFirstQuestion = currentQuestionIndex === 0;
      const isLastQuestion = currentQuestionIndex === questions.length - 1;
      
      if (e.key === 'ArrowLeft' && !isFirstQuestion) {
        e.preventDefault();
        handlePrevQuestion();
      } else if (e.key === 'ArrowRight' && !isLastQuestion) {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleManualSubmit();
      } else if (e.key === 'o' && e.ctrlKey) {
        e.preventDefault();
        setShowQuestionOverview(prev => !prev);
      } else if (e.key >= '1' && e.key <= '9' && e.ctrlKey) {
        e.preventDefault();
        const questionIndex = parseInt(e.key) - 1;
        if (questionIndex < questions.length) {
          setCurrentQuestionIndex(questionIndex);
        }
      } else if (e.key === '?' && e.ctrlKey) {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, currentQuestionIndex, questions.length]);

  const fetchTestData = async () => {
    console.log('Fetching test data for testId:', testId, 'submissionId:', submissionId);
    
    try {
      const [testRes, questionsRes] = await Promise.all([
        fetch(`/api/tests/${testId}`),
        fetch('/api/questions')
      ]);

      const testData = await testRes.json();
      const questionsData = await questionsRes.json();

      console.log('Test data:', testData);
      console.log('Questions data length:', questionsData.length);

      setTest(testData);
      
      // Filter questions for this test
      const testQuestions = questionsData.filter((q: Question) => 
        testData.questions.includes(q.id)
      );
      setQuestions(testQuestions);

      console.log('Filtered questions:', testQuestions);

      // Check if all questions exist
      const missingQuestions = testData.questions.filter((qId: string) => 
        !questionsData.find((q: Question) => q.id === qId)
      );
      
      if (missingQuestions.length > 0) {
        console.warn('Missing questions for test:', missingQuestions);
      }
      
      // Set initial time
      setTimeLeft(testData.timeLimit * 60);
      
      // Initialize answers
      const initialAnswers: Record<string, string | string[]> = {};
      testQuestions.forEach((q: Question) => {
        initialAnswers[q.id] = q.type === 'mcq' ? '' : '';
      });
      setAnswers(initialAnswers);

      // Check if we have a submission ID (test was started properly)
      if (submissionId) {
        console.log('Test started with submission ID:', submissionId);
        setTestStarted(true);
      } else {
        console.log('No submission ID found, but continuing anyway...');
        // Don't redirect immediately, let the fallback mechanism work
        setTestStarted(true);
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Auto-save answer to submission
    if (submissionId) {
      setIsSaving(true);
      const currentAnswers = { ...answers, [questionId]: answer };
      fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: Object.entries(currentAnswers).map(([qId, ans]) => ({
            questionId: qId,
            answer: ans,
            timeSpent: 0
          }))
        }),
      })
      .then(() => {
        setLastSaveTime(new Date());
        setIsSaving(false);
      })
      .catch(error => {
        console.error('Error auto-saving answer:', error);
        setIsSaving(false);
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAutoSubmit = async () => {
    await submitTest();
  };

  const handleManualSubmit = () => {
    setShowConfirmSubmit(true);
  };

  const submitTest = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const submissionData = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          timeSpent: 0 // Simplified for demo
        })),
        isCompleted: true,
        endTime: new Date().toISOString(),
        totalScore: calculateScore(),
        timeSpent: (test?.timeLimit || 0) * 60 - timeLeft
      };

      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        router.push(`/candidate/results/${submissionId}`);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer && question.correctAnswer) {
        if (question.type === 'mcq' && answer === question.correctAnswer) {
          totalScore += question.points;
        } else if (question.type === 'fill-in-blank' && 
                   typeof answer === 'string' && 
                   typeof question.correctAnswer === 'string' &&
                   answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          totalScore += question.points;
        }
      }
    });
    return totalScore;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionComponent = (question: Question) => {
    const props = {
      question,
      onAnswerChange: (answer: string | string[]) => handleAnswerChange(question.id, answer),
      initialAnswer: answers[question.id] as string,
      disabled: isSubmitting
    };

    const dragDropProps = {
      question,
      onAnswerChange: (answer: string | string[]) => handleAnswerChange(question.id, answer),
      initialAnswer: Array.isArray(answers[question.id]) ? answers[question.id] as string[] : [],
      disabled: isSubmitting
    };

    switch (question.type) {
      case 'mcq':
        return <MCQQuestion {...props} />;
      case 'fill-in-blank':
        return <FillInBlankQuestion {...props} />;
      case 'coding':
        return <CodingQuestion {...props} />;
      case 'short-text':
        return <ShortTextQuestion {...props} />;
      case 'drag-drop':
        return <DragDropQuestion {...dragDropProps} />;
      default:
        return <div>Question type not supported</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Not Found</h2>
          <p className="text-gray-600 mb-4">The test you're looking for doesn't exist or is not available.</p>
          <button 
            onClick={() => router.push('/candidate/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Configuration Issue</h2>
          <p className="text-gray-600 mb-4">This test has no questions assigned to it. Please contact your administrator.</p>
          <button 
            onClick={() => router.push('/candidate/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {submissionId ? 'Preparing your test...' : 'Loading test session...'}
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  // Calculate progress
  const answeredQuestions = Object.values(answers).filter(answer => 
    answer && (typeof answer === 'string' ? answer.trim() !== '' : answer.length > 0)
  ).length;
  const progressPercentage = (answeredQuestions / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left Section */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.push('/candidate/dashboard')}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-6">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{test.title}</h1>
                  <p className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {answeredQuestions}/{questions.length}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Save Status */}
              {isSaving ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-yellow-600"></div>
                  Saving...
                </div>
              ) : lastSaveTime ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                  <CheckCircle className="w-3 h-3" />
                  Saved
                </div>
              ) : null}
              
              {/* Timer */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-500' : 'text-gray-500'}`} />
                <span className={`font-mono font-semibold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQuestionOverview(prev => !prev)}
                  className={`p-2 rounded-lg transition-all ${
                    showQuestionOverview 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Question Overview (Ctrl+O)"
                >
                  <List className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowKeyboardHelp(prev => !prev)}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                  title="Keyboard Shortcuts (Ctrl+?)"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleManualSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Question Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-8">
            {currentQuestion && getQuestionComponent(currentQuestion)}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200">
              <button
                onClick={handlePrevQuestion}
                disabled={isFirstQuestion || isSubmitting}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="text-sm text-gray-600 font-medium">
                {currentQuestionIndex + 1} of {questions.length}
              </div>
              
              {isLastQuestion ? (
                <button
                  onClick={handleManualSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Question Navigation - Now Below the Test */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 text-lg">
                {showQuestionOverview ? 'Overview' : 'Navigation'}
              </h3>
              <button
                onClick={() => setShowQuestionOverview(prev => !prev)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showQuestionOverview ? 'Grid' : 'Overview'}
              </button>
            </div>
            
            {showQuestionOverview ? (
              /* Question Overview Panel */
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const hasAnswer = answers[question.id] && 
                    (typeof answers[question.id] === 'string' 
                      ? (answers[question.id] as string).trim() !== '' 
                      : (answers[question.id] as string[]).length > 0);
                  
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                        index === currentQuestionIndex
                          ? 'bg-blue-50 border-blue-300 shadow-md'
                          : hasAnswer
                            ? 'bg-green-50 border-green-300 hover:border-green-400'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm text-gray-900">
                          Q{index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {hasAnswer ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400" />
                          )}
                          {index === currentQuestionIndex && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3 leading-relaxed">
                        {question.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.type === 'mcq' ? 'bg-blue-100 text-blue-700' :
                          question.type === 'fill-in-blank' ? 'bg-purple-100 text-purple-700' :
                          question.type === 'coding' ? 'bg-orange-100 text-orange-700' :
                          question.type === 'drag-drop' ? 'bg-pink-100 text-pink-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {question.type.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {question.points} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Question Navigation Grid - Simple Numbers */
              <div className="grid grid-cols-10 gap-2">
                {questions.map((question, index) => {
                  const hasAnswer = answers[question.id] && 
                    (typeof answers[question.id] === 'string' 
                      ? (answers[question.id] as string).trim() !== '' 
                      : (answers[question.id] as string[]).length > 0);
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`aspect-square rounded-lg text-sm font-bold transition-all hover:scale-110 ${
                        index === currentQuestionIndex
                          ? 'bg-blue-500 text-white shadow-lg'
                          : hasAnswer
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={`Question ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Progress Summary */}
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-800">Progress</span>
                <span className="text-sm font-bold text-blue-700">{answeredQuestions}/{questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-gray-600 font-medium">{Math.round(progressPercentage)}% Complete</span>
                <span className="text-gray-500">{questions.length - answeredQuestions} remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Warning Modal */}
      {showTimeWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Time Warning
                </h3>
                <p className="text-sm text-gray-600">Time is running out!</p>
              </div>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed">
              {timeLeft <= 60 
                ? `Only ${timeLeft} second${timeLeft !== 1 ? 's' : ''} remaining! Please submit your test soon.`
                : `Only ${Math.floor(timeLeft / 60)} minute${Math.floor(timeLeft / 60) !== 1 ? 's' : ''} remaining. Consider reviewing your answers.`
              }
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowTimeWarning(false)}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setShowTimeWarning(false);
                  handleManualSubmit();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-sm text-gray-600">Quick navigation tips</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Navigate Questions</span>
                <kbd className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono">← →</kbd>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Toggle Overview</span>
                <kbd className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono">Ctrl + O</kbd>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Jump to Question</span>
                <kbd className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono">Ctrl + 1-9</kbd>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Submit Test</span>
                <kbd className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono">Ctrl + Enter</kbd>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Show This Help</span>
                <kbd className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-mono">Ctrl + ?</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Submit Test?
                </h3>
                <p className="text-sm text-gray-600">Final confirmation</p>
              </div>
            </div>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Are you sure you want to submit your test? You won't be able to make changes after submission.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  submitTest();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 