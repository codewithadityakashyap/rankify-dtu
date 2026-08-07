import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const batch = searchParams.get('batch') || '2027'; // default to 2027
    
    const filePath = path.join(process.cwd(), 'src', 'data', 'results.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Results data not found' }, { status: 404 });
    }
    
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data: any[] = JSON.parse(raw);
    
    const batchData = data.filter(s => s.batch === batch && typeof s.cgpa === 'number' && s.cgpa > 0);
    
    // Group CGPAs by branch
    const branchCgpas: Record<string, number[]> = {};
    const overallCgpas: number[] = [];
    
    for (const student of batchData) {
      if (!branchCgpas[student.branch]) {
        branchCgpas[student.branch] = [];
      }
      branchCgpas[student.branch].push(student.cgpa);
      overallCgpas.push(student.cgpa);
    }
    
    // Sort all arrays descending (highest CGPA first)
    overallCgpas.sort((a, b) => b - a);
    for (const branch in branchCgpas) {
      branchCgpas[branch].sort((a, b) => b - a);
    }
    
    return NextResponse.json({
      batch,
      totalStudents: overallCgpas.length,
      overallCgpas,
      branchCgpas
    });
  } catch (error) {
    console.error('Error fetching rank estimator data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
