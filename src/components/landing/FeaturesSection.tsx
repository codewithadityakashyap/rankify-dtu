"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, GitCompare } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Rank Intelligence",
      description: "See exactly where you truly stand among your peers.",
      icon: <Target className="w-5 h-5 text-blue-500 dark:text-cyan-400" />,
      bg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400",
      border: "border-blue-100 dark:border-blue-500/20"
    },
    {
      title: "Performance Tracking",
      description: "Monitor your semester-wise academic growth instantly.",
      icon: <TrendingUp className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      bg: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-100 dark:border-indigo-500/20"
    },
    {
      title: "Branch Comparison",
      description: "Compare averages and trends directly across departments.",
      icon: <GitCompare className="w-5 h-5 text-purple-500 dark:text-purple-400" />,
      bg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      border: "border-purple-100 dark:border-purple-500/20"
    }
  ];

  return (
    <section className="py-12 bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          {/* Header block shoved to left to save vertical space, or keep it short on top */}
          <div className="lg:w-1/3 text-center lg:text-left">
            <h2 className="text-[11px] font-bold tracking-widest text-blue-600 dark:text-cyan-400 uppercase mb-2">
              Core Mechanics
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Analyze Results.
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Stop guessing. Get crystal-clear visibility into your academic standing.
            </p>
          </div>

          <div className="lg:w-2/3 grid sm:grid-cols-3 gap-4 w-full">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
                className={`group p-4 lg:p-5 flex flex-col sm:flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-3 rounded-2xl bg-white dark:bg-[#1E293B]/60 border ${feature.border} shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${feature.bg}`}>
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-0.5 mt-1 lg:mt-0 leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[13px] leading-snug">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
