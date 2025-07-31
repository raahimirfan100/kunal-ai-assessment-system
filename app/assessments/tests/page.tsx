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
  BarChart3
} from 'lucide-react';
import { Test, Question } from '@/types';
import Navigation from '@/components/Navigation';

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, questionsRes] = await Promise.all([
        fetch('/api/tests'),
        fetch('/api/questions')
      ]);
      
      const testsData = await testsRes.json();
      const questionsData = await questionsRes.json();
      
      setTests(testsData);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;

    try {
      const response = await fetch(`/api/tests/${testId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTests(tests.filter(t => t.id !== testId));
      } else {
        alert('Failed to delete test');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test');
    }
  };

  const getQuestionsForTest = (test: Test) => {
    return questions.filter(q => test.questions.includes(q.id));
  };

  const getQuestionTypeBreakdown = (test: Test) => {
    const testQuestions = getQuestionsForTest(test);
    const breakdown = testQuestions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(breakdown).map(([type, count]) => ({
      type,
      count,
      icon: type === 'mcq' ? '📝' : type === 'fill-in-blank' ? '✏️' : type === 'coding' ? '💻' : type === 'drag-drop' ? '🔄' : '📄'
    }));
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation role="assessments" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tests...</p>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Tests</h1>
            <p className="text-gray-600">Manage your assessments</p>
          </div>
                          <Link href="/assessments/tests/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Test
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
              placeholder="Search tests..."
            />
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'Get started by creating your first test'
                }
              </p>
              {!searchTerm && (
                <Link href="/assessments/tests/new" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Test
                </Link>
              )}
            </div>
          ) : (
            filteredTests.map((test) => {
              const testQuestions = getQuestionsForTest(test);
              const typeBreakdown = getQuestionTypeBreakdown(test);
              
              return (
                <div key={test.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary-600" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {test.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/assessments/tests/${test.id}`}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/assessments/tests/${test.id}/edit`}
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteTest(test.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {test.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {test.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{test.timeLimit} min</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{testQuestions.length} questions</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Points:</span>
                      <span className="font-semibold text-gray-900">{test.totalPoints}</span>
                    </div>

                    {typeBreakdown.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Question Types:</p>
                        <div className="flex flex-wrap gap-1">
                          {typeBreakdown.map(({ type, count, icon }) => (
                            <span
                              key={type}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                            >
                              <span>{icon}</span>
                              <span>{count}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created: {new Date(test.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(test.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{tests.length}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {tests.filter(t => t.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {tests.reduce((sum, t) => sum + t.questions.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {tests.reduce((sum, t) => sum + t.totalPoints, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 