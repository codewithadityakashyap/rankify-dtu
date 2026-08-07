"use client";

import { motion } from "framer-motion";

export function Leaderboard({ data }: { data: any[] }) {
  if (!data?.length) return null;

  const top10 = data.slice(0, 10);

  const getBadge = (cgpa: number) => {
    if (cgpa >= 9) return { label: "Elite 🏆", color: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30" };
    if (cgpa >= 8) return { label: "Pro 🔥", color: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30" };
    if (cgpa >= 7) return { label: "Avg ⚡", color: "bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-500/30" };
    return { label: "Risk ⚠️", color: "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30" };
  };

  return (
    <div className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 overflow-hidden relative transition-colors duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-cyan-500 dark:bg-cyan-400 rounded-full" />
        Gamified Leaderboard
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-[11px] sm:text-sm uppercase tracking-wider sm:normal-case sm:tracking-normal">
              <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium">Rank</th>
              <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium">Name</th>
              <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium hidden xs:table-cell">Branch</th>
              <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium">CGPA</th>
              <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium text-right sm:text-left">Badge</th>
            </tr>
          </thead>
          <tbody>
            {top10.map((student, idx) => {
              const badge = getBadge(parseFloat(student.cgpa));
              const isTop3 = idx < 3;
              return (
                <motion.tr
                  key={student.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isTop3 ? 'bg-indigo-50/50 dark:bg-indigo-500/[0.02]' : ''}`}
                >
                  <td className="py-2.5 sm:py-3.5 px-2 sm:px-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-[11px] sm:text-sm font-bold ${isTop3 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                      {student.rank}
                    </span>
                  </td>
                  <td className={`py-2.5 sm:py-3.5 px-2 sm:px-4 font-semibold sm:font-medium text-[12px] sm:text-[15px] max-w-[120px] sm:max-w-none truncate ${isTop3 ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {student.name}
                  </td>
                  <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 text-slate-500 dark:text-slate-400 text-[12px] sm:text-sm hidden xs:table-cell">{student.branch}</td>
                  <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 font-bold text-[13px] sm:text-[15px] text-slate-800 dark:text-slate-100">{parseFloat(student.cgpa).toFixed(2)}</td>
                  <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 text-right sm:text-left">
                    <span className={`whitespace-nowrap inline-flex items-center gap-0.5 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-xs font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
