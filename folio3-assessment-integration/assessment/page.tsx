'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ClipboardList, Target, ArrowRight } from 'lucide-react';

export default function AssessmentPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const assessmentCards = [
    {
      id: 'take-assessment',
      title: 'Take Assessment',
      description: 'Test your skills with AI-powered assessments and get detailed feedback on your performance.',
      icon: ClipboardList,
      href: '/assessment/take-assessment',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'practice',
      title: 'Practice Mode',
      description: 'Sharpen your skills with hands-on coding exercises and interactive challenges.',
      icon: Target,
      href: '/assessment/practice',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'results',
      title: 'Assessment Results',
      description: 'View your previous assessment scores and detailed performance analytics.',
      icon: BookOpen,
      href: '/assessment/results',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
            <p className="mt-2 text-gray-600">
              Test your skills and track your progress with AI-powered assessments
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Practice Sessions</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessmentCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className={`block group transition-all duration-200 ${
                  hoveredCard === card.id ? 'transform scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`h-full bg-white rounded-lg shadow-sm border-2 ${card.borderColor} p-6 transition-all duration-200 hover:shadow-lg`}>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      hoveredCard === card.id ? 'transform translate-x-1' : ''
                    }`} />
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center text-sm font-medium text-blue-600">
                    Get Started
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ClipboardList className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">JavaScript Basics Assessment</p>
                      <p className="text-sm text-gray-500">Completed 2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">92%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Python Practice Session</p>
                      <p className="text-sm text-gray-500">Completed 1 day ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">15/20</p>
                    <p className="text-xs text-gray-500">Questions</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">HTML & CSS Assessment</p>
                      <p className="text-sm text-gray-500">Completed 3 days ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">88%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 