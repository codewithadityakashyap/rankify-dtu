'use client';

import { useState, useEffect } from 'react';
import { KPICards } from '@/components/dashboard/KPICards';
import { SearchAndFilter } from '@/components/dashboard/SearchAndFilter';
import { ResultsTable } from '@/components/dashboard/ResultsTable';
import { StudentModal } from '@/components/dashboard/StudentModal';
import { Analytics } from '@/components/dashboard/Analytics';

import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';
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

export default function Dashboard() {
  const router = useRouter();
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
