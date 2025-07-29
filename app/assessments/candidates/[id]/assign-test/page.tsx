'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Search, Check, X } from 'lucide-react';
import { Candidate, Test } from '@/types';
import Navigation from '@/components/Navigation';

export default function AssignTestPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id as string;
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [candidateId]);

  const fetchData = async () => {
    try {
      const [candidatesRes, testsRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/tests')
      ]);

      const candidatesData = await candidatesRes.json();
      const testsData = await testsRes.json();

      const currentCandidate = candidatesData.find((c: Candidate) => c.id === candidateId);
      if (!currentCandidate) {
        throw new Error('Candidate not found');
      }

      setCandidate(currentCandidate);
      setTests(testsData.filter((t: Test) => t.isActive));
      setSelectedTests(currentCandidate.assignedTests);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedTests: selectedTests
        }),
      });

      if (response.ok) {
        router.push('/assessments/candidates');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate');
    } finally {
      setSaving(false);
    }
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTestsData = tests.filter(t => selectedTests.includes(t.id));
  const totalQuestions = selectedTestsData.reduce((sum, t) => sum + t.questions.length, 0);
  const totalTime = selectedTestsData.reduce((sum, t) => sum + t.timeLimit, 0);
  const totalPoints = selectedTestsData.reduce((sum, t) => sum + t.totalPoints, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
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

  return (
    <div className="min-h-screen bg-gray-50">
              <Navigation role="assessments" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
                        <button 
                onClick={() => router.push('/assessments/candidates')}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assign Tests</h1>
            <p className="text-gray-600">
              Assign tests to {candidate.name} ({candidate.email})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Selection */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Tests</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Search tests..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredTests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No tests found</p>
                  </div>
                ) : (
                  filteredTests.map((test) => {
                    const isSelected = selectedTests.includes(test.id);
                    
                    return (
                      <div 
                        key={test.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleTestSelection(test.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-gray-900">{test.title}</h3>
                              {isSelected && (
                                <Check className="w-4 h-4 text-primary-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{test.questions.length} questions</span>
                              <span>{test.timeLimit} minutes</span>
                              <span>{test.totalPoints} points</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Assignment Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Tests:</span>
                  <span className="font-medium">{selectedTests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time:</span>
                  <span className="font-medium">{totalTime} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points:</span>
                  <span className="font-medium">{totalPoints}</span>
                </div>
              </div>

              {selectedTests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Tests:</h3>
                  <div className="space-y-2">
                    {selectedTestsData.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium text-gray-900">{test.title}</span>
                        <button
                          onClick={() => toggleTestSelection(test.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/assessments/candidates')}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Assignment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 