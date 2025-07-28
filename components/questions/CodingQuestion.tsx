'use client';

import { useState } from 'react';
import { Question } from '@/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodingQuestionProps {
  question: Question;
  onAnswerChange: (answer: string) => void;
  initialAnswer?: string;
  disabled?: boolean;
}

export default function CodingQuestion({ 
  question, 
  onAnswerChange, 
  initialAnswer = '', 
  disabled = false 
}: CodingQuestionProps) {
  const [code, setCode] = useState(initialAnswer || question.codeTemplate || '');

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    
    const value = e.target.value;
    setCode(value);
    onAnswerChange(value);
  };

  const getLanguage = () => {
    return question.language || 'javascript';
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        <p className="text-gray-700 mb-4">{question.content}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Code ({getLanguage()})
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <textarea
              value={code}
              onChange={handleCodeChange}
              disabled={disabled}
              className="w-full h-64 p-4 font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Write your code here..."
            />
          </div>
        </div>

        {question.codeTemplate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code Template
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language={getLanguage()}
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.875rem',
                  backgroundColor: '#f8f9fa'
                }}
              >
                {question.codeTemplate}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.points}
      </div>
    </div>
  );
} 