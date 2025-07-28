import { NextRequest, NextResponse } from 'next/server';
import { cleanupIncompleteSubmissions } from '@/utils/dataManager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, testId, keepSubmissionId } = body;

    if (!candidateId || !testId || !keepSubmissionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    cleanupIncompleteSubmissions(candidateId, testId, keepSubmissionId);

    return NextResponse.json({ message: 'Cleanup completed successfully' });
  } catch (error) {
    console.error('Error cleaning up submissions:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup submissions' },
      { status: 500 }
    );
  }
} 