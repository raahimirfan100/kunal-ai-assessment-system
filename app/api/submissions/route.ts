import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions, createSubmission, getSubmissionsByCandidate, getSubmissionsByTest } from '@/utils/dataManager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('candidateId');
    const testId = searchParams.get('testId');

    let submissions;
    if (candidateId && testId) {
      // Get submissions for specific candidate and test
      const candidateSubmissions = getSubmissionsByCandidate(candidateId);
      submissions = candidateSubmissions.filter(s => s.testId === testId);
    } else if (candidateId) {
      submissions = getSubmissionsByCandidate(candidateId);
    } else if (testId) {
      submissions = getSubmissionsByTest(testId);
    } else {
      submissions = getAllSubmissions();
    }

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidateId, testId, answers, startTime, maxScore } = body;

    // Validate required fields
    if (!candidateId || !testId || !answers || !startTime || !maxScore) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newSubmission = createSubmission({
      candidateId,
      testId,
      answers,
      startTime,
      maxScore,
      isCompleted: false,
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
} 