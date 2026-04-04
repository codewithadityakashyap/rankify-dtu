"use client";

import { useTheme } from "next-themes";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

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
    <div className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-md dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 transition-all duration-300 h-full flex flex-col group hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 tracking-tight">
        <span className="w-1.5 h-5 bg-cyan-500 dark:bg-cyan-400 rounded-full" />
        Semester Trend (Average CGPA)
      </h3>
      <div className="flex-grow w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 35, right: 30, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12, fontWeight: 500 }} dy={12} />
            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: '10px',
                color: tooltipText,
                padding: '8px 12px',
                boxShadow: isDark ? '0 8px 25px rgba(99,102,241,0.15)' : '0 8px 25px rgba(0,0,0,0.1)',
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
            >
              <LabelList 
                dataKey="average" 
                position="top" 
                fill={tickColor} 
                fontSize={12} 
                fontWeight="bold" 
                dy={-16} 
                formatter={(val: any) => typeof val === 'number' ? val.toFixed(2) : val}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
