"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle, BookOpen } from "lucide-react";

export function ReappearBranchStats({ branch }: { branch: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/reappear?branch=${branch}`)
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, [branch]);

  if (!data || !data.stats || data.stats.totalStudents === 0) return null;

  const { stats, mostFailedSubjects } = data;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 transition-all duration-300 h-full flex flex-col gap-3"
    >
      <div className="flex items-center justify-between mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-6 bg-gradient-to-b from-red-400 to-orange-400 rounded-full" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Academic Health <span className="text-slate-400 dark:text-slate-500 font-medium text-sm ml-2">Backlogs</span>
          </h3>
        </div>
        <ShieldAlert className="w-5 h-5 text-red-500" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 dark:bg-[#0F172A]/60 rounded-[10px] p-2.5 flex flex-col justify-center border border-slate-100 dark:border-slate-800/60 transition-all duration-300">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">Backlog Rate</div>
          <div className="text-[17px] font-bold text-red-600 dark:text-red-400 leading-none">
            {stats.overallBacklogRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-[#0F172A]/60 rounded-[10px] p-2.5 flex flex-col justify-center border border-slate-100 dark:border-slate-800/60 transition-all duration-300">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">Cleared Students</div>
          <div className="text-[17px] font-bold text-emerald-600 dark:text-emerald-400 leading-none flex items-center gap-1">
            {stats.clearedStudents} <CheckCircle className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#0F172A]/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/60 flex-grow">
        <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3 text-orange-500" />
          Top Failed Subjects
        </div>
        {mostFailedSubjects && mostFailedSubjects.length > 0 ? (
          <ul className="space-y-1.5">
            {mostFailedSubjects.slice(0, 3).map((sub: any) => (
              <li key={sub.code} className="flex justify-between items-center text-[11px]">
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{sub.code}</span>
                <span className="text-red-500 font-semibold">{sub.count} fails</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[11px] text-slate-500 text-center py-2">No failures recorded.</div>
        )}
      </div>
    </motion.div>
  );
}
