'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Eye,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react';
import { Test, TestSubmission, Candidate } from '@/types';

export default function CandidateDashboard() {
  const [assignedTests, setAssignedTests] = useState<Test[]>([]);
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // For demo purposes, we'll use a hardcoded candidate ID
      // In a real app, this would come from authentication
      const candidateId = 'c1';
      
      const [candidatesRes, testsRes, submissionsRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/tests'),
        fetch(`/api/submissions?candidateId=${candidateId}`)
      ]);

      const candidatesData = await candidatesRes.json();
      const testsData = await testsRes.json();
      const submissionsData = await submissionsRes.json();

      const currentCandidate = candidatesData.find((c: Candidate) => c.id === candidateId);
      setCandidate(currentCandidate);
      setAllTests(testsData);

      // Filter tests assigned to this candidate
      const assignedTestIds = currentCandidate?.assignedTests || [];
      const assignedTestsData = testsData.filter((test: Test) => 
        assignedTestIds.includes(test.id) && test.isActive
      );
      setAssignedTests(assignedTestsData);
      
      // Filter submissions to only include those for assigned tests
      const assignedTestIdsSet = new Set(assignedTestIds);
      const filteredSubmissions = submissionsData.filter((submission: TestSubmission) => 
        assignedTestIdsSet.has(submission.testId)
      );
      setSubmissions(filteredSubmissions);
      
      console.log('Dashboard data:', {
        assignedTests: assignedTestsData,
        submissions: filteredSubmissions,
        allSubmissions: submissionsData
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionStatus = (submission: TestSubmission) => {
    if (submission.isCompleted) {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        text: 'Completed',
        color: 'text-green-600'
      };
    } else {
      return {
        icon: <Clock className="w-5 h-5 text-orange-600" />,
        text: 'In Progress',
        color: 'text-orange-600'
      };
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
                <p className="text-gray-600">
                  Welcome back, {candidate?.name || 'Candidate'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Tests</p>
                <p className="text-2xl font-bold text-gray-900">{assignedTests.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => s.isCompleted).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(0, assignedTests.length - submissions.filter(s => s.isCompleted).length)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned Tests */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Assigned Tests</h2>
            </div>
            <div className="space-y-4">
              {assignedTests.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tests assigned yet</p>
                </div>
              ) : (
                assignedTests.map((test) => {
                  const submission = submissions.find(s => s.testId === test.id);
                  const isCompleted = submission?.isCompleted || false;
                  
                  return (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{test.title}</h3>
                          {isCompleted && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(test.timeLimit)}
                          </span>
                          <span>{test.questions.length} questions</span>
                          <span>{test.totalPoints} points</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <Link 
                            href={`/candidate/results/${submission?.id}`}
                            className="btn-outline text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Results
                          </Link>
                        ) : (
                          <Link 
                            href={`/candidate/test/${test.id}/start`}
                            className="btn-primary text-sm"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start Test
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
            </div>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No submissions yet</p>
                </div>
              ) : (
                // Get unique submissions per test (most recent first)
                submissions
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .filter((submission, index, self) => 
                    index === self.findIndex(s => s.testId === submission.testId)
                  )
                  .slice(0, 5)
                  .map((submission) => {
                    // Try to find test in assigned tests first, then in all tests if not found
                    let test = assignedTests.find(t => t.id === submission.testId);
                    if (!test) {
                      test = allTests.find(t => t.id === submission.testId);
                    }
                    const status = getSubmissionStatus(submission);
                  
                  return (
                    <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {test?.title || `Test ${submission.testId.substring(0, 8)}...`}
                          </h3>
                          {status.icon}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(submission.startTime).toLocaleDateString()}
                          </span>
                          {submission.totalScore !== undefined && (
                            <span className={status.color}>
                              Score: {submission.totalScore}/{submission.maxScore}
                            </span>
                          )}
                        </div>
                      </div>
                      {submission.isCompleted && (
                        <Link 
                          href={`/candidate/results/${submission.id}`}
                          className="btn-outline text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedTests.filter(test => {
              const submission = submissions.find(s => s.testId === test.id);
              return !submission?.isCompleted;
            }).slice(0, 2).map((test) => (
              <Link 
                key={test.id}
                href={`/candidate/test/${test.id}/start`}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Play className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Start {test.title}</p>
                    <p className="text-sm text-gray-600">
                      {test.questions.length} questions • {formatTime(test.timeLimit)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 