"use client";

import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';

export function DistributionChart({ data }: { data: any[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const tickColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = isDark ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = isDark ? '#334155' : '#E2E8F0';
  const tooltipText = isDark ? '#E2E8F0' : '#0F172A';
  const tooltipItem = isDark ? '#22D3EE' : '#2563EB';

  if (!data?.length) return null;

  return (
    <div className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 transition-all duration-300 h-full flex flex-col group hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 tracking-tight">
        <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
        CGPA Distribution
      </h3>
      <div className="flex-grow w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 25, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="distGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 500 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '10px',
                color: tooltipText,
                padding: '8px 12px',
                boxShadow: isDark ? '0 8px 25px rgba(34,211,238,0.15)' : '0 8px 25px rgba(0,0,0,0.1)',
              }}
              itemStyle={{ color: tooltipItem, fontWeight: 'bold' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1500} barSize={48}>
              <LabelList dataKey="count" position="top" fill={tickColor} fontSize={12} fontWeight="bold" dy={-6} />
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill="url(#distGradient)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
