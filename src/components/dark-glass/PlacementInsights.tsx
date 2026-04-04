"use client";

import { useTheme } from "next-themes";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const BRANCH_PLACEMENT_DATA: Record<string, any> = {
  CO: { count: 333, avg: 21.82, median: 18.00, max: 82.00, placed: 63.43, roles: { core: 10, nonTech: 46, tech: 276 } },
  IT: { count: 113, avg: 20.36, median: 18.00, max: 82.00, placed: 59.47, roles: { core: 3, nonTech: 16, tech: 94 } },
  MC: { count: 90, avg: 18.47, median: 15.50, max: 56.00, placed: 48.65, roles: { core: 0, nonTech: 24, tech: 66 } },
  SE: { count: 118, avg: 17.36, median: 15.00, max: 56.00, placed: 59.30, roles: { core: 0, nonTech: 28, tech: 90 } },
  EC: { count: 123, avg: 16.18, median: 13.00, max: 57.00, placed: 49.20, roles: { core: 30, nonTech: 40, tech: 53 } },
  EP: { count: 31, avg: 15.94, median: 12.00, max: 56.00, placed: 27.43, roles: { core: 0, nonTech: 20, tech: 10 } },
  EE: { count: 109, avg: 14.22, median: 11.78, max: 51.00, placed: 36.70, roles: { core: 28, nonTech: 45, tech: 34 } },
  EN: { count: 10, avg: 13.76, median: 13.50, max: 21.00, placed: 23.26, roles: { core: 2, nonTech: 5, tech: 3 } },
  PE: { count: 25, avg: 12.54, median: 11.18, max: 32.58, placed: 34.72, roles: { core: 5, nonTech: 11, tech: 9 } },
  BT: { count: 15, avg: 12.37, median: 11.50, max: 23.50, placed: 24.59, roles: { core: 0, nonTech: 13, tech: 2 } },
  ME: { count: 111, avg: 12.35, median: 10.75, max: 23.59, placed: 37.76, roles: { core: 44, nonTech: 58, tech: 8 } },
  CH: { count: 15, avg: 12.28, median: 13.49, max: 17.00, placed: 20.55, roles: { core: 5, nonTech: 8, tech: 2 } },
  AE: { count: 21, avg: 11.40, median: 10.00, max: 23.50, placed: 28.38, roles: { core: 7, nonTech: 11, tech: 3 } },
  CE: { count: 23, avg: 10.64, median: 8.50, max: 23.50, placed: 14.94, roles: { core: 8, nonTech: 13, tech: 1 } },
  MISC: { count: 66, avg: 12.34, median: 10.00, max: 40.00, placed: null, roles: { core: 16, nonTech: 23, tech: 22 } }
};

export function PlacementInsights({ branch }: { branch: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Normalize DTU branch aliases
  const normalizeBranch = (b: string) => {
    const uppercaseBranch = b.toUpperCase();
    if (['CS', 'CSE', 'COE'].includes(uppercaseBranch)) return 'CO';
    if (uppercaseBranch === 'MCE') return 'MC';
    if (uppercaseBranch === 'PCT') return 'PE';
    return uppercaseBranch;
  };

  const normalizedBranch = normalizeBranch(branch);
  const rawData = BRANCH_PLACEMENT_DATA[normalizedBranch];

  if (!rawData && normalizedBranch !== 'MISC') {
    return null; // Fallback for unseen branches not in map
  }

  // If we couldn't find exact branch, fallback to MISC
  const data = rawData || BRANCH_PLACEMENT_DATA['MISC'];

  const roleData = [
    { name: 'Core', value: data.roles.core },
    { name: 'Non-Tech', value: data.roles.nonTech },
    { name: 'Tech', value: data.roles.tech }
  ].filter(r => r.value > 0);

  const COLORS = {
    Core: isDark ? '#A78BFA' : '#8B5CF6',
    'Non-Tech': isDark ? '#F472B6' : '#EC4899',
    Tech: isDark ? '#22D3EE' : '#06B6D4',
  };

  const generateInsights = () => {
    const insights = [];
    const { core, nonTech, tech } = data.roles;

    // Role dominance
    if (tech > core && tech > nonTech) {
      insights.push(`Tech roles strongly dominate placements in ${branch}`);
    } else if (core > tech && core > nonTech) {
      insights.push(`Core roles lead the placements for ${branch} students`);
    } else if (nonTech > tech && nonTech > core) {
      insights.push(`Non-Tech roles are the most popular career choice here`);
    }

    // High package
    if (data.max) {
      insights.push(`Highest package reached a stellar ₹${data.max.toFixed(2)} LPA`);
    }

    // Placement rate
    if (data.placed) {
      insights.push(`Currently maintaining a placement rate of ${data.placed.toFixed(2)}%`);
    } else {
      insights.push(`Placement rate data is currently unresolved for this branch`);
    }

    // Core vs Non-Tech
    if (core < nonTech && core > 0) {
      insights.push(`Core opportunities are limited compared to Non-Tech roles`);
    } else if (core === 0) {
      insights.push(`No core placements recorded; mostly IT / Analyst roles`);
    }

    return insights;
  };

  const insights = generateInsights();

  // LPA Spread Calculation (0 to Max)
  const avgPercent = (data.avg / data.max) * 100;
  const medianPercent = (data.median / data.max) * 100;

  // Calculate approximate total batch strength using placed count and percentage
  const totalStrength = data.placed ? Math.round((data.count * 100) / data.placed) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 transition-all duration-300 h-full flex flex-col gap-3"
    >
      <div className="flex items-center justify-between mb-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-6 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-full" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Placement Insights <span className="text-slate-400 dark:text-slate-500 font-medium text-sm ml-2">2022 Batch</span>
          </h3>
        </div>

        {/* Blinking Live Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Ongoing
          </span>
        </div>
      </div>

      {/* 4 Hero Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 dark:bg-[#0F172A]/60 rounded-[10px] p-2.5 flex flex-col justify-center border border-slate-100 dark:border-slate-800/60 transition-all duration-300">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">Avg LPA</div>
          <div className="text-[17px] font-bold text-slate-800 dark:text-slate-100 leading-none">{data.avg.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#0F172A]/60 rounded-[10px] p-2.5 flex flex-col justify-center border border-slate-100 dark:border-slate-800/60 transition-all duration-300">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">Median</div>
          <div className="text-[17px] font-bold text-slate-800 dark:text-slate-100 leading-none">{data.median.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#0F172A]/60 rounded-[10px] p-2.5 flex flex-col justify-center border border-slate-100 dark:border-slate-800/60 transition-all duration-300">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">Max LPA</div>
          <div className="text-[17px] font-bold text-slate-800 dark:text-slate-100 leading-none">{data.max.toFixed(2)}</div>
        </div>
        <div className="bg-slate-50 dark:bg-[#0F172A]/60 rounded-[10px] p-2.5 flex flex-col justify-center border border-slate-100 dark:border-slate-800/60 transition-all duration-300">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">% Placed</div>
          <div className="flex items-baseline gap-1.5">
            <div className="text-[17px] font-bold text-slate-800 dark:text-slate-100 leading-none">
              {data.placed ? `${data.placed.toFixed(1)}%` : 'N/A'}
            </div>
            {data.count > 0 && (
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                ({data.count}{totalStrength ? ` / ${totalStrength}` : ''}) Placed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LPA Spread Tracker */}
      <div className="bg-slate-50 dark:bg-[#0F172A]/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/60">
        <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-2 flex justify-between items-center">
          <span>Spread</span>
          <span className="text-[10px] font-medium text-slate-400">0 → {data.max}</span>
        </div>
        <div className="relative h-1.5 bg-slate-200 dark:bg-slate-800/80 rounded-full w-full overflow-visible">
          {/* Median Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-2.5 w-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] z-10"
            style={{ left: `${medianPercent}%` }}
          />
          {/* Average Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] z-20"
            style={{ left: `${avgPercent}%` }}
          />
          {/* Active Range Gradient */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-slate-400/20 to-cyan-400/40"
            style={{ width: `${avgPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400 px-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Median ({data.median})
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Avg ({data.avg})
          </div>
        </div>
      </div>

      {/* Role Distribution Donut */}
      <div className="bg-slate-50 dark:bg-[#0F172A]/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/60 pb-1 flex flex-col flex-grow items-center justify-center">
        <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-0 self-start">Roles</div>
        {roleData.length > 0 ? (
          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={52}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {roleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name as keyof typeof COLORS]}
                      className="hover:opacity-80 transition-opacity duration-300 outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#ffffff',
                    borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.2)',
                    color: isDark ? '#E2E8F0' : '#0F172A',
                    fontSize: '11px'
                  }}
                  itemStyle={{ color: isDark ? '#E2E8F0' : '#0F172A', fontWeight: 'bold', fontSize: '11px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={18}
                  iconType="circle"
                  iconSize={6}
                  formatter={(value) => <span className="text-slate-600 dark:text-slate-300 text-[10px] font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[120px] w-full flex items-center justify-center text-slate-400 text-[11px] font-medium">
            No data
          </div>
        )}
      </div>

      {/* Auto-Generated Insights */}
      <div className="bg-slate-50 dark:bg-[#0F172A]/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/60">
        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
          <span className="text-xs">✨</span> Insights
        </div>
        <ul className="space-y-1">
          {insights.slice(0, 3).map((insight, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.3 }}
              className="flex gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-tight items-start"
            >
              <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 shrink-0 opacity-80" />
              <span>{insight}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
