'use client';

import { useState } from 'react';
import { Question } from '@/types';

interface FillInBlankQuestionProps {
  question: Question;
  onAnswerChange: (answer: string) => void;
  initialAnswer?: string;
  disabled?: boolean;
}

export default function FillInBlankQuestion({ 
  question, 
  onAnswerChange, 
  initialAnswer = '', 
  disabled = false 
}: FillInBlankQuestionProps) {
  const [answer, setAnswer] = useState(initialAnswer);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const value = e.target.value;
    setAnswer(value);
    onAnswerChange(value);
  };

  // Split content by underscores to identify blanks
  const contentParts = question.content.split('_____');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        <div className="text-gray-700">
          {contentParts.map((part, index) => (
            <span key={index}>
              {part}
              {index < contentParts.length - 1 && (
                <input
                  type="text"
                  value={answer}
                  onChange={handleInputChange}
                  disabled={disabled}
                  className="mx-2 px-3 py-1 border-b-2 border-primary-500 focus:outline-none focus:border-primary-700 bg-transparent text-primary-700 font-medium min-w-[120px]"
                  placeholder="Your answer"
                />
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.points}
      </div>
    </div>
  );
} 