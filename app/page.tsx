'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, UserCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<'hr' | 'candidate' | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Assessment System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform for creating, managing, and taking assessments.
            Choose your role to get started.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* HR Panel */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                HR Panel
              </h2>
              <p className="text-gray-600 mb-6">
                Create and manage assessments, assign tests to candidates, and review results.
              </p>
              <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                <li>• Create and manage questions</li>
                <li>• Generate AI-powered questions</li>
                <li>• Assign tests to candidates</li>
                <li>• Review submissions and results</li>
                <li>• Set time limits and scoring</li>
              </ul>
              <Link 
                href="/hr/dashboard"
                className="btn-primary inline-flex items-center gap-2"
              >
                Access HR Panel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Candidate Panel */}
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Candidate Panel
              </h2>
              <p className="text-gray-600 mb-6">
                Take assigned assessments, view results, and track your progress.
              </p>
              <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
                <li>• View assigned tests</li>
                <li>• Take assessments with timer</li>
                <li>• Multiple question types</li>
                <li>• Real-time progress tracking</li>
                <li>• View results and feedback</li>
              </ul>
              <Link 
                href="/candidate/dashboard"
                className="btn-primary inline-flex items-center gap-2"
              >
                Access Candidate Panel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            System Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-semibold">5</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Question Types</h4>
              <p className="text-sm text-gray-600">
                MCQ, Fill-in-blank, Coding, Drag & Drop, Short Text
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-semibold">AI</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Generation</h4>
              <p className="text-sm text-gray-600">
                Automatically generate questions using AI
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-semibold">⏱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Time Management</h4>
              <p className="text-sm text-gray-600">
                Set time limits and auto-submit features
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 