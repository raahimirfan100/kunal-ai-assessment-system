import { NextRequest, NextResponse } from 'next/server';
import { getAllQuestions, createQuestion, initializeDummyData } from '@/utils/dataManager';
import { Question } from '@/types';

export async function GET() {
  try {
    // Initialize dummy data if needed
    initializeDummyData();
    
    const questions = getAllQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, content, options, correctAnswer, codeTemplate, language, points, timeLimit } = body;

    // Validate required fields
    if (!type || !title || !content || !points) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newQuestion = createQuestion({
      type,
      title,
      content,
      options,
      correctAnswer,
      codeTemplate,
      language,
      points,
      timeLimit,
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
} 