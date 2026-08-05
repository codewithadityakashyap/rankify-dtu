export const dynamic = 'force-dynamic';
import { validateRequestOrigin } from '@/lib/security';
import { NextResponse } from 'next/server';
import transcriptsData from '../../../../src/data/transcripts.json';

export async function GET(request: Request) {
  // SECURITY CHECK
  if (!validateRequestOrigin(request as any)) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get('rollNumber');

    if (!rollNumber) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }

    // transcriptsData is a dictionary mapping Roll Number to transcript object
    const data = (transcriptsData as any)[rollNumber];

    if (!data) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
