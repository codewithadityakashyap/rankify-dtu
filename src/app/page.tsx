'use client';

import { useState, useEffect } from 'react';
import { KPICards } from '@/components/dashboard/KPICards';
import { SearchAndFilter } from '@/components/dashboard/SearchAndFilter';
import { ResultsTable } from '@/components/dashboard/ResultsTable';
import { StudentModal } from '@/components/dashboard/StudentModal';
import { Analytics } from '@/components/dashboard/Analytics';
import { ModeToggle } from '@/components/ModeToggle';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { BranchSelector, STRICT_BRANCHES } from '@/components/BranchSelector';

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

export default function Dashboard() {
  const router = useRouter();
  
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
  const [sort, setSort] = useState('rank_asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Fetch KPI
  useEffect(() => {
    fetch(`/api/kpi?branch=${branch}`)
      .then(res => res.json())
      .then(data => setKpiData(data))
      .catch(console.error);
  }, [branch]);

  // Fetch Results
  useEffect(() => {
    setIsLoadingResults(true);
    const params = new URLSearchParams({
      q: debouncedSearch,
      branch,
      sort,
      page: page.toString(),
      limit: '15'
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
  }, [debouncedSearch, branch, sort, page]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, branch, sort]);

  const handleReset = () => {
    setSearchQuery('');
    setBranch('All');
    setSort('rank_asc');
    setPage(1);
  };

  const handleBranchSelect = (selected: string) => {
    if (selected === 'All') {
      setBranch('All');
    } else {
      router.push(`/branch/${selected}`);
    }
  };

  const branches = Object.keys(kpiData.stats?.branchDistribution || {}).sort();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="bg-white dark:bg-slate-900 border-b shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Rankify DTU Logo" 
              className="w-10 h-10 object-contain rounded-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center font-bold text-xl">
              R
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Rankify <span className="text-primary font-light">DTU</span>
            </h1>
          </div>

          {/* Right side — premium batch badge + theme toggle */}
          <div className="flex items-center gap-3">
            {/* Premium "2027 Batch Results" badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 dark:bg-primary/10 dark:border-primary/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-primary/90 dark:text-primary whitespace-nowrap">
                2027 Batch Results
              </span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Student Dashboard</h2>
          <p className="text-slate-500 max-w-2xl">
            Explore academic performance, search for specific students, and view ranking distributions across the university.
          </p>
        </div>

        <BranchSelector 
          selectedBranch={branch}
          onSelect={handleBranchSelect}
          className="mb-8"
          branches={STRICT_BRANCHES}
        />

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
      </main>

      <Footer />

      <StudentModal 
        student={selectedStudent} 
        open={!!selectedStudent} 
        onOpenChange={(open) => !open && setSelectedStudent(null)} 
      />
    </div>
  );
}
