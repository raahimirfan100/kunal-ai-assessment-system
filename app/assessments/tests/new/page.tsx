'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save, Search } from 'lucide-react';
import { Question, Test } from '@/types';

export default function NewTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    isActive: true
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const questionsData = await response.json();
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
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

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedQuestionsData = questions.filter(q => selectedQuestions.includes(q.id));
  const totalPoints = selectedQuestionsData.reduce((sum, q) => sum + q.points, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question');
      return;
    }

    setLoading(true);

    try {
      const testData = {
        ...formData,
        questions: selectedQuestions,
        totalPoints
      };

      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        router.push('/assessments/dashboard');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/assessments/dashboard')}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Test</h1>
                <p className="text-gray-600">Build a new assessment by selecting questions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Configuration */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="input-field"
                    placeholder="Enter test title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="textarea-field h-24"
                    placeholder="Enter test description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                    className="input-field"
                    min="1"
                    max="480"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active (available for candidates)
                  </label>
                </div>

                {/* Test Summary */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Test Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span>{selectedQuestions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Points:</span>
                      <span>{totalPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Limit:</span>
                      <span>{formData.timeLimit} min</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || selectedQuestions.length === 0}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Test
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Question Selection */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Select Questions ({selectedQuestions.length} selected)
                </h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Search questions..."
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No questions found</p>
                  </div>
                ) : (
                  filteredQuestions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedQuestions.includes(question.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleQuestionSelection(question.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(question.id)}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 text-primary-600 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                              <h3 className="font-medium text-gray-900">{question.title}</h3>
                              <span className="text-sm text-gray-500 capitalize">
                                {question.type.replace('-', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {question.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{question.points} points</span>
                              {question.timeLimit && (
                                <span>{question.timeLimit}s time limit</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 