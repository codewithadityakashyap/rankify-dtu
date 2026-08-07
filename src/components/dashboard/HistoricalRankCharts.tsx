'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface HistoricalRankChartsProps {
  historicalRanks: Record<string, { overall: number, branch: number }> | undefined;
}

export function HistoricalRankCharts({ historicalRanks }: HistoricalRankChartsProps) {
  if (!historicalRanks || Object.keys(historicalRanks).length === 0) {
    return null;
  }

  // Format data for Recharts
  const data = Object.entries(historicalRanks).map(([sem, ranks]) => ({
    name: sem.replace('sem', 'Sem '),
    overallRank: ranks.overall,
    branchRank: ranks.branch,
  })).sort((a, b) => a.name.localeCompare(b.name));

  // Find min/max for better axis domains
  let maxOverall = 0;
  let maxBranch = 0;
  
  data.forEach(d => {
    if (d.overallRank > maxOverall) maxOverall = d.overallRank;
    if (d.branchRank > maxBranch) maxBranch = d.branchRank;
  });

  // Calculate a nice max value for the Y axis (adding 10% padding)
  const overallDomainMax = Math.ceil(maxOverall * 1.1);
  const branchDomainMax = Math.ceil(maxBranch * 1.1);

  return (
    <div className="pt-6 border-t border-muted">
      <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-indigo-500" />
        Cumulative Rank Trends
      </h4>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* University Rank Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 text-center">
            University Rank
          </h5>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  reversed={true} 
                  domain={[1, overallDomainMax]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dx={-10}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#818cf8', fontWeight: 600 }}
                  formatter={(value: number) => [`#${value}`, 'Overall Rank']}
                />
                <Line 
                  type="monotone" 
                  dataKey="overallRank" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }} 
                  activeDot={{ r: 7, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 3 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Rank Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6 text-center">
            Branch Rank
          </h5>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBranch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  reversed={true} 
                  domain={[1, branchDomainMax]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dx={-10}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#38bdf8', fontWeight: 600 }}
                  formatter={(value: number) => [`#${value}`, 'Branch Rank']}
                />
                <Line 
                  type="monotone" 
                  dataKey="branchRank" 
                  stroke="#0ea5e9" 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: '#0ea5e9', strokeWidth: 2, stroke: '#ffffff' }} 
                  activeDot={{ r: 7, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 3 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
