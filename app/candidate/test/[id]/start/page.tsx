'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Play,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';
import { Test, Question, TestSubmission } from '@/types';

export default function TestStartPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetchTestData();
  }, [testId]);

  const fetchTestData = async () => {
    try {
      const [testRes, questionsRes, submissionsRes] = await Promise.all([
        fetch(`/api/tests/${testId}`),
        fetch('/api/questions'),
        fetch(`/api/submissions?candidateId=c1&testId=${testId}`)
      ]);

      const testData = await testRes.json();
      const questionsData = await questionsRes.json();
      const submissionsData = await submissionsRes.json();

      setTest(testData);
      
      // Filter questions for this test
      const testQuestions = questionsData.filter((q: Question) => 
        testData.questions.includes(q.id)
      );
      setQuestions(testQuestions);
      setSubmissions(submissionsData);
      console.log('Fetched submissions for test:', testId, submissionsData);

      // Check if all questions exist
      const missingQuestions = testData.questions.filter((qId: string) => 
        !questionsData.find((q: Question) => q.id === qId)
      );
      
      if (missingQuestions.length > 0) {
        console.warn('Missing questions:', missingQuestions);
      }
    } catch (error) {
      console.error('Error fetching test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    if (starting) return; // Prevent multiple clicks
    
    setStarting(true);
    
    try {
      // Check if there's already an incomplete submission for this test
      const existingSubmission = submissions.find(s => 
        s.testId === testId && !s.isCompleted
      );

      let submissionId: string;

      if (existingSubmission) {
        // Use existing submission
        submissionId = existingSubmission.id;
        console.log('Using existing submission:', submissionId);
      } else {
        // Create a new submission record
        const submissionData = {
          candidateId: 'c1', // Hardcoded for demo
          testId: testId,
          answers: [],
          startTime: new Date().toISOString(),
          maxScore: test?.totalPoints || 0,
          isCompleted: false
        };

        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          throw new Error('Failed to create submission');
        }

        const submission = await response.json();
        submissionId = submission.id;
        console.log('Created new submission:', submissionId);
        
        // Clean up any other incomplete submissions for this test
        await fetch('/api/submissions/cleanup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            candidateId: 'c1',
            testId: testId,
            keepSubmissionId: submissionId
          }),
        });
      }

      // Navigate to the test page
      console.log('Navigating to test page with submission ID:', submissionId);
      router.push(`/candidate/test/${testId}?submissionId=${submissionId}`);
    } catch (error) {
      console.error('Error starting test:', error);
      alert('Failed to start test. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const getQuestionTypeCounts = () => {
    const counts: Record<string, number> = {};
    questions.forEach(q => {
      counts[q.type] = (counts[q.type] || 0) + 1;
    });
    return counts;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'mcq': return '📝';
      case 'fill-in-blank': return '✏️';
      case 'coding': return '💻';
      case 'drag-drop': return '🔄';
      case 'short-text': return '📄';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test details...</p>
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

  // Check if test is already completed
  const completedSubmission = submissions.find(s => s.testId === testId && s.isCompleted);
  console.log('Checking completion for test:', testId, 'Completed submission:', completedSubmission);
  if (completedSubmission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Already Completed</h2>
          <p className="text-gray-600 mb-4">You have already completed this test.</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => router.push('/candidate/dashboard')}
              className="btn-outline"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => router.push(`/candidate/results/${completedSubmission.id}`)}
              className="btn-primary"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if there's an incomplete submission
  const incompleteSubmission = submissions.find(s => 
    s.testId === testId && !s.isCompleted
  );

  const questionTypeCounts = getQuestionTypeCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.push('/candidate/dashboard')}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Introduction</h1>
                <p className="text-gray-600">Review test details before starting</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Test Details */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{test.title}</h2>
                    <p className="text-lg text-gray-600 mt-1">{test.description}</p>
                  </div>
                </div>
              </div>

              {/* Test Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Time Limit</p>
                  <p className="text-2xl font-bold text-blue-900">{formatTime(test.timeLimit)}</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200/50">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-green-700 mb-1">Questions</p>
                  <p className="text-2xl font-bold text-green-900">{questions.length}</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200/50">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-purple-700 mb-1">Total Points</p>
                  <p className="text-2xl font-bold text-purple-900">{test.totalPoints}</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200/50">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-orange-700 mb-1">Question Types</p>
                  <p className="text-2xl font-bold text-orange-900">{Object.keys(questionTypeCounts).length}</p>
                </div>
              </div>

              {/* Question Types Breakdown */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Question Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(questionTypeCounts).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-xl">{getQuestionTypeIcon(type)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">
                            {type.replace('-', ' ')}
                          </p>
                          <p className="text-sm text-gray-600">{count} question{count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">Important Instructions</h3>
                    <p className="text-blue-700">Please read carefully before starting</p>
                  </div>
                </div>
                <ul className="space-y-4 text-blue-800">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <span>You have <strong className="text-blue-900">{formatTime(test.timeLimit)}</strong> to complete this test</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <span>You can navigate between questions using the navigation panel below the test</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <span>The test will automatically submit when time expires</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <span>Make sure to save your answers before submitting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-sm font-bold">5</span>
                    </div>
                    <span>You cannot return to the test after submission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Start Test Panel */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 sticky top-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Play className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {incompleteSubmission ? 'Continue Test?' : 'Ready to Start?'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {incompleteSubmission 
                    ? 'You have an incomplete test. Click to continue where you left off.'
                    : 'Click the button below to begin your test'
                  }
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Test Duration:</span>
                  <span className="font-bold text-gray-900">{formatTime(test.timeLimit)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Total Questions:</span>
                  <span className="font-bold text-gray-900">{questions.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600 font-medium">Total Points:</span>
                  <span className="font-bold text-gray-900">{test.totalPoints}</span>
                </div>
              </div>

              <button
                onClick={handleStartTest}
                disabled={starting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {starting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    {incompleteSubmission ? 'Continuing...' : 'Starting Test...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Play className="w-6 h-6 mr-3" />
                    {incompleteSubmission ? 'Continue Test' : 'Start Test Now'}
                  </div>
                )}
              </button>

              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push('/candidate/dashboard')}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 