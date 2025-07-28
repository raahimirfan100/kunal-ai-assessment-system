'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3,
  Calendar,
  Award,
  Eye
} from 'lucide-react';
import { TestSubmission, Test, Question } from '@/types';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;
  
  const [submission, setSubmission] = useState<TestSubmission | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [submissionId]);

  const fetchResults = async () => {
    try {
      const [submissionsRes, testsRes, questionsRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/tests'),
        fetch('/api/questions')
      ]);

      const submissionsData = await submissionsRes.json();
      const testsData = await testsRes.json();
      const questionsData = await questionsRes.json();

      const currentSubmission = submissionsData.find((s: TestSubmission) => s.id === submissionId);
      if (!currentSubmission) {
        throw new Error('Submission not found');
      }

      setSubmission(currentSubmission);

      const currentTest = testsData.find((t: Test) => t.id === currentSubmission.testId);
      setTest(currentTest);

      const testQuestions = questionsData.filter((q: Question) => 
        currentTest.questions.includes(q.id)
      );
      setQuestions(testQuestions);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnswerForQuestion = (questionId: string) => {
    return submission?.answers.find(a => a.questionId === questionId);
  };

  const isAnswerCorrect = (question: Question, answer: any) => {
    if (!answer || !question.correctAnswer) return false;
    
    if (question.type === 'mcq') {
      return answer.answer === question.correctAnswer;
    } else if (question.type === 'fill-in-blank') {
      const answerText = typeof answer.answer === 'string' ? answer.answer : Array.isArray(answer.answer) ? answer.answer[0] : '';
      const correctAnswer = typeof question.correctAnswer === 'string' ? question.correctAnswer : '';
      return answerText.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }
    
    return false;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getScorePercentage = () => {
    if (!submission || !test) return 0;
    return Math.round((submission.totalScore || 0) / test.totalPoints * 100);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 70) return 'Good work!';
    if (percentage >= 60) return 'Passed';
    return 'Needs improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!submission || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Results Not Found</h2>
          <p className="text-gray-600 mb-4">The test results you're looking for don't exist.</p>
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

  const scorePercentage = getScorePercentage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/candidate/dashboard')}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
                <p className="text-gray-600">{test.title}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Overview */}
        <div className="card mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {submission.totalScore || 0} / {test.totalPoints}
            </h2>
            <p className={`text-2xl font-semibold mb-2 ${getScoreColor(scorePercentage)}`}>
              {scorePercentage}%
            </p>
            <p className="text-lg text-gray-600 mb-6">
              {getScoreMessage(scorePercentage)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(submission.endTime || submission.startTime).toLocaleDateString()}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-lg font-semibold text-gray-900">
                {submission.timeSpent ? formatTime(submission.timeSpent) : 'N/A'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Questions</p>
              <p className="text-lg font-semibold text-gray-900">
                {questions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Question Review</h3>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const answer = getAnswerForQuestion(question.id);
              const isCorrect = answer ? isAnswerCorrect(question, answer) : false;
              
              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <h4 className="text-lg font-medium text-gray-900">{question.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="text-sm text-gray-600">{question.points} points</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 mb-3">{question.content}</p>
                    
                    {question.type === 'mcq' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              answer?.answer === option
                                ? isCorrect
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-red-50 border-red-300'
                                : question.correctAnswer === option
                                ? 'bg-green-50 border-green-300'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <span className="text-sm">{option}</span>
                            {question.correctAnswer === option && (
                              <CheckCircle className="w-4 h-4 text-green-600 inline ml-2" />
                            )}
                            {answer?.answer === option && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-600 inline ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'fill-in-blank' && (
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Your answer:</span>
                          <p className="font-medium">{answer?.answer || 'No answer provided'}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <span className="text-sm text-gray-600">Correct answer:</span>
                          <p className="font-medium">{question.correctAnswer}</p>
                        </div>
                      </div>
                    )}

                    {question.type === 'coding' && (
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">Your code:</span>
                          <pre className="text-sm font-mono mt-2 whitespace-pre-wrap">
                            {answer?.answer || 'No code provided'}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Question type: {question.type}</span>
                    {answer && (
                      <span>Time spent: {answer.timeSpent || 0}s</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/candidate/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 