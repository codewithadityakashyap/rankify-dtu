
import SubjectDashboard from '@/components/subjects/SubjectDashboard';
import subjectStats from '@/data/subject_stats.json';

export const metadata = {
  title: 'Subject Analysis - Rankify DTU',
  description: 'Analyze subject performance, pass rates, and grade distributions across DTU.',
};

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] font-sans selection:bg-indigo-500/30">

      <main className="w-full">
        <SubjectDashboard initialData={subjectStats} />
      </main>
    </div>
  );
}
