import { NextRequest, NextResponse } from 'next/server';
import { updateSubmission, getSubmissionById } from '@/utils/dataManager';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = getSubmissionById(params.id);
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { answers, isCompleted, endTime, totalScore, timeSpent } = body;

    const updatedSubmission = updateSubmission(params.id, {
      ...(answers && { answers }),
      ...(isCompleted !== undefined && { isCompleted }),
      ...(endTime && { endTime }),
      ...(totalScore !== undefined && { totalScore }),
      ...(timeSpent !== undefined && { timeSpent }),
    });

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
} 