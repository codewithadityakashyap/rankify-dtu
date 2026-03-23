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

type TabType = 'overview' | 'risk' | 'leaderboard';

export function BranchDashboard({ branch }: { branch: string }) {
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-red-400">Error: {data.error}</h2>
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
    <div className="min-h-screen bg-[#0F172A] text-[#E2E8F0] selection:bg-cyan-500/30 font-sans">
      {/* Ambient glow orbs */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800/50 shadow-[0_4px_30px_rgb(0,0,0,0.5)]">
        <div className="w-full px-6 h-20 flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-5">
            <BackButton />
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <span>Home</span>
                <span className="text-slate-700">/</span>
                <span className="text-cyan-400 font-medium">{branch}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                {branch} <span className="text-cyan-400 font-light">Analytics Dashboard</span>
              </h1>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="hidden md:flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 shadow-inner gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-[0_0_18px_rgba(99,102,241,0.5)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="w-full max-w-[1800px] mx-auto px-6 py-8 relative z-10">

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

        {/* ── 3-column grid: Leaderboard | Charts | Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Left 2-column block */}
          <div className="lg:col-span-2 space-y-6">
            {/* Leaderboard */}
            {(activeTab === 'overview' || activeTab === 'leaderboard') && (
              <Leaderboard data={data?.leaderboard} />
            )}

            {/* Charts row */}
            {showCharts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DistributionChart data={data?.distribution} />
                <SemesterTrendChart data={data?.semTrend} />
              </div>
            )}
          </div>

          {/* Right sidebar */}
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

        {/* ── HEATMAP: FULL-WIDTH SECTION ── */}
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
              {/* Section label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase px-3">
                  Intensity Matrix
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              </div>

              {/* Full-width Heatmap — no container width limit here */}
              <Heatmap data={data.heatmapData} />
            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* Footer — same as homepage */}
      <Footer />
    </div>
  );
}
