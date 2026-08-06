'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Check, Network } from 'lucide-react';

interface BranchStats {
  branch: string;
  studentCount: number;
  avgCgpa: number;
  medianCgpa: number;
  highestCgpa: number;
  top10Avg: number;
  medianPackage: number;
}

export function CompareBranchesClient({ initialStats }: { initialStats: BranchStats[] }) {
  // Sort branches alphabetically
  const allBranches = [...initialStats].sort((a, b) => a.branch.localeCompare(b.branch));
  
  // Default to first 3 branches for comparison
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    allBranches.slice(0, 3).map(b => b.branch)
  );

  const toggleBranch = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      if (selectedBranches.length > 1) { // Keep at least one
        setSelectedBranches(selectedBranches.filter(b => b !== branch));
      }
    } else {
      if (selectedBranches.length < 5) { // Max 5 to keep chart legible
        setSelectedBranches([...selectedBranches, branch]);
      }
    }
  };

  const chartData = selectedBranches.map(branchName => {
    return allBranches.find(b => b.branch === branchName);
  }).filter(Boolean) as BranchStats[];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border p-5 shadow-sm">
        <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Network className="w-4 h-4" /> Select Branches to Compare (Max 5)
        </h3>
        <div className="flex flex-wrap gap-2">
          {allBranches.map((b) => {
            const isSelected = selectedBranches.includes(b.branch);
            return (
              <button
                key={b.branch}
                onClick={() => toggleBranch(b.branch)}
                disabled={!isSelected && selectedBranches.length >= 5}
                className={`
                  px-4 py-2 rounded-lg font-bold text-sm transition-all border flex items-center gap-2
                  ${isSelected 
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                    : 'bg-background hover:bg-muted text-muted-foreground border-border disabled:opacity-50 disabled:cursor-not-allowed'
                  }
                `}
              >
                {isSelected && <Check className="w-4 h-4" />}
                {b.branch}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-6 border-b pb-2">Average CGPA Comparison</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="branch" tick={{fontSize: 9, fill: '#94a3b8'}} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis domain={[5, 10]} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => value.toFixed(3)}
                />
                <Bar dataKey="avgCgpa" name="Average CGPA" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="top10Avg" name="Top 10% Average" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <div className="mb-6 border-b pb-2">
            <h3 className="font-bold text-lg">Estimated Median Package (LPA)</h3>
            <p className="text-xs text-muted-foreground mt-1">Based on 2026 Batch Placement Data</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="branch" tick={{fontSize: 9, fill: '#94a3b8'}} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `${value.toFixed(1)} LPA`}
                />
                <Bar dataKey="medianPackage" name="Median Package (LPA)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/50 text-muted-foreground font-semibold text-sm">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Branch</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Total Students</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Avg CGPA</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Highest CGPA</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Top 10% Avg</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">Median Package</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {chartData.map(stat => (
              <tr key={stat.branch} className="hover:bg-muted/20">
                <td className="px-6 py-4 font-bold">{stat.branch}</td>
                <td className="px-6 py-4 text-center">{stat.studentCount}</td>
                <td className="px-6 py-4 text-center font-semibold text-indigo-600 dark:text-indigo-400">{stat.avgCgpa.toFixed(3)}</td>
                <td className="px-6 py-4 text-center font-semibold">{stat.highestCgpa.toFixed(3)}</td>
                <td className="px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">{stat.top10Avg.toFixed(3)}</td>
                <td className="px-6 py-4 text-center font-semibold text-orange-500">{stat.medianPackage > 0 ? `${stat.medianPackage.toFixed(1)} LPA` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
