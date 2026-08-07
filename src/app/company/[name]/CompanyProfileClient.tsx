'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const PALETTE = ['#2563EB', '#38BDF8', '#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#14B8A6'];

export function CompanyProfileClient({ companyData }: { companyData: any }) {
  const [imgError, setImgError] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const logoUrl = `https://logo.clearbit.com/${companyData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  const typeColor = 
    companyData.type === 'Tech' ? '#2563EB' : 
    companyData.type === 'Core' ? '#10B981' : 
    companyData.type === 'Non-Tech' ? '#F59E0B' : '#94A3B8';

  const branchData = useMemo(() => {
    return Object.entries(companyData.branches)
      .map(([branch, count]) => ({ branch, count }))
      .sort((a: any, b: any) => b.count - a.count);
  }, [companyData]);

  const roleData = useMemo(() => {
    return Object.entries(companyData.roles)
      .map(([role, count]) => ({ role, count }))
      .sort((a: any, b: any) => b.count - a.count);
  }, [companyData]);

  const ctcLabel = (v: number) => v > 0 ? `${v} LPA` : 'N/A';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-5xl space-y-6">
        
        <Link href="/placement" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Placements
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            {!imgError ? (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center p-2" style={{ background: `${typeColor}10`, border: `2px solid ${typeColor}30` }}>
                <img src={logoUrl} alt={companyData.name} onError={() => setImgError(true)} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center font-black text-2xl" style={{ background: `${typeColor}20`, color: typeColor, border: `2px solid ${typeColor}40` }}>
                {companyData.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{companyData.name}</h1>
              <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1" style={{ color: typeColor, background: `${typeColor}15`, border: `1px solid ${typeColor}30` }}>
                {companyData.type}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Students Hired', value: companyData.hired },
              { label: 'Avg CTC', value: ctcLabel(companyData.avgCtc) },
              { label: 'Median CTC', value: ctcLabel(companyData.medianCtc) },
              { label: 'Max CTC', value: ctcLabel(companyData.maxCtc) },
              { label: 'Avg CGPA', value: companyData.avgCgpa },
              { label: 'Min CGPA', value: companyData.minCgpa },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{s.label}</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Branch Distribution */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Branch Distribution</h3>
            {branchData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={branchData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f020" />
                  <XAxis dataKey="branch" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#e2e8f010' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {branchData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">No data available</p>
            )}
          </div>

          {/* Role Breakdown */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Role Breakdown</h3>
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={roleData} dataKey="count" nameKey="role" cx="50%" cy="50%" outerRadius={90} label={(props: any) => `${props.role} (${props.count})`}>
                    {roleData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Branch Students Directory */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-5 shadow-sm mt-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">View Students Placed by Branch</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {branchData.map((b: any) => (
              <button
                key={b.branch}
                onClick={() => setSelectedBranch(selectedBranch === b.branch ? null : b.branch)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  selectedBranch === b.branch
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                {b.branch} <span className="opacity-70 ml-1">({b.count})</span>
              </button>
            ))}
          </div>

          {selectedBranch && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {companyData.students
                .filter((s: any) => s.branch === selectedBranch)
                .sort((a: any, b: any) => b.ctc - a.ctc)
                .map((s: any, i: number) => (
                <div key={i} className="flex flex-col p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                  <span className="font-bold text-slate-900 dark:text-white text-sm truncate">{s.name}</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500 font-medium">{s.rollNumber}</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{s.cgpa.toFixed(2)} CGPA</span>
                  </div>
                  {(s.role || s.duration) && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1">
                      {s.role && s.role !== 'Unknown' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">{s.role}</span>
                      )}
                      {s.duration && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{s.duration}</span>
                      )}
                      {s.ctc > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ml-auto">{s.ctc} LPA</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
