import { Metadata } from 'next';
import { RankEstimatorClient } from './RankEstimatorClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Rank Estimator | Rankify DTU',
  description: 'Estimate your DTU batch rank and CGPA percentile instantly based on official result statistics.',
};

export default function RankEstimatorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <RankEstimatorClient />
    </Suspense>
  );
}
