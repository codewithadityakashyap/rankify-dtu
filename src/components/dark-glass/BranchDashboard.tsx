'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroCards } from '@/components/dark-glass/HeroCards';
import { Leaderboard } from '@/components/dark-glass/Leaderboard';
import { DistributionChart } from '@/components/dark-glass/DistributionChart';
import { SemesterTrendChart } from '@/components/dark-glass/SemesterTrendChart';
import { Heatmap } from '@/components/dark-glass/Heatmap';
import { DropAnalysis } from '@/components/dark-glass/DropAnalysis';
import { InsightPanel } from '@/components/dark-glass/InsightPanel';
import { BackButton } from '@/components/dark-glass/BackButton';
import { Footer } from '@/components/Footer';
import { PlacementInsights } from '@/components/dark-glass/PlacementInsights';

import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { STRICT_BRANCHES } from '@/components/BranchSelector';

type TabType = 'overview' | 'risk' | 'leaderboard';

export function BranchDashboard({ branch }: { branch: string }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/branch-dashboard?branch=${branch}`)
      .then(res => res.json())
      .then(d => { setData(d); setIsLoading(false); })
      .catch(err => { console.error(err); setIsLoading(false); });
  }, [branch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex items-center justify-center transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-slate-300 dark:border-slate-800 border-t-blue-500 dark:border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-white flex flex-col items-center justify-center gap-4 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-red-500 dark:text-red-400">Error: {data.error}</h2>
        <BackButton />
      </div>
    );
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: '📊 Branch Analysis' },
    { id: 'leaderboard', label: '🔥 Top Performers' },
    { id: 'risk', label: '⚠️ At Risk' },
  ];

  const showHeatmap = activeTab !== 'leaderboard';
  const showHero = activeTab !== 'risk';
  const showCharts = activeTab !== 'risk';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-[#E2E8F0] selection:bg-cyan-500/30 font-sans transition-colors duration-300">
      {/* Ambient glow orbs — visible in dark only */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none dark:opacity-100 opacity-0 transition-opacity duration-300" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] translate-x-1/2 translate-y-1/2 pointer-events-none dark:opacity-100 opacity-0 transition-opacity duration-300" />

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/50 shadow-sm dark:shadow-[0_4px_30px_rgb(0,0,0,0.5)] transition-colors duration-300">
        {/* Title row */}
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between max-w-[1800px] mx-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 sm:gap-4 min-w-0 hover:opacity-80 transition-opacity outline-none text-left">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white font-bold text-sm tracking-widest">
                {branch.substring(0, 3)}
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight truncate flex items-center gap-2">
                <span>{branch} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-indigo-400 font-medium">Analytics</span></span>
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
              </h1>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 max-h-[300px] overflow-y-auto">
              {STRICT_BRANCHES.filter(b => b !== 'All').map(b => (
                <DropdownMenuItem key={b} onClick={() => router.push(`/branch/${b}`)} className="cursor-pointer font-medium">
                  {b} Analytics
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop tab switcher + theme toggle */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.5)]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile tab switcher — scrollable pill row (Moved out of sticky header) */}
      <div className="md:hidden flex overflow-x-auto gap-2 px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/50 bg-transparent scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                : 'bg-slate-200 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main Content ── */}
      <main className="w-full max-w-[1800px] mx-auto px-3 sm:px-6 py-5 sm:py-8 relative z-10">

        {/* Hero KPI cards */}
        <AnimatePresence>
          {showHero && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <HeroCards
                topper={data?.hero?.topper}
                mostImproved={data?.hero?.mostImproved}
                mostConsistent={data?.hero?.mostConsistent}
                atRiskCount={data?.hero?.atRiskCount}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Top Section: Leaderboard + Insight/Drop Analysis ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            {(activeTab === 'overview' || activeTab === 'leaderboard') && (
              <Leaderboard data={data?.leaderboard} />
            )}
          </div>

          <div className="space-y-6">
            {activeTab !== 'leaderboard' && (
              <InsightPanel
                data={data?.leaderboard}
                kpi={{ ...data?.hero, totalStudents: data?.totalStudents, branch }}
              />
            )}
            {(activeTab === 'overview' || activeTab === 'risk') && (
              <DropAnalysis data={data?.dropAnalysis} />
            )}
          </div>
        </div>

        {/* ── Charts Row (Distribution, Trend, Placement) ── */}
        {showCharts && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8 items-stretch">
            <div className="w-full h-full xl:col-span-1">
              <DistributionChart data={data?.distribution} />
            </div>
            <div className="w-full h-full xl:col-span-1">
              <SemesterTrendChart data={data?.semTrend} />
            </div>
            {(activeTab === 'overview' || activeTab === 'leaderboard') && (
              <div className="w-full h-full xl:col-span-1">
                <PlacementInsights branch={branch} />
              </div>
            )}
            {(activeTab === 'overview' || activeTab === 'leaderboard') && (
              <div className="w-full h-full xl:col-span-1">

              </div>
            )}
          </div>
        )}

        {/* ── HEATMAP: FULL-WIDTH ── */}
        <AnimatePresence>
          {showHeatmap && data?.heatmapData?.length > 0 && (
            <motion.section
              key="heatmap"
              initial={{ opacity: 0, scaleY: 0.97, y: 16 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                <span className="text-xs font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-3">
                  Intensity Matrix
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
              </div>
              <Heatmap data={data.heatmapData} />
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
