import { Metadata } from 'next';
import { BackButton } from '@/components/BackButton';
import { CompareStudentsClient } from '@/components/compare/CompareStudentsClient';
import resultsData from '../../../src/data/results.json';
import transcriptsData from '../../../src/data/transcripts.json';

export const metadata: Metadata = {
  title: 'Compare Students - DTU Result & Placement Analytics',
  description: 'Side-by-side comparison of DTU students based on academic performance, CGPA, and ranks.',
};

export default function CompareStudentsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-sans text-foreground tracking-tight">Compare Students</h1>
        <p className="text-muted-foreground mt-2">Select two students to compare their academic progression and performance.</p>
      </div>
      
      <CompareStudentsClient allStudents={resultsData} allTranscripts={transcriptsData} />
    </div>
  );
}
