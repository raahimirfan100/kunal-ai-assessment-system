'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Eye, Trash2, FileText } from 'lucide-react';

interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  totalPoints: number;
  isActive: boolean;
  createdAt: string;
}

export default function HRAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/assessment/quizzes');
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
                      <Link
              href="/assessments/tests/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2"
            >
            <Plus className="w-4 h-4" />
            Create Assessment
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  assessment.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {assessment.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{assessment.description}</p>
              
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Time: {assessment.timeLimit} min</span>
                <span>Points: {assessment.totalPoints}</span>
              </div>
              
              <div className="flex gap-2">
                <Link
                  href={`/assessments/tests/${assessment.id}`}
                  className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <Link
                  href={`/assessments/tests/${assessment.id}/edit`}
                  className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>

        {assessments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
            <p className="text-gray-600 mb-6">Create your first assessment to get started</p>
            <Link
              href="/assessments/tests/new"
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Assessment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 