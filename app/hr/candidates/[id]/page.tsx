'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Calendar, 
  BarChart3, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Users
} from 'lucide-react';
import { Candidate, Test, TestSubmission } from '@/types';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [candidateId]);

  const fetchData = async () => {
    try {
      const [candidatesRes, testsRes, submissionsRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/tests'),
        fetch('/api/submissions')
      ]);

      const candidatesData = await candidatesRes.json();
      const testsData = await testsRes.json();
      const submissionsData = await submissionsRes.json();

      const currentCandidate = candidatesData.find((c: Candidate) => c.id === candidateId);
      if (!currentCandidate) {
        throw new Error('Candidate not found');
      }

      setCandidate(currentCandidate);
      setTests(testsData);
      setSubmissions(submissionsData.filter((s: TestSubmission) => s.candidateId === candidateId));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/hr/candidates');
      } else {
        alert('Failed to delete candidate');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Failed to delete candidate');
    }
  };

  const getTestsForCandidate = () => {
    if (!candidate) return [];
    return tests.filter(t => candidate.assignedTests.includes(t.id));
  };

  const getSubmissionForTest = (testId: string) => {
    return submissions.find(s => s.testId === testId);
  };

  const getSubmissionStatus = (submission: TestSubmission) => {
    if (submission.isCompleted) {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        label: 'Completed',
        color: 'text-green-600'
      };
    } else {
      return {
        icon: <Clock className="w-4 h-4 text-orange-600" />,
        label: 'In Progress',
        color: 'text-orange-600'
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Candidate not found</h3>
          <button 
            onClick={() => router.push('/hr/candidates')}
            className="btn-primary"
          >
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  const assignedTests = getTestsForCandidate();
  const completedSubmissions = submissions.filter(s => s.isCompleted).length;
  const totalAssignedTests = assignedTests.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation role="hr" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/hr/candidates')}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(candidate.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href={`/hr/candidates/${candidateId}/assign-test`}
              className="btn-primary"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Assign Tests
            </Link>
            <Link 
              href={`/hr/candidates/${candidateId}/edit`}
              className="btn-outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDeleteCandidate}
              className="btn-outline text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Tests</p>
                <p className="text-2xl font-bold text-gray-900">{totalAssignedTests}</p>
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
                <p className="text-2xl font-bold text-gray-900">{completedSubmissions}</p>
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
                  {totalAssignedTests - completedSubmissions}
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
              <Link 
                href={`/hr/candidates/${candidateId}/assign-test`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Manage Tests
              </Link>
            </div>
            
            {assignedTests.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No tests assigned yet</p>
                <Link 
                  href={`/hr/candidates/${candidateId}/assign-test`}
                  className="btn-primary"
                >
                  Assign Tests
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedTests.map((test) => {
                  const submission = getSubmissionForTest(test.id);
                  const status = submission ? getSubmissionStatus(submission) : null;
                  
                  return (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{test.title}</h3>
                          {status && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              submission?.isCompleted 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {status.icon}
                              {status.label}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{test.questions.length} questions</span>
                          <span>{test.timeLimit} minutes</span>
                          <span>{test.totalPoints} points</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {submission && submission.isCompleted && (
                          <Link 
                            href={`/hr/submissions/${submission.id}`}
                            className="btn-outline text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Results
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
              <Link 
                href={`/hr/candidates/${candidateId}/submissions`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {submissions.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.slice(0, 5).map((submission) => {
                  const test = tests.find(t => t.id === submission.testId);
                  const status = getSubmissionStatus(submission);
                  
                  return (
                    <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{test?.title || 'Unknown Test'}</h3>
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
                          href={`/hr/submissions/${submission.id}`}
                          className="btn-outline text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 