export const dynamic = 'force-dynamic';
import { validateRequestOrigin } from '@/lib/security';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  // SECURITY CHECK
  if (!validateRequestOrigin(request as any)) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get('branch');
    const batch = searchParams.get('batch') || '2027';

    const dataPath = path.join(process.cwd(), 'src', 'data', 'results.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    let data = JSON.parse(fileContents);

    // Filter by batch
    if (batch && batch !== 'All') {
      data = data.filter((s: any) => s.batch === batch);
    }

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

    // Analytics stats: Distribution
    const branchGroups = data.reduce((acc: any, s: any) => {
      acc[s.branch] = (acc[s.branch] || 0) + 1;
      return acc;
    }, {});

    // Analytics stats: Branch-Wise Average CGPA
    const branchStats: Record<string, { total: number, count: number }> = {};
    const BRANCHES = batch === '2029' 
      ? ["AE", "BT", "CE", "CH", "CS", "CY", "DA", "EC", "EE", "EP", "EN", "IT", "MC", "ME", "PE", "SE", "VL"]
      : ["AE", "BT", "CE", "CH", "CS", "EC", "EE", "EP", "EN", "IT", "MC", "ME", "PE", "SE"];
    
    BRANCHES.forEach(b => {
      branchStats[b] = { total: 0, count: 0 };
    });

    let totalCgpaSum = 0;
    let totalCgpaCount = 0;

    data.forEach((student: any) => {
      const b = student.branch?.toUpperCase();
      const cgpa = parseFloat(student.cgpa);
      if (!isNaN(cgpa) && cgpa > 0) {
        totalCgpaSum += cgpa;
        totalCgpaCount += 1;
        if (b && branchStats[b]) {
          branchStats[b].total += cgpa;
          branchStats[b].count += 1;
        }
      }
    });

    const universityAverageCgpa = totalCgpaCount > 0 ? (totalCgpaSum / totalCgpaCount).toFixed(2) : "0.00";

    const branchAverages = Object.entries(branchStats)
      .filter(([_, stats]) => stats.count > 0)
      .map(([branch, stats]) => ({
        branch: branch,
        averageCgpa: parseFloat((stats.total / stats.count).toFixed(2))
      }))
      .sort((a, b) => b.averageCgpa - a.averageCgpa);

    return NextResponse.json({
      overallTopper,
      branchTopper: branchTopper || overallTopper,
      mostImproved,
      stats: {
        totalStudents: data.length,
        branchDistribution: branchGroups,
        branchAverages: branchAverages,
        universityAverageCgpa
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
