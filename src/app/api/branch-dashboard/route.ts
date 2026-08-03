export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchQuery = searchParams.get('branch')?.toUpperCase();

    if (!branchQuery) {
      return NextResponse.json({ error: 'Branch parameter is required' }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), 'public', 'data', 'results.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContents);

    // Filter strictly for the requested branch
    const branchData = data.filter((s: any) => s.branch?.toUpperCase() === branchQuery);

    if (branchData.length === 0) {
      return NextResponse.json({ error: `No data found for branch ${branchQuery}` }, { status: 404 });
    }

    // Calculations
    let maxCgpa = -1;
    let topper = null;
    
    let maxImprovement = -999;
    let mostImproved = null;
    
    let minVariance = 999;
    let mostConsistent = null;
    
    let atRiskCount = 0;
    let maxDrop = -999;

    branchData.forEach((s: any) => {
      const cgpa = parseFloat(s.cgpa);
      const semSgpas = s.sgpa ? Object.values(s.sgpa).map(v => parseFloat(v as string)).filter(v => !isNaN(v)) : [];
      
      if (isNaN(cgpa)) return;

      if (cgpa > maxCgpa) {
        maxCgpa = cgpa;
        topper = s;
      }

      if (cgpa < 7) {
        atRiskCount++;
      }

      if (semSgpas.length > 1) {
        const improvement = semSgpas[semSgpas.length - 1] - semSgpas[0];
        if (improvement > maxImprovement) {
          maxImprovement = improvement;
          mostImproved = s;
        }

        const highestPrevious = Math.max(...semSgpas.slice(0, -1));
        const latest = semSgpas[semSgpas.length - 1];
        const drop = highestPrevious - latest;
        s.computedDrop = drop;
        
        if (drop > maxDrop && drop > 0) {
          maxDrop = drop;
        }

        const mean = semSgpas.reduce((a, b) => a + b, 0) / semSgpas.length;
        const variance = semSgpas.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / semSgpas.length;
        if (variance < minVariance) {
          minVariance = variance;
          mostConsistent = s;
        }
      } else {
        s.computedDrop = 0;
      }
    });

    const leaderboard = branchData
      .sort((a: any, b: any) => b.cgpa - a.cgpa)
      .map((s: any, index: number) => ({
        rank: index + 1,
        name: s.name,
        branch: s.branch,
        cgpa: s.cgpa,
      }));

    const distribution = {
      '9-10 (Elite)': 0,
      '8-9 (Pro)': 0,
      '7-8 (Avg)': 0,
      '<7 (Risk)': 0,
    };
    branchData.forEach((s: any) => {
      const c = parseFloat(s.cgpa);
      if (c >= 9) distribution['9-10 (Elite)']++;
      else if (c >= 8) distribution['8-9 (Pro)']++;
      else if (c >= 7) distribution['7-8 (Avg)']++;
      else distribution['<7 (Risk)']++;
    });

    const semStats: Record<string, { total: number, count: number }> = {};
    branchData.forEach((s: any) => {
      if (s.sgpa) {
        Object.entries(s.sgpa).forEach(([sem, val]) => {
          const v = parseFloat(val as string);
          if (!isNaN(v)) {
            if (!semStats[sem]) semStats[sem] = { total: 0, count: 0 };
            semStats[sem].total += v;
            semStats[sem].count += 1;
          }
        });
      }
    });
    
    const semTrend = Object.entries(semStats).map(([sem, stats]) => ({
      semester: sem.replace('sem', 'Sem '),
      average: parseFloat((stats.total / stats.count).toFixed(2))
    })).sort((a, b) => a.semester.localeCompare(b.semester));

    // Use raw cgpa from dataset (exact Excel value). Never recalculate.
    const heatmapData = branchData.map((s: any) => ({
      name: s.name,
      rollNumber: s.rollNumber ?? '',
      cgpa: s.cgpa,   // ← raw value from Excel, not recalculated
      ...s.sgpa
    }));

    const dropAnalysis = branchData
      .filter((s: any) => s.computedDrop > 0)
      .sort((a: any, b: any) => b.computedDrop - a.computedDrop)
      .slice(0, 10)
      .map((s: any) => ({
        name: s.name,
        drop: parseFloat(s.computedDrop.toFixed(2))
      }));

    return NextResponse.json({
      hero: {
        topper,
        mostImproved,
        mostConsistent,
        atRiskCount
      },
      leaderboard,
      distribution: Object.entries(distribution).map(([name, count]) => ({ name, count })),
      semTrend,
      heatmapData,
      dropAnalysis,
      totalStudents: branchData.length
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
