import { NextRequest, NextResponse } from 'next/server';
import { getAllTests, createTest, initializeDummyData } from '@/utils/dataManager';

export async function GET() {
  try {
    // Initialize dummy data if needed
    initializeDummyData();
    
    const tests = getAllTests();
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, questions, timeLimit, totalPoints, isActive } = body;

    // Validate required fields
    if (!title || !description || !questions || !timeLimit || !totalPoints) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newTest = createTest({
      title,
      description,
      questions,
      timeLimit,
      totalPoints,
      isActive: isActive ?? true,
    });

    return NextResponse.json(newTest, { status: 201 });
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    );
  }
} 