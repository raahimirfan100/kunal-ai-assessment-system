import { NextResponse } from 'next/server';

interface Quiz {
  id: string;
  title: string;
  description: string;
  domain: string;
  questionCount: number;
  difficulty: string;
}

export async function GET() {
  try {
    // In a real application, this would come from a database
    const quizzes: Quiz[] = [
      {
        id: 'js-basics',
        title: 'JavaScript Basics',
        description: 'Test your knowledge of JavaScript fundamentals including variables, functions, and basic syntax.',
        domain: 'JavaScript',
        questionCount: 10,
        difficulty: 'Beginner'
      },
      {
        id: 'python-basics',
        title: 'Python Basics',
        description: 'Test your knowledge of Python fundamentals including data types, functions, and control structures.',
        domain: 'Python',
        questionCount: 10,
        difficulty: 'Beginner'
      },
      {
        id: 'html-css',
        title: 'HTML & CSS',
        description: 'Test your knowledge of web development basics including HTML structure and CSS styling.',
        domain: 'Web Development',
        questionCount: 10,
        difficulty: 'Beginner'
      },
      {
        id: 'js-intermediate',
        title: 'JavaScript Intermediate',
        description: 'Test your knowledge of advanced JavaScript concepts including closures, promises, and ES6 features.',
        domain: 'JavaScript',
        questionCount: 15,
        difficulty: 'Intermediate'
      },
      {
        id: 'python-intermediate',
        title: 'Python Intermediate',
        description: 'Test your knowledge of advanced Python concepts including classes, decorators, and modules.',
        domain: 'Python',
        questionCount: 15,
        difficulty: 'Intermediate'
      },
      {
        id: 'algorithms',
        title: 'Algorithms & Data Structures',
        description: 'Test your knowledge of common algorithms and data structures.',
        domain: 'Computer Science',
        questionCount: 20,
        difficulty: 'Advanced'
      }
    ];

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
} 