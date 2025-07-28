'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Users, 
  FileText, 
  Clock, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Question, Test, Candidate } from '@/types';
import Navigation from '@/components/Navigation';

export default function HRDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [questionsRes, testsRes, candidatesRes] = await Promise.all([
        fetch('/api/questions'),
        fetch('/api/tests'),
        fetch('/api/candidates')
      ]);

      const questionsData = await questionsRes.json();
      const testsData = await testsRes.json();
      const candidatesData = await candidatesRes.json();

      setQuestions(questionsData);
      setTests(testsData);
      setCandidates(candidatesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
      <Navigation role="hr" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
              <p className="text-gray-600">Manage assessments and candidates</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/hr/questions/new" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Question
              </Link>
              <Link href="/hr/tests/new" className="btn-outline">
                <Plus className="w-4 h-4 mr-2" />
                New Test
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tests.filter(t => t.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Candidates</p>
                <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Questions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Questions</h2>
              <Link href="/hr/questions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {questions.slice(0, 5).map((question) => (
                <div key={question.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getQuestionTypeIcon(question.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{question.title}</p>
                      <p className="text-sm text-gray-600">{question.type} • {question.points} points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/hr/questions/${question.id}`} className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/hr/questions/${question.id}/edit`} className="text-gray-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Tests */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Tests</h2>
              <Link href="/hr/tests" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {tests.filter(t => t.isActive).slice(0, 5).map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{test.title}</p>
                    <p className="text-sm text-gray-600">
                      {test.questions.length} questions • {test.timeLimit} min • {test.totalPoints} points
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/hr/tests/${test.id}`} className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/hr/tests/${test.id}/edit`} className="text-gray-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/hr/questions/new" className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Create Question</p>
                  <p className="text-sm text-gray-600">Add a new question to the bank</p>
                </div>
              </div>
            </Link>
            
            <Link href="/hr/tests/new" className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Create Test</p>
                  <p className="text-sm text-gray-600">Build a new assessment</p>
                </div>
              </div>
            </Link>
            
            <Link href="/hr/candidates" className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">Manage Candidates</p>
                  <p className="text-sm text-gray-600">Add and assign candidates</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 