"use client";

import { motion } from "framer-motion";

export function Leaderboard({ data }: { data: any[] }) {
  if (!data?.length) return null;

  const top10 = data.slice(0, 10);

  const getBadge = (cgpa: number) => {
    if (cgpa >= 9) return { label: "Elite 🏆", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" };
    if (cgpa >= 8) return { label: "Pro 🔥", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" };
    if (cgpa >= 7) return { label: "Avg ⚡", color: "bg-slate-500/20 text-slate-300 border-slate-500/30" };
    return { label: "Risk ⚠️", color: "bg-red-500/20 text-red-400 border-red-500/30" };
  };

  return (
    <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-cyan-400 rounded-full"></span>
        Gamified Leaderboard
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
              <th className="pb-3 px-4 font-medium">Rank</th>
              <th className="pb-3 px-4 font-medium">Name</th>
              <th className="pb-3 px-4 font-medium">Branch</th>
              <th className="pb-3 px-4 font-medium">CGPA</th>
              <th className="pb-3 px-4 font-medium">Badge</th>
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
                  className={`border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors ${isTop3 ? 'bg-indigo-500/[0.02]' : ''}`}
                >
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${isTop3 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-400'}`}>
                      {student.rank}
                    </span>
                  </td>
                  <td className={`py-4 px-4 font-medium ${isTop3 ? 'text-indigo-300' : 'text-slate-200'}`}>
                    {student.name}
                  </td>
                  <td className="py-4 px-4 text-slate-400">{student.branch}</td>
                  <td className="py-4 px-4 font-bold text-slate-100">{parseFloat(student.cgpa).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${badge.color}`}>
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
