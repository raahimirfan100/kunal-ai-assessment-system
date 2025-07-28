'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter
} from 'lucide-react';
import { Question } from '@/types';
import Navigation from '@/components/Navigation';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuestions(questions.filter(q => q.id !== questionId));
      } else {
        alert('Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
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

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'mcq': return 'bg-blue-100 text-blue-800';
      case 'fill-in-blank': return 'bg-green-100 text-green-800';
      case 'coding': return 'bg-purple-100 text-purple-800';
      case 'drag-drop': return 'bg-orange-100 text-orange-800';
      case 'short-text': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || question.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation role="hr" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation role="hr" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
            <p className="text-gray-600">Manage your question bank</p>
          </div>
          <Link href="/hr/questions/new" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Question
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Search questions..."
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="mcq">MCQ</option>
                <option value="fill-in-blank">Fill in Blank</option>
                <option value="coding">Coding</option>
                <option value="drag-drop">Drag & Drop</option>
                <option value="short-text">Short Text</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first question'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <Link href="/hr/questions/new" className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Question
                </Link>
              )}
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div key={question.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getQuestionTypeIcon(question.type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(question.type)}`}>
                      {question.type.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/hr/questions/${question.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/hr/questions/${question.id}/edit`}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {question.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {question.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{question.points} points</span>
                  <span>{new Date(question.updatedAt).toLocaleDateString()}</span>
                </div>

                {question.type === 'mcq' && question.options && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Options:</p>
                    <div className="space-y-1">
                      {question.options.slice(0, 2).map((option, index) => (
                        <div key={index} className="text-xs text-gray-600 truncate">
                          {index + 1}. {option}
                        </div>
                      ))}
                      {question.options.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{question.options.length - 2} more options
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 card">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {questions.filter(q => q.type === 'mcq').length}
              </div>
              <div className="text-sm text-gray-600">MCQ</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {questions.filter(q => q.type === 'fill-in-blank').length}
              </div>
              <div className="text-sm text-gray-600">Fill in Blank</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {questions.filter(q => q.type === 'coding').length}
              </div>
              <div className="text-sm text-gray-600">Coding</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {questions.filter(q => q.type === 'drag-drop' || q.type === 'short-text').length}
              </div>
              <div className="text-sm text-gray-600">Other</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 