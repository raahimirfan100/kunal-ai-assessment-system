'use client';

import { useState } from 'react';
import { Question } from '@/types';

interface ShortTextQuestionProps {
  question: Question;
  onAnswerChange: (answer: string) => void;
  initialAnswer?: string;
  disabled?: boolean;
}

export default function ShortTextQuestion({ 
  question, 
  onAnswerChange, 
  initialAnswer = '', 
  disabled = false 
}: ShortTextQuestionProps) {
  const [answer, setAnswer] = useState(initialAnswer);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    
    const value = e.target.value;
    setAnswer(value);
    onAnswerChange(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        <p className="text-gray-700 mb-4">{question.content}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer
        </label>
        <textarea
          value={answer}
          onChange={handleInputChange}
          disabled={disabled}
          className="textarea-field h-24"
          placeholder="Enter your answer here..."
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            Maximum 500 characters
          </p>
          <span className="text-xs text-gray-500">
            {answer.length}/500
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.points}
      </div>
    </div>
  );
} 