"use client";

import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export function DropAnalysis({ data }: { data: any[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const xTickColor = isDark ? '#94A3B8' : '#64748B';
  const yTickColor = isDark ? '#E2E8F0' : '#0F172A';
  const tooltipBg = isDark ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = isDark ? '#7F1D1D' : '#FECACA';
  const tooltipLabel = isDark ? '#E2E8F0' : '#0F172A';
  const tooltipItem = isDark ? '#FCA5A5' : '#EF4444';

  if (!data?.length) return null;

  return (
    <div className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-red-100 dark:border-red-900/30 rounded-2xl shadow-md dark:shadow-[0_8px_30px_rgb(239,68,68,0.05)] p-5 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/50 dark:bg-red-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-red-500 rounded-full" />
        Highest SGPA Drops (Risk Analysis)
      </h3>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: xTickColor, fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: yTickColor, fontSize: 11 }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }}
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                color: tooltipLabel,
                boxShadow: isDark ? '0 0 20px rgba(239,68,68,0.15)' : '0 4px 20px rgba(0,0,0,0.08)',
              }}
              labelStyle={{ color: tooltipLabel, fontWeight: 600, marginBottom: 2 }}
              itemStyle={{ color: tooltipItem, fontWeight: 700 }}
              formatter={(val: any) => {
                if (typeof val === 'number') return [`-${val.toFixed(2)} SGPA`, "Drop Magnitude"];
                return [val, "Drop Magnitude"];
              }}
            />
            <Bar dataKey="drop" radius={[0, 4, 4, 0]} animationDuration={1500} barSize={20}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill="#EF4444" opacity={1 - (index * 0.05)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
