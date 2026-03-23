"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export function DropAnalysis({ data }: { data: any[] }) {
  if (!data?.length) return null;

  return (
    <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-red-900/30 rounded-2xl shadow-[0_8px_30px_rgb(239,68,68,0.05)] p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-red-500 rounded-full"></span>
        Highest SGPA Drops (Risk Analysis)
      </h3>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#E2E8F0', fontSize: 11}}
              width={100}
            />
            <Tooltip 
              cursor={{fill: 'rgba(239, 68, 68, 0.05)'}}
              contentStyle={{ 
                backgroundColor: '#0F172A', 
                border: '1px solid #7F1D1D',
                borderRadius: '12px',
                color: '#E2E8F0',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)'
              }}
              formatter={(val: any) => {
                if (typeof val === 'number') return [`-${val.toFixed(2)} SGPA`, "Drop Magnitude"];
                return [val, "Drop Magnitude"];
              }}
            />
            <Bar dataKey="drop" radius={[0, 4, 4, 0]} animationDuration={1500} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#EF4444" opacity={1 - (index * 0.05)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
