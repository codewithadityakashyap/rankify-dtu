"use client";

import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReappearCharts({ branchBacklogRate }: { branchBacklogRate: any[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Only take branches with data
  const chartData = branchBacklogRate.filter(b => b.totalBacklogs > 0).slice(0, 15);

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      <Card className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border-slate-200 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Branch-wise Backlog Rate</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">Percentage of students with active backlogs</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis 
                  dataKey="branch" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                  dx={-10}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }}
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#ffffff',
                    borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    borderRadius: '8px',
                    color: isDark ? '#E2E8F0' : '#0F172A',
                  }}
                  formatter={(val: number) => [`${val.toFixed(1)}%`, 'Backlog Rate']}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={isDark ? '#ef4444' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border-slate-200 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Total Backlogs per Branch</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">Absolute count of failed subjects</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis 
                  dataKey="branch" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }}
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#ffffff',
                    borderColor: isDark ? '#1E293B' : '#E2E8F0',
                    borderRadius: '8px',
                    color: isDark ? '#E2E8F0' : '#0F172A',
                  }}
                  formatter={(val: number) => [val, 'Total Backlogs']}
                />
                <Bar dataKey="totalBacklogs" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={isDark ? '#f97316' : '#fb923c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
