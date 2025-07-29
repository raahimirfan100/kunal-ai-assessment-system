'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Clock,
  BarChart3,
  Mail,
  Calendar
} from 'lucide-react';
import { Candidate, Test, TestSubmission } from '@/types';
import Navigation from '@/components/Navigation';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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
      
      setCandidates(candidatesData);
      setTests(testsData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCandidates(candidates.filter(c => c.id !== candidateId));
      } else {
        alert('Failed to delete candidate');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Failed to delete candidate');
    }
  };

  const getTestsForCandidate = (candidate: Candidate) => {
    return tests.filter(t => candidate.assignedTests.includes(t.id));
  };

  const getSubmissionStats = (candidateId: string) => {
    const candidateSubmissions = submissions.filter(s => s.candidateId === candidateId);
    const completed = candidateSubmissions.filter(s => s.isCompleted).length;
    const total = candidateSubmissions.length;
    return { completed, total };
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
              <Navigation role="assessments" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600">Manage candidates and their test assignments</p>
          </div>
          <Link href="/assessments/candidates/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Link>
        </div>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Search candidates by name or email..."
            />
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => {
            const assignedTests = getTestsForCandidate(candidate);
            const stats = getSubmissionStats(candidate.id);
            
            return (
              <div key={candidate.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        {candidate.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/assessments/candidates/${candidate.id}`} className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/assessments/candidates/${candidate.id}/edit`} className="text-gray-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteCandidate(candidate.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Assigned Tests */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Tests</h4>
                    {assignedTests.length === 0 ? (
                      <p className="text-sm text-gray-500">No tests assigned</p>
                    ) : (
                      <div className="space-y-2">
                        {assignedTests.map((test) => (
                          <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{test.title}</p>
                              <p className="text-xs text-gray-600">
                                {test.questions.length} questions • {test.timeLimit} min
                              </p>
                            </div>
                            <Link 
                              href={`/assessments/candidates/${candidate.id}/assign-test`}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              Reassign
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{assignedTests.length}</p>
                        <p className="text-xs text-gray-600">Tests</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">{stats.completed}</p>
                        <p className="text-xs text-gray-600">Completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Joined</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Link 
                    href={`/assessments/candidates/${candidate.id}/assign-test`}
                    className="flex-1 btn-outline text-sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Assign Test
                  </Link>
                  <Link 
                    href={`/assessments/candidates/${candidate.id}/submissions`}
                    className="flex-1 btn-outline text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Results
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first candidate.'}
            </p>
            <Link href="/assessments/candidates/new" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 