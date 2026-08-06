export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import resultsData from '../../../../src/data/results.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branch = searchParams.get('branch') || 'All';

    let data = resultsData as any[];
    if (branch !== 'All') {
      data = data.filter(s => s.branch === branch);
    }

    let totalStudents = data.length;
    let studentsWithBacklogs = 0;
    let totalFailedSubjects = 0;
    let clearedStudents = 0;
    let revisedResultsCount = 0;

    const branchBacklogs: Record<string, { count: number, students: number }> = {};
    const subjectFailures: Record<string, { name: string, count: number, branches: Set<string> }> = {};

    data.forEach(s => {
      if (s.reappearInfo) {
        if (s.reappearInfo.status === 'Has Active Backlogs') {
          studentsWithBacklogs++;
          totalFailedSubjects += s.reappearInfo.totalBacklogs;
          
          if (!branchBacklogs[s.branch]) branchBacklogs[s.branch] = { count: 0, students: 0 };
          branchBacklogs[s.branch].count += s.reappearInfo.totalBacklogs;
          branchBacklogs[s.branch].students++;

          s.reappearInfo.failedSubjects.forEach((sub: any) => {
            if (!subjectFailures[sub.code]) {
              subjectFailures[sub.code] = { name: sub.name, count: 0, branches: new Set() };
            }
            subjectFailures[sub.code].count++;
            subjectFailures[sub.code].branches.add(s.branch);
          });
        } else if (s.reappearInfo.status === 'Cleared Through Revised Results') {
          clearedStudents++;
          revisedResultsCount += s.reappearInfo.clearedSubjects.length;
        }
      }
    });

    // Formatting output
    const mostFailedSubjects = Object.entries(subjectFailures)
      .map(([code, info]) => ({
        code,
        name: info.name,
        count: info.count,
        branches: Array.from(info.branches)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const branchBacklogRate = Object.entries(branchBacklogs).map(([br, info]) => {
      const branchTotal = data.filter(s => s.branch === br).length;
      return {
        branch: br,
        rate: branchTotal > 0 ? (info.students / branchTotal) * 100 : 0,
        totalBacklogs: info.count
      };
    }).sort((a, b) => b.rate - a.rate);

    return NextResponse.json({
      stats: {
        totalStudents,
        studentsWithBacklogs,
        totalFailedSubjects,
        clearedStudents,
        revisedResultsCount,
        averageBacklogsPerStudent: studentsWithBacklogs > 0 ? totalFailedSubjects / studentsWithBacklogs : 0,
        overallBacklogRate: totalStudents > 0 ? (studentsWithBacklogs / totalStudents) * 100 : 0
      },
      mostFailedSubjects,
      branchBacklogRate
    });
  } catch (error) {
    console.error('Error fetching reappear stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
