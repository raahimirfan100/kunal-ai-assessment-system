'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Star, Play, CheckCircle } from 'lucide-react';

interface Assessment {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  questionCount: number;
  participants: number;
  rating: number;
  tags: string[];
  isCompleted?: boolean;
  score?: number;
}

export default function TakeAssessmentPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const domains = ['all', 'JavaScript', 'Python', 'React', 'Node.js', 'Database', 'DevOps'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    // Simulate loading assessments
    const loadAssessments = async () => {
      try {
        const response = await fetch('/api/assessment/quizzes');
        if (response.ok) {
          const data = await response.json();
          // Transform quiz data to assessment format
          const transformedAssessments: Assessment[] = data.map((quiz: any) => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            domain: quiz.domain,
            difficulty: quiz.difficulty,
            duration: quiz.questionCount * 2, // 2 minutes per question
            questionCount: quiz.questionCount,
            participants: Math.floor(Math.random() * 1000) + 50,
            rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
            tags: [quiz.domain, quiz.difficulty],
            isCompleted: Math.random() > 0.7, // 30% chance of being completed
            score: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
          }));
          setAssessments(transformedAssessments);
        } else {
          // Fallback data
          setAssessments(getDefaultAssessments());
        }
      } catch (error) {
        console.error('Failed to load assessments:', error);
        setAssessments(getDefaultAssessments());
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, []);

  const getDefaultAssessments = (): Assessment[] => [
    {
      id: 'js-basics',
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
      domain: 'JavaScript',
      difficulty: 'Beginner',
      duration: 20,
      questionCount: 10,
      participants: 1247,
      rating: 4.5,
      tags: ['JavaScript', 'Beginner'],
      isCompleted: true,
      score: 92
    },
    {
      id: 'python-intermediate',
      title: 'Python Intermediate Concepts',
      description: 'Advanced Python concepts including classes, decorators, and async programming.',
      domain: 'Python',
      difficulty: 'Intermediate',
      duration: 30,
      questionCount: 15,
      participants: 856,
      rating: 4.3,
      tags: ['Python', 'Intermediate']
    },
    {
      id: 'react-advanced',
      title: 'React Advanced Patterns',
      description: 'Master React hooks, context, performance optimization, and advanced patterns.',
      domain: 'React',
      difficulty: 'Advanced',
      duration: 40,
      questionCount: 20,
      participants: 634,
      rating: 4.7,
      tags: ['React', 'Advanced']
    },
    {
      id: 'node-backend',
      title: 'Node.js Backend Development',
      description: 'Server-side JavaScript with Express, middleware, authentication, and database integration.',
      domain: 'Node.js',
      difficulty: 'Intermediate',
      duration: 35,
      questionCount: 18,
      participants: 789,
      rating: 4.4,
      tags: ['Node.js', 'Intermediate']
    },
    {
      id: 'database-design',
      title: 'Database Design & SQL',
      description: 'Database normalization, SQL queries, indexing, and performance optimization.',
      domain: 'Database',
      difficulty: 'Intermediate',
      duration: 25,
      questionCount: 12,
      participants: 567,
      rating: 4.2,
      tags: ['Database', 'Intermediate']
    },
    {
      id: 'devops-basics',
      title: 'DevOps Fundamentals',
      description: 'CI/CD pipelines, Docker containers, cloud deployment, and infrastructure as code.',
      domain: 'DevOps',
      difficulty: 'Beginner',
      duration: 30,
      questionCount: 15,
      participants: 423,
      rating: 4.6,
      tags: ['DevOps', 'Beginner']
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

  const filteredAssessments = assessments.filter(assessment => {
    const domainMatch = selectedDomain === 'all' || assessment.domain === selectedDomain;
    const difficultyMatch = selectedDifficulty === 'all' || assessment.difficulty === selectedDifficulty;
    return domainMatch && difficultyMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
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
            <div className="flex items-center gap-4">
              <Link
                href="/assessment"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Take Assessment</h1>
                <p className="mt-2 text-gray-600">
                  Choose an assessment to test your skills and get AI-powered feedback
                </p>
              </div>
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
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain === 'all' ? 'All Domains' : domain}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      {/* Assessments Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {assessment.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {assessment.description}
                    </p>
                  </div>
                  {assessment.isCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                    {assessment.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{assessment.domain}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{assessment.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{assessment.participants}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{assessment.rating}</span>
                  </div>
                </div>

                {assessment.isCompleted && assessment.score && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Previous Score</span>
                      <span className="text-lg font-bold text-green-600">{assessment.score}%</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={`/assessment/take-assessment/${assessment.id}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    {assessment.isCompleted ? 'Retake' : 'Start'}
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more options.</p>
          </div>
        )}
      </div>
    </div>
  );
} 