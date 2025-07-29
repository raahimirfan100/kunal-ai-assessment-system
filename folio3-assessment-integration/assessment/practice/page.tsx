'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Target, Clock, CheckCircle, Play, Settings } from 'lucide-react';

interface PracticeSession {
  id: string;
  title: string;
  description: string;
  domain: string;
  type: 'MCQ' | 'Code' | 'Mixed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number; // in minutes
  questionCount: number;
  tags: string[];
  isCompleted?: boolean;
  bestScore?: number;
}

export default function PracticePage() {
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const domains = ['all', 'JavaScript', 'Python', 'React', 'Node.js', 'Database', 'DevOps'];
  const types = ['all', 'MCQ', 'Code', 'Mixed'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const loadPracticeSessions = async () => {
      try {
        // In a real app, this would fetch from API
        const sessions = getDefaultPracticeSessions();
        setPracticeSessions(sessions);
      } catch (error) {
        console.error('Failed to load practice sessions:', error);
        setPracticeSessions(getDefaultPracticeSessions());
      } finally {
        setLoading(false);
      }
    };

    loadPracticeSessions();
  }, []);

  const getDefaultPracticeSessions = (): PracticeSession[] => [
    {
      id: 'js-basics-practice',
      title: 'JavaScript Fundamentals Practice',
      description: 'Practice JavaScript basics with interactive coding exercises and multiple choice questions.',
      domain: 'JavaScript',
      type: 'Mixed',
      difficulty: 'Beginner',
      estimatedTime: 15,
      questionCount: 8,
      tags: ['Variables', 'Functions', 'Control Flow'],
      isCompleted: true,
      bestScore: 95
    },
    {
      id: 'python-algorithms',
      title: 'Python Algorithms Practice',
      description: 'Solve algorithmic problems using Python with step-by-step guidance.',
      domain: 'Python',
      type: 'Code',
      difficulty: 'Intermediate',
      estimatedTime: 25,
      questionCount: 5,
      tags: ['Algorithms', 'Data Structures', 'Problem Solving']
    },
    {
      id: 'react-hooks',
      title: 'React Hooks Practice',
      description: 'Master React hooks with hands-on coding challenges and real-world scenarios.',
      domain: 'React',
      type: 'Code',
      difficulty: 'Intermediate',
      estimatedTime: 20,
      questionCount: 6,
      tags: ['useState', 'useEffect', 'Custom Hooks']
    },
    {
      id: 'node-express',
      title: 'Node.js & Express Practice',
      description: 'Build REST APIs and practice server-side JavaScript concepts.',
      domain: 'Node.js',
      type: 'Mixed',
      difficulty: 'Intermediate',
      estimatedTime: 30,
      questionCount: 10,
      tags: ['REST APIs', 'Middleware', 'Authentication']
    },
    {
      id: 'sql-practice',
      title: 'SQL Database Practice',
      description: 'Practice SQL queries, database design, and optimization techniques.',
      domain: 'Database',
      type: 'Code',
      difficulty: 'Beginner',
      estimatedTime: 18,
      questionCount: 7,
      tags: ['SELECT', 'JOIN', 'Aggregation']
    },
    {
      id: 'docker-basics',
      title: 'Docker Containerization',
      description: 'Learn Docker fundamentals with practical containerization exercises.',
      domain: 'DevOps',
      type: 'Mixed',
      difficulty: 'Beginner',
      estimatedTime: 22,
      questionCount: 8,
      tags: ['Containers', 'Images', 'Dockerfile']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MCQ': return 'bg-blue-100 text-blue-800';
      case 'Code': return 'bg-purple-100 text-purple-800';
      case 'Mixed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSessions = practiceSessions.filter(session => {
    const domainMatch = selectedDomain === 'all' || session.domain === selectedDomain;
    const typeMatch = selectedType === 'all' || session.type === selectedType;
    const difficultyMatch = selectedDifficulty === 'all' || session.difficulty === selectedDifficulty;
    return domainMatch && typeMatch && difficultyMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading practice sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/assessment"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Practice Mode</h1>
                  <p className="mt-2 text-gray-600">
                    Sharpen your skills with hands-on coding exercises and interactive challenges
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain === 'all' ? 'All Domains' : domain}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-2">Quick Practice Session</h2>
              <p className="text-green-100 mb-4">
                Start a random practice session with questions from your selected filters
              </p>
              <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Random Practice
              </button>
            </div>
            <div className="hidden md:block">
              <Target className="h-16 w-16 text-green-200" />
            </div>
          </div>
        </div>

        {/* Practice Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {session.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {session.description}
                    </p>
                  </div>
                  {session.isCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
                    {session.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{session.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="h-4 w-4" />
                      <span>{session.questionCount} questions</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {session.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {session.isCompleted && session.bestScore && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Best Score</span>
                      <span className="text-lg font-bold text-green-600">{session.bestScore}%</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/assessment/practice/${session.id}`}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {session.isCompleted ? 'Practice Again' : 'Start Practice'}
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Target className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No practice sessions found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options.</p>
          </div>
        )}
      </div>
    </div>
  );
} 