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
    const dataPath = path.join(process.cwd(), 'src', 'data', 'results.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(fileContents);

    // 1. Filter specifically for BT branch
    const btData = data.filter((s: any) => s.branch?.toUpperCase() === 'BT');

    if (btData.length === 0) {
      return NextResponse.json({ error: 'No BT branch data found' }, { status: 404 });
    }

    // 2. Calculations
    let maxCgpa = -1;
    let topper = null;
    
    let maxSems = 0;
    btData.forEach((s: any) => {
      if (s.sgpa) {
        maxSems = Math.max(maxSems, Object.keys(s.sgpa).length);
      }
    });
    
    let maxImprovement = -999;
    let mostImproved = null;
    
    let minVariance = 999;
    let mostConsistent = null;
    
    let atRiskCount = 0;

    let maxDrop = -999; // positive value for drop

    btData.forEach((s: any) => {
      const cgpa = parseFloat(s.cgpa);
      const semSgpas = s.sgpa ? Object.values(s.sgpa).map(v => parseFloat(v as string)).filter(v => !isNaN(v)) : [];
      
      if (isNaN(cgpa)) return;

      // Topper
      if (cgpa > maxCgpa) {
        maxCgpa = cgpa;
        topper = s;
      }

      // Risk
      if (cgpa < 7) {
        atRiskCount++;
      }

      if (semSgpas.length > 1) {
        // Improvement (sem5 - sem1, or latest - first)
        const improvement = semSgpas[semSgpas.length - 1] - semSgpas[0];
        if (improvement > maxImprovement) {
          maxImprovement = improvement;
          mostImproved = s;
        }

        // Drop (highest previous - latest)
        const highestPrevious = Math.max(...semSgpas.slice(0, -1));
        const latest = semSgpas[semSgpas.length - 1];
        const drop = highestPrevious - latest;
        s.computedDrop = drop; // Attach for drop analysis sorting
        
        if (drop > maxDrop && drop > 0) {
          maxDrop = drop;
        }

        // Variance
        const mean = semSgpas.reduce((a, b) => a + b, 0) / semSgpas.length;
        const variance = semSgpas.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / semSgpas.length;
        
        const hasMissing = Object.values(s.sgpa || {}).some(v => !v || parseFloat(v as string) === 0) || semSgpas.length < maxSems;
        
        if (variance < minVariance && !hasMissing) {
          minVariance = variance;
          mostConsistent = s;
        }
      } else {
        s.computedDrop = 0;
      }
    });

    // 3. Leaderboard
    const leaderboard = btData
      .sort((a: any, b: any) => b.cgpa - a.cgpa)
      .map((s: any, index: number) => ({
        rank: index + 1,
        name: s.name,
        branch: s.branch,
        cgpa: s.cgpa,
      }));

    // 4. CGPA Distribution (Bins)
    const distribution = {
      '9-10 (Elite)': 0,
      '8-9 (Pro)': 0,
      '7-8 (Avg)': 0,
      '<7 (Risk)': 0,
    };
    btData.forEach((s: any) => {
      const c = parseFloat(s.cgpa);
      if (c >= 9) distribution['9-10 (Elite)']++;
      else if (c >= 8) distribution['8-9 (Pro)']++;
      else if (c >= 7) distribution['7-8 (Avg)']++;
      else distribution['<7 (Risk)']++;
    });

    // 5. Semester Trend
    const semStats: Record<string, { total: number, count: number }> = {};
    btData.forEach((s: any) => {
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

    // 6. Heatmap Data (Top 10-15 students for clean matrix, or all if preferred. Let's do top 15)
    // Rows: Students, Cols: Semesters
    const heatmapData = btData.slice(0, 15).map((s: any) => ({
      name: s.name,
      ...s.sgpa // effectively flattens sem1: 9, sem2: 8 to the root
    }));

    // 7. Drop Analysis
    const dropAnalysis = btData
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
      totalStudents: btData.length
    });

  } catch (error) {
    console.error("BT Dashboard API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
