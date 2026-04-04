"use client";

import { useTheme } from "next-themes";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const PLACEMENT_DATA = [
  { branch: "CO", count: 333, avg: 21.82, median: 18.00, max: 82.00, placed: 63.43 },
  { branch: "IT", count: 113, avg: 20.36, median: 18.00, max: 82.00, placed: 59.47 },
  { branch: "MC", count: 90, avg: 18.47, median: 15.50, max: 56.00, placed: 48.65 },
  { branch: "SE", count: 118, avg: 17.36, median: 15.00, max: 56.00, placed: 59.30 },
  { branch: "EC", count: 123, avg: 16.18, median: 13.00, max: 57.00, placed: 49.20 },
  { branch: "EP", count: 31, avg: 15.94, median: 12.00, max: 56.00, placed: 27.43 },
  { branch: "EE", count: 109, avg: 14.22, median: 11.78, max: 51.00, placed: 36.70 },
  { branch: "EN", count: 10, avg: 13.76, median: 13.50, max: 21.00, placed: 23.26 },
  { branch: "PE", count: 25, avg: 12.54, median: 11.18, max: 32.58, placed: 34.72 },
  { branch: "BT", count: 15, avg: 12.37, median: 11.50, max: 23.50, placed: 24.59 },
  { branch: "ME", count: 111, avg: 12.35, median: 10.75, max: 23.59, placed: 37.76 },
  { branch: "CH", count: 15, avg: 12.28, median: 13.49, max: 17.00, placed: 20.55 },
  { branch: "AE", count: 21, avg: 11.40, median: 10.00, max: 23.50, placed: 28.38 },
  { branch: "CE", count: 23, avg: 10.64, median: 8.50, max: 23.50, placed: 14.94 }
];

export function PlacementStatsChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const gridColor = isDark ? '#1E293B' : '#E2E8F0';
  const tickColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = isDark ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = isDark ? '#1E293B' : '#E2E8F0';
  const tooltipText = isDark ? '#E2E8F0' : '#0F172A';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="p-3 sm:p-4 rounded-xl border"
          style={{
            backgroundColor: isDark ? '#0F172ADC' : '#ffffffF0',
            borderColor: isDark ? '#334155' : '#E2E8F0',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            color: tooltipText
          }}
        >
          <div className="font-bold text-lg mb-2 pb-2 border-b border-slate-700/50 dark:border-slate-700">
            Branch: <span className="text-indigo-500 dark:text-cyan-400">{label}</span>
          </div>
          <div className="space-y-1 text-sm font-medium">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">Avg LPA:</span>
              <span>{data.avg.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">Median:</span>
              <span className="text-indigo-600 dark:text-[#38BDF8]">{data.median.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">Max:</span>
              <span className="text-slate-700 dark:text-slate-200">{data.max.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 pt-1 mt-1 border-t border-slate-700/50 dark:border-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400">% Placed:</span>
              <span className="font-bold">{data.placed.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative h-full flex flex-col justify-between p-5 sm:p-6">
      <div className="relative z-10 flex flex-col h-full w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-500 dark:bg-blue-400 rounded-full shrink-0" />
              Placement Statistics
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:dark:bg-emerald-500/10 ml-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none mt-[1px]">
                  Ongoing
                </span>
              </div>
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Average & Median LPA (2022 Batch)
            </p>
          </div>
          <div className="text-[13px] bg-slate-50 dark:bg-[#0F172A]/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap hidden sm:block">
            Top Branch: <span className="font-bold text-slate-900 dark:text-white">CO</span>
          </div>
        </div>

        <div className="h-[300px] w-full flex-grow mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={PLACEMENT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barPremiumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#3B82F6" : "#2563EB"} stopOpacity={1} />
                  <stop offset="100%" stopColor={isDark ? "#1E3A8A" : "#1E40AF"} stopOpacity={isDark ? 0.3 : 0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 500 }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} dx={-10} domain={[0, 'auto']} />

              <Tooltip cursor={{ fill: isDark ? 'rgba(34, 211, 238, 0.05)' : 'rgba(99, 102, 241, 0.05)' }} content={<CustomTooltip />} />

              <Bar
                yAxisId="left"
                dataKey="avg"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
                maxBarSize={32}
              >
                {PLACEMENT_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="url(#barPremiumGradient)"
                    className="hover:opacity-85 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Bar>

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="median"
                stroke={isDark ? "#94A3B8" : "#64748B"}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1.5, fill: isDark ? '#0F172A' : '#ffffff', stroke: isDark ? '#94A3B8' : '#64748B' }}
                activeDot={{ r: 5, fill: isDark ? '#E2E8F0' : '#0F172A', stroke: 'transparent' }}
                animationDuration={2000}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
