import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { BranchAverageCGPAChart, BranchAverage } from './BranchAverageCGPAChart';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
      {/* Existing Branch Distribution Graph */}
      {data.length > 0 && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Branch Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(37, 99, 235, 0.05)'}}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid hsl(var(--border))', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'hsl(var(--popover))',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <Bar dataKey="students" fill="#38BDF8" radius={[4, 4, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* New Branch Average CGPA Graph */}
      {branchAverages.length > 0 && (
        <BranchAverageCGPAChart data={branchAverages} />
      )}
    </div>
  );
}
