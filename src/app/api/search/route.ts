export const dynamic = 'force-dynamic';
import { validateRequestOrigin } from '@/lib/security';
import { NextResponse } from 'next/server';
import resultsData from '../../../../src/data/results.json';
import placementsData from '../../../../src/data/placements.json';

export async function GET(request: Request) {
  // SECURITY CHECK
  if (!validateRequestOrigin(request as any)) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const batch = searchParams.get('batch');

    if (!q || q.length < 2) {
      return NextResponse.json({ students: [], placements: [] });
    }

    // 1. Search Results (Students)
    // Match by Name, Roll Number, Branch, or CGPA
    const matchedStudents = resultsData.filter((s: any) => {
      if (batch && s.batch !== batch) return false;
      const matchName = s.name.toLowerCase().includes(q);
      const matchRoll = s.rollNumber.toLowerCase().includes(q);
      const matchBranch = s.branch.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(`/${q}/`);
      const matchCGPA = s.cgpa && (s.cgpa.toString() === q || s.cgpa.toString().startsWith(q));
      
      return matchName || matchRoll || matchBranch || matchCGPA;
    }).slice(0, 10); // Limit to top 10

    // 2. Search Placements (Companies)
    // Match by Company Name, Role, or Student Name (if looking for who got placed where)
    const matchedPlacements = placementsData.filter((p: any) =>
      p.company.toLowerCase().includes(q) ||
      p.role?.toLowerCase().includes(q) ||
      p.name?.toLowerCase().includes(q) ||
      p.branch?.toLowerCase().includes(q)
    ).slice(0, 10);

    return NextResponse.json({
      students: matchedStudents,
      placements: matchedPlacements,
    });
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
