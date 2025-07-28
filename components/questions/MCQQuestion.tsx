'use client';

import { useState } from 'react';
import { Question } from '@/types';

interface MCQQuestionProps {
  question: Question;
  onAnswerChange: (answer: string) => void;
  initialAnswer?: string;
  disabled?: boolean;
}

export default function MCQQuestion({ 
  question, 
  onAnswerChange, 
  initialAnswer = '', 
  disabled = false 
}: MCQQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState(initialAnswer);

  const handleOptionSelect = (option: string) => {
    if (disabled) return;
    
    setSelectedAnswer(option);
    onAnswerChange(option);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        <p className="text-gray-700">{question.content}</p>
      </div>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAnswer === option
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => handleOptionSelect(option)}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center ${
              selectedAnswer === option
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-300'
            }`}>
              {selectedAnswer === option && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </div>
            <span className="text-gray-900">{option}</span>
          </label>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.points}
      </div>
    </div>
  );
} 