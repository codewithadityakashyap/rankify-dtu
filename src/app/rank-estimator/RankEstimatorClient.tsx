'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, TrendingUp, Search, User, GraduationCap, ChevronDown, CheckCircle2 } from 'lucide-react';
import { BatchSelector } from '@/components/dark-glass/BatchSelector';
import { useSearchParams } from 'next/navigation';

export function RankEstimatorClient() {
  const searchParams = useSearchParams();
  const batch = searchParams?.get('batch') || '2027';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ overallCgpas: number[], branchCgpas: Record<string, number[]> } | null>(null);
  
  const [cgpaInput, setCgpaInput] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('CO');
  
  const [result, setResult] = useState<{ 
    overallRank: number; 
    overallTotal: number;
    branchRank: number;
    branchTotal: number;
    percentile: number;
  } | null>(null);

  useEffect(() => {
    async function fetchDistributions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/rank-estimator?batch=${batch}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error('Failed to fetch rank data', e);
      } finally {
        setLoading(false);
      }
    }
    fetchDistributions();
  }, [batch]);

  useEffect(() => {
    if (!data || !cgpaInput) {
      setResult(null);
      return;
    }
    
    const cgpa = parseFloat(cgpaInput);
    if (isNaN(cgpa) || cgpa <= 0 || cgpa > 10) {
      setResult(null);
      return;
    }

    // Binary search could be used here since it's sorted descending, 
    // but finding the first index where val <= cgpa is simple enough
    const getRank = (arr: number[], target: number) => {
      let rank = 1;
      for (const val of arr) {
        if (val <= target) break;
        rank++;
      }
      return rank;
    };

    const overallTotal = data.overallCgpas.length;
    const branchArr = data.branchCgpas[selectedBranch] || [];
    const branchTotal = branchArr.length;

    if (overallTotal === 0) return;

    const overallRank = getRank(data.overallCgpas, cgpa);
    const branchRank = branchTotal > 0 ? getRank(branchArr, cgpa) : 0;
    
    // Percentile = (Number of people behind you / Total people) * 100
    // People ahead of you = (overallRank - 1)
    // People behind you (or equal) = overallTotal - (overallRank - 1)
    // Using standard percentile formula:
    const percentile = ((overallTotal - overallRank) / overallTotal) * 100;

    setResult({
      overallRank,
      overallTotal,
      branchRank,
      branchTotal,
      percentile
    });
  }, [cgpaInput, selectedBranch, data]);

  const branches = data ? Object.keys(data.branchCgpas).sort() : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Rank <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Estimator</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Enter your CGPA to see exactly where you stand among your peers in the {batch} batch. 
            Real-time percentiles based on actual university result data.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <BatchSelector isHeader={false} />
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Input Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 z-0"></div>
              
              <div className="relative z-10 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" /> Current CGPA
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="e.g. 8.45"
                      value={cgpaInput}
                      onChange={(e) => setCgpaInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 pl-11 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-medium text-lg"
                    />
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" /> Your Branch
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      disabled={loading || branches.length === 0}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-medium"
                    >
                      {loading ? (
                        <option>Loading branches...</option>
                      ) : (
                        branches.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex gap-3 text-sm text-blue-800 dark:text-blue-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-500" />
              <p>Rankings are estimated based on available result data. Small discrepancies may exist if some results are withheld by the university.</p>
            </div>
          </div>

          {/* Results Section */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="h-full min-h-[300px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium">Crunching batch data...</p>
                </div>
              </div>
            ) : !result ? (
              <div className="h-full min-h-[300px] flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to see your rank?</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your CGPA and select your branch to instantly see your estimated rank and percentile.</p>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 h-full flex flex-col"
              >
                {/* Percentile Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-950 dark:to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex-1 flex flex-col justify-center">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                  
                  <div className="relative z-10 text-center">
                    <p className="text-blue-200 font-medium tracking-wider uppercase text-sm mb-2">Overall Percentile</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl sm:text-7xl font-black tracking-tight">{result.percentile.toFixed(1)}</span>
                      <span className="text-2xl font-bold text-blue-300">%ile</span>
                    </div>
                    <p className="text-slate-300 text-sm mt-4">
                      You are ahead of <strong className="text-white">{(result.overallTotal - result.overallRank).toLocaleString()}</strong> students in your batch!
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Branch Rank */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-3">
                      <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Branch Rank</p>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      #{result.branchRank.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">out of {result.branchTotal.toLocaleString()} in {selectedBranch}</p>
                  </div>

                  {/* Overall Rank */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Rank</p>
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      #{result.overallRank.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">out of {result.overallTotal.toLocaleString()} in {batch}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
