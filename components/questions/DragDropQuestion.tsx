'use client';

import { useState, useEffect } from 'react';
import { Question, DragDropItem } from '@/types';

interface DragDropQuestionProps {
  question: Question;
  onAnswerChange: (answer: string[]) => void;
  initialAnswer?: string[];
  disabled?: boolean;
}

export default function DragDropQuestion({ 
  question, 
  onAnswerChange, 
  initialAnswer = [], 
  disabled = false 
}: DragDropQuestionProps) {
  const [items, setItems] = useState<DragDropItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<DragDropItem | null>(null);

  useEffect(() => {
    // Parse items from question content or use default items
    if (question.content.includes('|')) {
      const itemStrings = question.content.split('|').map((item, index) => ({
        id: `item-${index}`,
        content: item.trim(),
        order: index
      }));
      setItems(itemStrings);
    } else {
      // Default items for demo
      const defaultItems = [
        { id: 'item-1', content: 'First step', order: 0 },
        { id: 'item-2', content: 'Second step', order: 1 },
        { id: 'item-3', content: 'Third step', order: 2 },
        { id: 'item-4', content: 'Fourth step', order: 3 }
      ];
      setItems(defaultItems);
    }
  }, [question.content]);

  useEffect(() => {
    // Update answer when items order changes
    const orderedItems = [...items].sort((a, b) => a.order - b.order);
    const answer = orderedItems.map(item => item.content);
    onAnswerChange(answer);
  }, [items, onAnswerChange]);

  const handleDragStart = (e: React.DragEvent, item: DragDropItem) => {
    if (disabled) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItem: DragDropItem) => {
    if (disabled || !draggedItem || draggedItem.id === targetItem.id) return;
    
    e.preventDefault();
    
    const newItems = items.map(item => {
      if (item.id === draggedItem.id) {
        return { ...item, order: targetItem.order };
      }
      if (item.id === targetItem.id) {
        return { ...item, order: draggedItem.order };
      }
      return item;
    });
    
    setItems(newItems);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {question.title}
        </h3>
        <p className="text-gray-700 mb-4">
          Drag and drop the items to arrange them in the correct order:
        </p>
      </div>

      <div className="space-y-2">
        {sortedItems.map((item, index) => (
          <div
            key={item.id}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item)}
            onDragEnd={handleDragEnd}
            className={`p-4 border-2 border-dashed rounded-lg cursor-move transition-colors ${
              draggedItem?.id === item.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {index + 1}
              </div>
              <span className="text-gray-900">{item.content}</span>
              {!disabled && (
                <div className="ml-auto text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        Points: {question.points}
      </div>
    </div>
  );
} 