"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function SemesterTrendChart({ data }: { data: any[] }) {
  if (!data?.length) return null;

  return (
    <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6">
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-cyan-400 rounded-full"></span>
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
            <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#E2E8F0',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.15)'
              }}
              itemStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
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
              dot={{ r: 4, strokeWidth: 2, fill: '#0F172A', stroke: '#22D3EE' }}
              activeDot={{ r: 6, fill: '#22D3EE', stroke: '#0F172A', strokeWidth: 2 }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
