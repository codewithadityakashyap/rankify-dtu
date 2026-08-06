import { Metadata } from 'next';
import { ReappearDashboard } from '@/components/reappear/ReappearDashboard';

export const metadata: Metadata = {
  title: 'Reappear Analytics | Rankify DTU',
  description: 'Deep dive into backlog trends, reappear success rates, and subject difficulty analytics.',
};

async function getData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/reappear`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (err) {
    console.error('Error fetching reappear data, falling back', err);
    return {
      stats: {
        totalStudents: 0,
        studentsWithBacklogs: 0,
        totalFailedSubjects: 0,
        clearedStudents: 0,
        revisedResultsCount: 0,
        averageBacklogsPerStudent: 0,
        overallBacklogRate: 0
      },
      mostFailedSubjects: [],
      branchBacklogRate: []
    };
  }
}

export default async function ReappearPage() {
  const data = await getData();
  return <ReappearDashboard data={data} />;
}
