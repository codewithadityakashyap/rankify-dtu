import { NextResponse } from 'next/server';
import subjectStats from '@/data/subject_stats.json';

export async function GET() {
  return NextResponse.json(subjectStats);
}
