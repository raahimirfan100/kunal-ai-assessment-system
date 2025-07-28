'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Save, Loader2 } from 'lucide-react';
import { QuestionType } from '@/types';
import { generateQuestions, GeneratedQuestion } from '@/utils/aiQuestionGenerator';
import Navigation from '@/components/Navigation';

export default function AIGeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [formData, setFormData] = useState({
    topic: 'javascript',
    type: 'mcq' as QuestionType,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    count: 3
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const questions = await generateQuestions(formData);
      setGeneratedQuestions(questions);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async (question: GeneratedQuestion) => {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          title: question.title,
          content: question.content,
          options: question.options,
          correctAnswer: question.correctAnswer,
          codeTemplate: question.codeTemplate,
          language: question.language,
          points: question.points
        }),
      });

      if (response.ok) {
        alert('Question saved successfully!');
        setGeneratedQuestions(prev => prev.filter(q => q !== question));
      } else {
        alert('Failed to save question');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question');
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    
    try {
      const promises = generatedQuestions.map(question =>
        fetch('/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: formData.type,
            title: question.title,
            content: question.content,
            options: question.options,
            correctAnswer: question.correctAnswer,
            codeTemplate: question.codeTemplate,
            language: question.language,
            points: question.points
          }),
        })
      );

      await Promise.all(promises);
      alert('All questions saved successfully!');
      setGeneratedQuestions([]);
    } catch (error) {
      console.error('Error saving questions:', error);
      alert('Failed to save some questions');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation role="hr" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push('/hr/questions')}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Question Generator</h1>
            <p className="text-gray-600">Generate questions automatically using AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Generate Questions</h2>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="javascript">JavaScript</option>
                  <option value="react">React</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="html">HTML/CSS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="fill-in-blank">Fill in the Blank</option>
                  <option value="coding">Coding</option>
                  <option value="drag-drop">Drag & Drop</option>
                  <option value="short-text">Short Text</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions *
                </label>
                <input
                  type="number"
                  value={formData.count}
                  onChange={(e) => handleInputChange('count', parseInt(e.target.value))}
                  className="input-field"
                  min="1"
                  max="10"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Questions
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Questions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Generated Questions ({generatedQuestions.length})
              </h2>
              {generatedQuestions.length > 0 && (
                <button
                  onClick={handleSaveAll}
                  disabled={loading}
                  className="btn-primary text-sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save All
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No questions generated yet</p>
                  <p className="text-sm text-gray-500">Use the form to generate questions</p>
                </div>
              ) : (
                generatedQuestions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getQuestionTypeIcon(formData.type)}</span>
                        <h3 className="font-medium text-gray-900">{question.title}</h3>
                      </div>
                      <button
                        onClick={() => handleSaveQuestion(question)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{question.content}</p>
                    
                    {question.options && (
                      <div className="space-y-1 mb-3">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="text-xs text-gray-500">
                            {optIndex + 1}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{question.points} points</span>
                      <span className="capitalize">{formData.difficulty}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 