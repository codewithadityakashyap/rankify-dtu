"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { CGPACell } from "./CGPACell";
import { RankBadge } from "./RankBadge";

export function Heatmap({ data }: { data: any[] }) {
  const [query, setQuery] = useState('');

  if (!data?.length) return null;

  // Determine semesters dynamically
  let maxSems = 1;
  data.forEach(s => {
    Object.keys(s).forEach(k => {
      if (k.startsWith('sem')) {
        const n = parseInt(k.replace('sem', ''));
        if (n > maxSems) maxSems = n;
      }
    });
  });

  const semesters = useMemo(
    () => Array.from({ length: maxSems }, (_, i) => `sem${i + 1}`),
    [maxSems]
  );

  // Tie-aware rank by CGPA
  const rankedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => (b.cgpa ?? 0) - (a.cgpa ?? 0));
    let rank = 1;
    return sorted.map((s, idx) => {
      if (idx > 0 && s.cgpa !== sorted[idx - 1].cgpa) {
        rank = idx + 1;
      }
      return { ...s, branchRank: rank };
    });
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rankedData;
    return rankedData.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.rollNumber?.toString().toLowerCase().includes(q)
    );
  }, [query, rankedData]);

  const maxCgpa = useMemo(() => Math.max(...data.map(s => s.cgpa ?? 0)), [data]);

  // SGPA cell coloring — adapts to theme via class
  const getSgpaStyle = (val: number | undefined) => {
    if (!val) return "bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/50 text-slate-400 dark:text-slate-600";
    if (val >= 9.5) return "bg-cyan-100 dark:bg-cyan-400/90 text-cyan-700 dark:text-slate-900 border-cyan-300 dark:border-cyan-300 font-bold shadow-[0_0_8px_rgba(34,211,238,0.3)]";
    if (val >= 8.5) return "bg-indigo-100 dark:bg-indigo-500/80 text-indigo-700 dark:text-white border-indigo-300 dark:border-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.2)]";
    if (val >= 7.5) return "bg-slate-200 dark:bg-slate-600/70 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-500";
    return "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30";
  };

  return (
    <div
      className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 overflow-hidden w-full relative flex flex-col transition-colors duration-300"
      style={{ maxHeight: "75vh" }}
    >
      {/* Background glow — dark only */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-400/5 pointer-events-none dark:block hidden" />

      {/* Title + Search row */}
      <div className="flex items-center gap-3 mb-5 shrink-0 flex-wrap z-10">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 flex-1">
          <span className="w-2 h-7 bg-gradient-to-b from-cyan-500 dark:from-cyan-400 to-indigo-500 rounded-full" />
          SGPA Intensity Matrix
          <span className="text-xs font-normal text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 bg-slate-50 dark:bg-slate-900/40 ml-1">
            {filtered.length} / {data.length} students
          </span>
        </h3>

        {/* Search bar */}
        <div className="relative w-full sm:w-68">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or roll no…"
            className="w-full bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-[#E2E8F0] placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-400 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-400/30 dark:focus:ring-cyan-400/30"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table area */}
      <div className="flex-1 overflow-auto rounded-xl" style={{ minHeight: 0 }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400 dark:text-slate-500">
            <Search className="w-8 h-8 opacity-30" />
            <p className="text-sm">No students match <span className="text-blue-500 dark:text-cyan-400">"{query}"</span></p>
          </div>
        ) : (
          <table
            className="w-full border-separate border-spacing-x-1 border-spacing-y-1"
            style={{ minWidth: `${340 + maxSems * 78 + 130}px` }}
          >
            <thead className="sticky top-0 z-30">
              <tr>
                <th
                  className="text-center text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wide px-2 py-2.5 bg-slate-100/95 dark:bg-[#0F172A]/95 backdrop-blur-md rounded-l-lg"
                  style={{ minWidth: "70px" }}
                >
                  Rank
                </th>
                <th
                  className="text-left text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wide px-2 py-2.5 bg-slate-100/95 dark:bg-[#0F172A]/95 backdrop-blur-md"
                  style={{ minWidth: "120px" }}
                >
                  Roll No.
                </th>
                <th
                  className="text-left text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wide px-2 py-2.5 bg-slate-100/95 dark:bg-[#0F172A]/95 backdrop-blur-md"
                  style={{ minWidth: "220px" }}
                >
                  Student Name
                </th>
                {semesters.map((sem, i) => (
                  <th
                    key={sem}
                    className="text-center text-slate-500 dark:text-slate-400 text-xs font-semibold py-2.5 bg-slate-100/95 dark:bg-[#0F172A]/95 backdrop-blur-md"
                    style={{ minWidth: "72px" }}
                  >
                    Sem {i + 1}
                  </th>
                ))}
                <th
                  className="sticky right-0 z-40 text-center py-2.5 bg-slate-100/95 dark:bg-[#0F172A]/95 backdrop-blur-md rounded-r-lg"
                  style={{ minWidth: "120px" }}
                >
                  <span className="text-xs font-bold tracking-widest text-blue-600 dark:text-cyan-400 uppercase border-b border-blue-400/40 dark:border-cyan-400/40 pb-0.5">
                    Agg. CGPA
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((student, idx) => {
                const isTopByGlobal = student.cgpa >= maxCgpa;
                return (
                  <motion.tr
                    key={student.rollNumber + idx}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(idx * 0.008, 0.4), duration: 0.25 }}
                    className="group"
                  >
                    <td className="py-0.5 px-1 rounded-l-lg text-center">
                      <RankBadge rank={student.branchRank} rowIndex={idx} />
                    </td>

                    <td className="py-0.5 pr-2 pl-1">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 text-[11px] font-semibold tracking-widest text-slate-500 dark:text-slate-400 font-mono group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all duration-200 cursor-default select-all"
                        title="Click to select roll number"
                      >
                        {student.rollNumber || '—'}
                      </span>
                    </td>

                    <td className="px-2 py-0.5">
                      <div
                        title={student.name}
                        className={`text-sm font-medium break-words line-clamp-2 leading-snug transition-colors duration-200 ${
                          student.branchRank <= 3
                            ? 'text-amber-600 dark:text-amber-200'
                            : 'text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400'
                        }`}
                      >
                        {student.name}
                      </div>
                    </td>

                    {semesters.map(sem => {
                      const val = student[sem];
                      return (
                        <td key={sem} className="py-0.5 px-0.5">
                          <div
                            title={`Sem ${sem.replace("sem", "")} SGPA: ${val ? val.toFixed(2) : "N/A"}`}
                            className={`flex items-center justify-center h-9 rounded-lg border text-xs transition-all duration-300 group-hover:brightness-105 ${getSgpaStyle(val)}`}
                          >
                            {val ? val.toFixed(2) : "—"}
                          </div>
                        </td>
                      );
                    })}

                    <td
                      className="sticky right-0 py-0.5 pl-3 rounded-r-lg"
                      style={{ background: "linear-gradient(to right, transparent, var(--heatmap-fade, #F8FAFC) 18%)" }}
                    >
                      <div className="absolute left-0 top-1 bottom-1 w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 dark:via-cyan-500/30 to-transparent" />
                      <CGPACell value={student.cgpa} isTop={isTopByGlobal} rowIndex={idx} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
