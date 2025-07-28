import { NextRequest, NextResponse } from 'next/server';
import { getAllCandidates, createCandidate, initializeDummyData } from '@/utils/dataManager';

export async function GET() {
  try {
    // Initialize dummy data if needed
    initializeDummyData();
    
    const candidates = getAllCandidates();
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, assignedTests } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newCandidate = createCandidate({
      name,
      email,
      assignedTests: assignedTests || [],
    });

    return NextResponse.json(newCandidate, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: 'Failed to create candidate' },
      { status: 500 }
    );
  }
} 