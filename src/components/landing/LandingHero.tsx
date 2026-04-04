"use client";

import { motion } from "framer-motion";
import { ChevronDown, Trophy, ArrowRight, BarChart3 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";

interface LandingHeroProps {
  onScrollToDashboard: () => void;
  onScrollToBranch: () => void;
  topper: any | null;
}

// Helper to extract trend array from topper
const getTrendData = (topper: any) => {
  if (!topper) return [];
  const sems = Object.keys(topper).filter(k => k.startsWith('sem')).sort();
  if (sems.length === 0) return Array.from({length: 4}, (_, i) => ({ val: 9 + Math.random() })); // Fallback line if pure object
  return sems.map(s => ({ val: topper[s] }));
};

export function LandingHero({ onScrollToDashboard, onScrollToBranch, topper }: LandingHeroProps) {
  const trendData = getTrendData(topper);

  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#F8FAFC,#EEF2FF)] dark:bg-[linear-gradient(to_bottom,#0F172A,#0B1120)] -z-10" />
      
      {/* Optional ultra-subtle pattern/noise */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay pointer-events-none -z-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-start text-left max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 text-sm font-semibold mb-6 shadow-sm border border-blue-100 dark:border-blue-800/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 dark:bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 dark:bg-cyan-500"></span>
              </span>
              Live Data Intelligence
            </div>
            
            <h1 className="text-[2.75rem] leading-[1.1] sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              Understand Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500">Rank.</span> <br />
              Own Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-blue-400 dark:to-indigo-400">Performance.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
              Analyze your academic performance, track rankings, and compare across branches with absolute clarity.
            </p>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
              <button 
                onClick={onScrollToDashboard}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium transition-all duration-200 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <button 
                onClick={onScrollToBranch}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-all duration-200 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0"
              >
                <BarChart3 className="w-4 h-4 mr-1 text-slate-400 dark:text-slate-500" />
                <span>View Branch Insights</span>
              </button>
            </div>
          </motion.div>

          {/* Right Visual Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative lg:ml-auto w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Soft decorative glow behind the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 dark:bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative bg-white/70 dark:bg-[#1E293B]/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] p-6 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl leading-none" style={{ animation: "float 3s ease-in-out infinite" }}>👑</span>
                    <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest pl-0.5">Top Performer</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white truncate max-w-[200px]" title={topper?.name || "Loading..."}>
                    {topper?.name ? topper.name.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase()) : "University Topper"}
                  </h3>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {topper?.rollNumber || "Roll No"} • {topper?.branch || "Branch"}
                  </div>
                </div>
                <div className="flex shrink-0 w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 items-center justify-center border border-yellow-100 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-400 font-bold text-lg">
                  #1
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 mt-8">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Aggr. CGPA</div>
                  <div className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                    {topper?.cgpa ? parseFloat(topper.cgpa).toFixed(3) : "Wait."}
                  </div>
                </div>
                
                <div className="w-32 h-16 opacity-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData.length > 0 ? trendData : [{val: 9}, {val: 9.5}, {val: 9.8}]}>
                      <YAxis domain={['dataMin - 0.5', 'dataMax + 0.1']} hide />
                      <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke="#2563EB" 
                        strokeWidth={3} 
                        dot={false}
                        animationDuration={2000}
                        style={{ filter: "drop-shadow(0px 4px 6px rgba(37, 99, 235, 0.3))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Absolute positioned small pill */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute -bottom-5 -right-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 shadow-md backdrop-blur-md flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="pr-2">
                <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Current Leader</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Across DTU</div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(5deg); }
        }
      `}</style>
    </section>
  );
}
