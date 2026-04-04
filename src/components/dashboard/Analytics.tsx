import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { BranchAverageCGPAChart, BranchAverage } from './BranchAverageCGPAChart';
import { PlacementStatsChart } from '@/components/dark-glass/PlacementStatsChart';

interface AnalyticsProps {
  branchDistribution: Record<string, number>;
  branchAverages?: BranchAverage[];
}

export function Analytics({ branchDistribution, branchAverages = [] }: AnalyticsProps) {
  const data = Object.keys(branchDistribution || {})
    .map(key => ({
      name: key,
      students: branchDistribution[key]
    }))
    .sort((a, b) => b.students - a.students);

  if (data.length === 0 && branchAverages.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-8 mb-8">
      
      {/* Top Row: Branch Distribution and CGPA Graph side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Branch Distribution Graph */}
        {data.length > 0 && (
          <Card className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Branch Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-[#1E293B]" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} dx={-10} />
                    <Tooltip 
                      cursor={{fill: 'rgba(56, 189, 248, 0.05)'}}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid #334155', 
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        color: '#F8FAFC'
                      }}
                      itemStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="students" fill="#38BDF8" radius={[4, 4, 0, 0]} animationDuration={1000} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Average CGPA by Branch */}
        {branchAverages.length > 0 && (
          <BranchAverageCGPAChart data={branchAverages} />
        )}
      </div>

      {/* Second Row: Placement Statistics Graph (Full Width) */}
      <div className="w-full">
        <PlacementStatsChart />
      </div>
      
    </div>
  );
}
