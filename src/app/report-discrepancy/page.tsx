import DiscrepancyForm from '@/components/forms/DiscrepancyForm';

export const metadata = {
  title: 'Report Discrepancy - Rankify DTU',
  description: 'Report a discrepancy in your CGPA or SGPA and submit proof for correction.',
};

export default function ReportDiscrepancyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] font-sans selection:bg-indigo-500/30 py-12 px-4 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-600/10 dark:bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-96 bg-emerald-500/10 blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10 text-center mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Report a Result Discrepancy
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          If you've noticed an error or inconsistency in your uploaded results (like an un-updated backlog or wrong SGPA), please submit the correct details and a proof document below.
        </p>
      </div>

      <DiscrepancyForm />
    </div>
  );
}
