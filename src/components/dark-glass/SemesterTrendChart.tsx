"use client";

import { useTheme } from "next-themes";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function SemesterTrendChart({ data }: { data: any[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const tickColor = isDark ? '#94A3B8' : '#64748B';
  const tooltipBg = isDark ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = isDark ? '#334155' : '#E2E8F0';
  const tooltipText = isDark ? '#E2E8F0' : '#0F172A';
  const dotFill = isDark ? '#0F172A' : '#FFFFFF';
  const dotStroke = isDark ? '#22D3EE' : '#6366F1';

  if (!data?.length) return null;

  return (
    <div className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 transition-colors duration-300">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-cyan-500 dark:bg-cyan-400 rounded-full" />
        Semester Trend (Average CGPA)
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} dy={10} />
            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '12px',
                color: tooltipText,
                boxShadow: isDark ? '0 0 20px rgba(99,102,241,0.15)' : '0 4px 20px rgba(0,0,0,0.08)',
              }}
              itemStyle={{ color: tooltipText, fontWeight: 'bold' }}
              formatter={(val: any) => {
                if (typeof val === 'number') return [val.toFixed(2), "Avg CGPA"];
                return [val, "Avg CGPA"];
              }}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="url(#lineGrad)"
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2, fill: dotFill, stroke: dotStroke }}
              activeDot={{ r: 6, fill: dotStroke, stroke: dotFill, strokeWidth: 2 }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
