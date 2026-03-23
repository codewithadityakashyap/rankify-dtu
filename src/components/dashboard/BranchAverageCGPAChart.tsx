"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export interface BranchAverage {
  branch: string;
  averageCgpa: number;
}

interface BranchAverageCGPAChartProps {
  data: BranchAverage[];
}

export function BranchAverageCGPAChart({ data }: BranchAverageCGPAChartProps) {
  if (!data || data.length === 0) return null;

  // Enhance the highest performing branch by identifying max CGPA
  const maxCgpa = Math.max(...data.map(d => d.averageCgpa));
  const topBranch = data.find(d => d.averageCgpa === maxCgpa)?.branch || '';

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl">Average CGPA by Branch</CardTitle>
            <CardDescription>
              Top performing branch: <span className="font-semibold text-primary">{topBranch} 🎯</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="barGradientTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="branch" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#64748b'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#64748b'}}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip 
                cursor={{fill: 'rgba(37, 99, 235, 0.05)'}}
                contentStyle={{ 
                  borderRadius: '10px', 
                  border: '1px solid hsl(var(--border))', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'hsl(var(--popover))',
                  color: 'hsl(var(--popover-foreground))',
                  padding: '12px'
                }}
                itemStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 600 }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                formatter={(value: any) => {
                  if (typeof value === 'number') return [`${value.toFixed(2)} CGPA`, 'Average'];
                  return [`${value} CGPA`, 'Average'];
                }}
                labelFormatter={(label) => `Branch: ${label}`}
              />
              <Bar 
                dataKey="averageCgpa" 
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.branch === topBranch ? "url(#barGradientTop)" : "url(#barGradient)"} 
                    className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
