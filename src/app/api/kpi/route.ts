import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get('branch');

    const dataPath = path.join(process.cwd(), 'public', 'data', 'results.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContents);

    let kpiData = data;
    if (branch && branch !== 'All') {
      kpiData = data.filter((s: any) => s.branch.toLowerCase() === branch.toLowerCase());
    }

    // Overall Topper
    const overallTopper = data.reduce((max: any, s: any) => (s.cgpa > max.cgpa ? s : max), data[0]);
    
    // Branch Topper (if filter selected or default to Overall Topper logic if no specific branch but we want to show it dynamically)
    let branchTopper = null;
    if (branch && branch !== 'All' && kpiData.length > 0) {
      branchTopper = kpiData.reduce((max: any, s: any) => (s.cgpa > max.cgpa ? s : max), kpiData[0]);
    }

    // Most Improved Student overall or in branch
    const validImprovements = kpiData.filter((s: any) => s.improvement > 0);
    let mostImproved = null;
    if (validImprovements.length > 0) {
      mostImproved = validImprovements.reduce((max: any, s: any) => (s.improvement > max.improvement ? s : max), validImprovements[0]);
    }

    // Analytics stats
    const branchGroups = data.reduce((acc: any, s: any) => {
      acc[s.branch] = (acc[s.branch] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      overallTopper,
      branchTopper: branchTopper || overallTopper,
      mostImproved,
      stats: {
        totalStudents: data.length,
        branchDistribution: branchGroups
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
