'use client';

import { useState, useEffect, Suspense } from 'react';
import { KPICards } from '@/components/dashboard/KPICards';
import { SearchAndFilter } from '@/components/dashboard/SearchAndFilter';
import { Clock } from 'lucide-react';
import { BatchSelector } from '@/components/dark-glass/BatchSelector';
import { ResultsTable } from '@/components/dashboard/ResultsTable';
import { StudentModal } from '@/components/dashboard/StudentModal';
import { Analytics } from '@/components/dashboard/Analytics';

import { Footer } from '@/components/Footer';
import { useRouter, useSearchParams } from 'next/navigation';
import { BranchSelector, STRICT_BRANCHES } from '@/components/BranchSelector';
import { LandingHero } from '@/components/landing/LandingHero';
import { StatsStrip } from '@/components/landing/StatsStrip';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TopRecruiters } from '@/components/landing/TopRecruiters';
import { useRef } from 'react';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batch = searchParams.get('batch') || '2027';

  const dashboardRef = useRef<HTMLElement>(null);
  const branchSelectorRef = useRef<HTMLDivElement>(null);
  
  const [kpiData, setKpiData] = useState<any>({
    overallTopper: null,
    branchTopper: null,
    mostImproved: null,
    stats: { totalStudents: 0, branchDistribution: {} }
  });
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [branch, setBranch] = useState('All');
  const [academicStatus, setAcademicStatus] = useState('All');
  const [sort, setSort] = useState('rank_asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Fetch KPI
  useEffect(() => {
    fetch(`/api/kpi?branch=${branch}&batch=${batch}`)
      .then(res => res.json())
      .then(data => setKpiData(data))
      .catch(console.error);
  }, [branch, batch]);

  // Fetch Results
  useEffect(() => {
    setIsLoadingResults(true);
    const params = new URLSearchParams({
      q: debouncedSearch,
      branch,
      batch,
      academicStatus,
      sort,
      page: page.toString(),
      limit: '30'
    });
    fetch(`/api/results?${params}`)
      .then(res => res.json())
      .then(data => {
        setResultsData(data.data || []);
        setTotalPages(data.totalPages || 1);
        setIsLoadingResults(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoadingResults(false);
      });
  }, [debouncedSearch, branch, batch, sort, page, academicStatus]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, branch, batch, sort, academicStatus]);

  const handleReset = () => {
    setSearchQuery('');
    setBranch('All');
    setAcademicStatus('All');
    setSort('rank_asc');
    setPage(1);
  };

  const handleBranchSelect = (selected: string) => {
    if (selected === 'All') {
      setBranch('All');
    } else {
      router.push(`/branch/${selected}?batch=${batch}`);
    }
  };

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBranch = () => {
    branchSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (branchSelectorRef.current) {
      // Flash highlight class
      branchSelectorRef.current.classList.add('ring-2', 'ring-blue-500', 'dark:ring-cyan-400', 'ring-offset-4', 'dark:ring-offset-slate-900', 'transition-all', 'duration-300');
      setTimeout(() => {
        branchSelectorRef.current?.classList.remove('ring-2', 'ring-blue-500', 'dark:ring-cyan-400', 'ring-offset-4', 'dark:ring-offset-slate-900');
      }, 1500);
    }
  };

  const branches = Object.keys(kpiData.stats?.branchDistribution || {}).sort();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">

      <div className="md:hidden w-full px-4 pt-4 pb-0 flex justify-center">
        <Suspense fallback={<div className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />}>
          <BatchSelector isHeader={false} />
        </Suspense>
      </div>

      <LandingHero 
        onScrollToDashboard={scrollToDashboard}
        onScrollToBranch={scrollToBranch}
        topper={kpiData.overallTopper}
      />
      <StatsStrip totalStudents={kpiData.stats?.totalStudents || 0} />
      <FeaturesSection />


      <main ref={dashboardRef} className="container mx-auto px-4 sm:px-6 py-16 scroll-mt-12" id="dashboard">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white">University Analytics Engine</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Dive into the raw data. Search for specific students, analyze branch performance, and view ranking distributions across DTU.
          </p>
        </div>

        {batch === '2029' ? (
          <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 border border-indigo-100 dark:border-slate-800 rounded-3xl p-10 sm:p-16 text-center shadow-2xl max-w-4xl mx-auto my-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Clock className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Data Arriving Soon</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                The results for the Class of 2029 are currently being processed and verified. We are preparing to present this data in a much more professional, intuitive, and visually stunning way. Stay tuned!
              </p>
              <div className="mt-8 flex gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">Processing</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">Validating</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div ref={branchSelectorRef} className="mb-8 rounded-xl transition-all duration-300">
              <BranchSelector 
                selectedBranch={branch}
                onSelect={handleBranchSelect}
                className=""
                branches={STRICT_BRANCHES}
              />
            </div>

            <KPICards 
              overallTopper={kpiData.overallTopper} 
              branchTopper={kpiData.branchTopper}
              mostImproved={kpiData.mostImproved}
            />

            <Analytics 
              branchDistribution={kpiData.stats?.branchDistribution || {}} 
              branchAverages={kpiData.stats?.branchAverages || []} 
            />

            <SearchAndFilter 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              branch={branch}
              setBranch={setBranch}
              academicStatus={academicStatus}
              setAcademicStatus={setAcademicStatus}
              sort={sort}
              setSort={setSort}
              onReset={handleReset}
              branches={branches}
            />

            <ResultsTable 
              data={resultsData}
              isLoading={isLoadingResults}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              onRowClick={(student) => setSelectedStudent(student)}
              sort={sort}
              setSort={setSort}
            />
          </>
        )}
      </main>

      <TopRecruiters />

      <Footer />

      <StudentModal 
        student={selectedStudent} 
        open={!!selectedStudent} 
        onOpenChange={(open) => !open && setSelectedStudent(null)} 
      />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex items-center justify-center"><div className="w-16 h-16 border-4 border-slate-300 dark:border-slate-800 border-t-blue-500 rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
