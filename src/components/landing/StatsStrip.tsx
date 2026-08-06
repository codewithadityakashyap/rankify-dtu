"use client";

import { motion } from "framer-motion";

interface StatsStripProps {
  totalStudents: number;
}

export function StatsStrip({ totalStudents }: StatsStripProps) {
  const stats = [
    { label: "Total Students Tracked", value: totalStudents > 0 ? `${totalStudents.toLocaleString()}` : "2,500+" },
    { label: "University Avg CGPA", value: "7.84" },
    { label: "Top Performing Branch", value: "IT / COE" },
    { label: "Placement Rate (2026)", value: "45.1%" },
  ];

  return (
    <div className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 py-6 sm:py-0">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center justify-center p-4 sm:py-8 sm:px-6 text-center border-slate-200 dark:border-slate-800
                ${idx === 0 ? 'border-r border-b md:border-b-0' : ''}
                ${idx === 1 ? 'border-b md:border-b-0 md:border-r' : ''}
                ${idx === 2 ? 'border-r' : ''}
              `}
            >
              <div className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1 sm:mb-2">
                {stat.label}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
