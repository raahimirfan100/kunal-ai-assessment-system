'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { QuestionType } from '@/types';

export default function NewQuestionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'mcq' as QuestionType,
    title: '',
    content: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    codeTemplate: '',
    language: 'javascript',
    points: 10,
    timeLimit: 0
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const questionData = {
        ...formData,
        options: formData.type === 'mcq' ? formData.options.filter(opt => opt.trim() !== '') : undefined,
        correctAnswer: formData.correctAnswer || undefined,
        codeTemplate: formData.type === 'coding' ? formData.codeTemplate : undefined,
        language: formData.type === 'coding' ? formData.language : undefined,
        timeLimit: formData.timeLimit > 0 ? formData.timeLimit : undefined
      };

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (response.ok) {
        router.push('/assessments/dashboard');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeDescription = (type: QuestionType) => {
    switch (type) {
      case 'mcq':
        return 'Multiple choice question with one correct answer';
      case 'fill-in-blank':
        return 'Fill in the blank with correct answer';
      case 'coding':
        return 'Coding question with code editor';
      case 'drag-drop':
        return 'Drag and drop reordering question';
      case 'short-text':
        return 'Short text response (1-2 lines)';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/assessments/dashboard')}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Question</h1>
                <p className="text-gray-600">Add a new question to the question bank</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question Type */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Question Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['mcq', 'fill-in-blank', 'coding', 'drag-drop', 'short-text'] as QuestionType[]).map((type) => (
                <label
                  key={type}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.type === type
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="questionType"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {type === 'mcq' && '📝'}
                      {type === 'fill-in-blank' && '✏️'}
                      {type === 'coding' && '💻'}
                      {type === 'drag-drop' && '🔄'}
                      {type === 'short-text' && '📄'}
                    </div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {type.replace('-', ' ')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {getQuestionTypeDescription(type)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-field"
                  placeholder="Enter question title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points *
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                  className="input-field"
                  min="1"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="textarea-field h-32"
                placeholder="Enter the question content..."
                required
              />
              {formData.type === 'fill-in-blank' && (
                <p className="text-sm text-gray-500 mt-2">
                  Use <code className="bg-gray-100 px-1 rounded">_____</code> to indicate blanks
                </p>
              )}
            </div>
          </div>

          {/* MCQ Options */}
          {formData.type === 'mcq' && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Multiple Choice Options</h2>
                <button
                  type="button"
                  onClick={addOption}
                  className="btn-outline text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={option}
                      checked={formData.correctAnswer === option}
                      onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fill in Blank Answer */}
          {formData.type === 'fill-in-blank' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Correct Answer</h2>
              <input
                type="text"
                value={formData.correctAnswer}
                onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                className="input-field"
                placeholder="Enter the correct answer"
                required
              />
            </div>
          )}

          {/* Coding Question Settings */}
          {formData.type === 'coding' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Coding Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programming Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="input-field"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code Template
                </label>
                <textarea
                  value={formData.codeTemplate}
                  onChange={(e) => handleInputChange('codeTemplate', e.target.value)}
                  className="textarea-field h-32 font-mono text-sm"
                  placeholder="Enter code template (optional)"
                />
              </div>
            </div>
          )}

          {/* Time Limit */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Limit (Optional)</h2>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
                className="input-field w-32"
                min="0"
                placeholder="0"
              />
              <span className="text-gray-600">seconds (0 = no limit)</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/assessments/dashboard')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Question
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 