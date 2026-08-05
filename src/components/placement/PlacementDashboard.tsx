'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend,
} from 'recharts';
import { Search, X, Building2, Users, TrendingUp, Award, ChevronRight, ArrowLeft, Filter } from 'lucide-react';
import logosMap from '@/data/logos.json';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface StudentMini {
  name: string; rollNumber: string; cgpa: number; branch: string; role: string; ctc: number;
}
interface Company {
  name: string; type: string; hired: number;
  avgCtc: number; maxCtc: number; medianCtc: number;
  avgCgpa: number; minCgpa: number; maxCgpa: number;
  branches: Record<string, number>;
  roles: Record<string, number>;
  students: StudentMini[];
}
interface Stats {
  totalPlaced: number; totalCompanies: number;
  avgCtc: number; highestCtc: number;
  branchCount: Record<string, number>;
}
interface Props { companies: Company[]; stats: Stats; }

// ─────────────────────────────────────────────────────────────────────────────
// Palette
// ─────────────────────────────────────────────────────────────────────────────
const ACCENT = '#2563EB';
const PALETTE = ['#2563EB', '#38BDF8', '#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#14B8A6'];
const TYPE_COLOR: Record<string, string> = {
  Tech: '#2563EB', Core: '#10B981', 'Non-Tech': '#F59E0B', Unknown: '#94A3B8',
};
const CGPA_BRACKETS = [
  { label: '9–10 (Elite)', min: 9, max: 10, color: '#6366F1' },
  { label: '8–9', min: 8, max: 9, color: '#2563EB' },
  { label: '7–8', min: 7, max: 8, color: '#38BDF8' },
  { label: '<7', min: 0, max: 7, color: '#F59E0B' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function ctcLabel(v: number) { return v > 0 ? `${v} LPA` : 'N/A'; }
function cgpaBracket(cgpa: number) {
  return CGPA_BRACKETS.find((b) => cgpa >= b.min && cgpa < b.max) ?? CGPA_BRACKETS[3];
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = ACCENT }:
  { icon: any; label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{label}</p>
          <p className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white truncate">{value}</p>
          {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] w-full" style={{ background: `linear-gradient(to right, ${color}60, transparent)` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Company Card
// ─────────────────────────────────────────────────────────────────────────────
function CompanyCard({ co, onClick }: { co: Company; onClick: () => void }) {
  const typeColor = TYPE_COLOR[co.type] ?? '#94A3B8';
  const [imgError, setImgError] = useState(false);

  const getLogoBase = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("bain")) return "bain";
    if (lower.includes("zs")) return "zsassociates";
    return lower.replace(/[^a-z0-9]/g, '');
  };

  const baseName = getLogoBase(co.name);
  const mappedFile = (logosMap as Record<string, string>)[baseName];
  const logoUrl = mappedFile ? `/logos/${mappedFile}` : `/logos/${baseName}.svg`;

  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-3 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* Logo or placeholder */}
        {!imgError ? (
          <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center p-1"
            style={{ background: `${typeColor}08`, border: `1px solid ${typeColor}20` }}>
            <img
              src={logoUrl}
              alt={co.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
            />
          </div>
        ) : (
          <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm"
            style={{ background: `${typeColor}22`, color: typeColor, border: `1.5px solid ${typeColor}40` }}>
            {co.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color: typeColor, background: `${typeColor}15`, borderColor: `${typeColor}30` }}>
          {co.type}
        </span>
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 truncate pr-1">{co.name}</h3>
      <div className="grid grid-cols-2 gap-y-2 gap-x-1 mt-3">
        <div>
          <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Hired</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs">{co.hired}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Avg CGPA</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs">
            {co.avgCgpa ? co.avgCgpa.toFixed(2) : 'N/A'}
          </span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Avg CTC</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs whitespace-nowrap">{ctcLabel(co.avgCtc)}</span>
        </div>
        <div>
          <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Max CTC</span>
          <span className="font-bold text-slate-900 dark:text-white text-xs whitespace-nowrap">{ctcLabel(co.maxCtc)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end mt-3 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs font-medium mr-1">View details</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom bar tooltip
// ─────────────────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-3 text-xs">
      <p className="font-bold text-slate-900 dark:text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.fill || p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Company Detail Panel
// ─────────────────────────────────────────────────────────────────────────────
function CompanyDetailPanel({ co, onBack }: { co: Company; onBack: () => void }) {
  const typeColor = TYPE_COLOR[co.type] ?? '#94A3B8';
  const [imgError, setImgError] = useState(false);

  const getLogoBase = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("bain")) return "bain";
    if (lower.includes("zs")) return "zsassociates";
    return lower.replace(/[^a-z0-9]/g, '');
  };

  const baseName = getLogoBase(co.name);
  const mappedFile = (logosMap as Record<string, string>)[baseName];
  const logoUrl = mappedFile ? `/logos/${mappedFile}` : `/logos/${baseName}.svg`;

  const branchData = Object.entries(co.branches)
    .map(([b, c]) => ({ branch: b, count: c }))
    .sort((a, b) => b.count - a.count);

  const roleData = Object.entries(co.roles)
    .map(([r, c]) => ({ role: r, count: c }))
    .sort((a, b) => b.count - a.count);

  // CGPA clustering
  const clusterData = CGPA_BRACKETS.map((bracket) => {
    const row: Record<string, any> = { bracket: bracket.label };
    const branchNames = Object.keys(co.branches);
    for (const br of branchNames) {
      row[br] = co.students.filter(
        (s) => s.cgpa >= bracket.min && s.cgpa < bracket.max && s.branch === br
      ).length;
    }
    return row;
  });
  const uniqueBranches = Object.keys(co.branches);

  // Auto insight
  const topBranch = branchData[0];
  const topRole = roleData[0];
  const cgpaHint = co.avgCgpa >= 8.5 ? 'high (8.5+) CGPA' : co.avgCgpa >= 7.5 ? 'mid-range (7.5–8.5) CGPA' : 'diverse CGPA range';
  const insight = `${co.name} primarily hired from ${topBranch?.branch || '–'} (${topBranch?.count || 0} students), predominantly for ${topRole?.role || '–'} roles. The average CGPA of selected students is ${co.avgCgpa}, suggesting a preference for ${cgpaHint} candidates.`;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to directory
      </button>

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          {!imgError ? (
            <div className="w-14 h-14 rounded-xl flex items-center justify-center p-1.5"
              style={{ background: `${typeColor}10`, border: `2px solid ${typeColor}30` }}>
              <img
                src={logoUrl}
                alt={co.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl"
              style={{ background: `${typeColor}20`, color: typeColor, border: `2px solid ${typeColor}40` }}>
              {co.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{co.name}</h2>
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1"
              style={{ color: typeColor, background: `${typeColor}15`, border: `1px solid ${typeColor}30` }}>
              {co.type}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Students Hired', value: co.hired },
            { label: 'Avg CTC', value: ctcLabel(co.avgCtc) },
            { label: 'Median CTC', value: ctcLabel(co.medianCtc) },
            { label: 'Max CTC', value: ctcLabel(co.maxCtc) },
            { label: 'Avg CGPA', value: co.avgCgpa },
            { label: 'Min CGPA', value: co.minCgpa },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{s.label}</p>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Insight Banner ── */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 p-4 flex gap-3">
        <span className="text-blue-500 text-xl shrink-0">💡</span>
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{insight}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Branch Distribution */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Branch Distribution</h3>
          {branchData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={branchData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f020" />
                <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {branchData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No branch data</p>
          )}
        </div>

        {/* Role Breakdown */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Role Breakdown</h3>
          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={roleData} dataKey="count" nameKey="role" cx="50%" cy="50%" outerRadius={80}
                  label={(props: any) => `${props.role} ${((props.percent ?? 0) * 100).toFixed(0)}%`}>
                  {roleData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No role data</p>
          )}
        </div>
      </div>

      {/* ── Student Clustering (USP) ── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Clustering — CGPA × Branch</h3>
          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">USP</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">How CGPA segments break down across branches hired</p>
        {uniqueBranches.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={clusterData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f015" />
              <XAxis dataKey="bracket" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              {uniqueBranches.map((br, i) => (
                <Bar key={br} dataKey={br} stackId="a" fill={PALETTE[i % PALETTE.length]} radius={i === uniqueBranches.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">No data</p>
        )}
      </div>

      {/* Student list */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Students Hired ({co.students.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="text-left pb-2 font-semibold">Name</th>
                <th className="text-left pb-2 font-semibold">Branch</th>
                <th className="text-left pb-2 font-semibold">Role</th>
                <th className="text-left pb-2 font-semibold">CGPA</th>
                <th className="text-left pb-2 font-semibold">CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {co.students.map((s, i) => {
                const b = cgpaBracket(s.cgpa);
                return (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <td className="py-2 pr-4 font-medium text-slate-900 dark:text-white">{s.name}</td>
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{s.branch}</td>
                    <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{s.role}</td>
                    <td className="py-2 pr-4">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color: b.color, background: `${b.color}15` }}>
                        {s.cgpa}
                      </span>
                    </td>
                    <td className="py-2 text-slate-700 dark:text-slate-300 font-medium">{ctcLabel(s.ctc)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Global Analytics Section
// ─────────────────────────────────────────────────────────────────────────────
function GlobalAnalytics({ companies, stats }: Props) {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const topByCtc = [...companies].filter((c) => c.avgCtc > 0)
    .sort((a, b) => b.avgCtc - a.avgCtc).slice(0, 12)
    .map((c) => ({ name: c.name, avgCtc: c.avgCtc }));

  const topByHiring = [...companies].sort((a, b) => b.hired - a.hired).slice(0, 12)
    .map((c) => ({ name: c.name, students: c.hired }));

  const branchData = Object.entries(stats.branchCount)
    .filter(([b]) => b !== 'Unknown' && b !== 'Other')
    .sort((a, b) => b[1] - a[1])
    .map(([branch, count]) => ({ branch, count }));

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top 12 by Avg CTC */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Top Companies by Avg CTC</h3>
          <p className="text-xs text-slate-400 mb-4">Highest average salary packages offered</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topByCtc} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f015" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} unit=" LPA" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} interval={0} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgCtc" radius={[0, 4, 4, 0]} name="Avg CTC (LPA)">
                {topByCtc.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 12 by Hiring */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Most Hired From DTU</h3>
          <p className="text-xs text-slate-400 mb-4">Companies with largest intake from DTU 2026 batch</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topByHiring} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f015" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} interval={0} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="students" radius={[0, 4, 4, 0]} name="Students Hired">
                {topByHiring.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branch vs Placements */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Branch-wise Placement Count</h3>
        <p className="text-xs text-slate-400 mb-4">Total students placed per branch across all companies</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={branchData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f015" />
            <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Students Placed">
              {branchData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Branch Students Directory */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm mt-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">View Students Placed by Branch</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {branchData.map(b => (
            <button
              key={b.branch}
              onClick={() => setSelectedBranch(selectedBranch === b.branch ? null : b.branch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                selectedBranch === b.branch
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {b.branch} <span className="opacity-70 ml-1">({b.count})</span>
            </button>
          ))}
        </div>

        {selectedBranch && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
            {(() => {
              const allStudents = companies.flatMap(c => 
                c.students.map(s => ({ ...s, company: c.name, type: c.type }))
              );
              const branchStudents = allStudents
                .filter(s => s.branch === selectedBranch)
                .sort((a, b) => b.ctc - a.ctc);

              return branchStudents.map((s, i) => (
                <div key={i} className="flex flex-col p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: TYPE_COLOR[s.type] || '#94A3B8' }} />
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{s.rollNumber}</div>
                    </div>
                    <span className="text-xs font-extrabold px-1.5 py-0.5 rounded" style={{ color: cgpaBracket(s.cgpa).color, background: `${cgpaBracket(s.cgpa).color}15` }}>
                      {s.cgpa}
                    </span>
                  </div>
                  <div className="pl-2 mt-auto">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{s.company}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{s.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{s.ctc > 0 ? `${s.ctc} LPA` : 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Insight Engine — Auto-generated key insights
// ─────────────────────────────────────────────────────────────────────────────
function InsightEngine({ companies, stats }: Props) {
  const byCtc = [...companies].filter((c) => c.avgCtc > 0).sort((a, b) => b.avgCtc - a.avgCtc);
  const byHiring = [...companies].sort((a, b) => b.hired - a.hired);
  const topCtcCo = byCtc[0];
  const topHireCo = byHiring[0];
  const techCount = companies.filter((c) => c.type === 'Tech').length;
  const highPay = companies.filter((c) => c.avgCtc >= 20).length;
  const topBranch = Object.entries(stats.branchCount).sort((a, b) => b[1] - a[1])[0];

  const insights = [
    { emoji: '🏆', text: topCtcCo ? `${topCtcCo.name} offers the highest average CTC among all recruiters at ${topCtcCo.avgCtc} LPA.` : null },
    { emoji: '📦', text: topHireCo ? `${topHireCo.name} is the biggest recruiter from DTU 2026 batch, hiring ${topHireCo.hired} students.` : null },
    { emoji: '💻', text: `${techCount} out of ${stats.totalCompanies} companies are classified as Tech — the dominant sector in campus hiring.` },
    { emoji: '💰', text: `${highPay} companies offered average packages of 20+ LPA, reflecting strong demand for DTU talent.` },
    { emoji: '🎓', text: topBranch ? `${topBranch[0]} is the most-placed branch with ${topBranch[1]} students across all companies.` : null },
    { emoji: '📊', text: `The overall average CTC across all placements is ${stats.avgCtc} LPA, with the highest package at ${stats.highestCtc} LPA.` },
  ].filter((i) => i.text);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 p-5 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
        Auto-Generated Insights
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((ins, i) => (
          <div key={i}
            className="flex gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors">
            <span className="text-xl shrink-0">{ins.emoji}</span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ins.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export function PlacementDashboard({ companies, stats }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [highPay, setHighPay] = useState(false);
  const [selectedCo, setSelectedCo] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<'directory' | 'analytics'>('directory');

  const filtered = useMemo(() => {
    return companies.filter((co) => {
      const matchSearch = co.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || co.type === typeFilter;
      const matchPay = !highPay || co.avgCtc >= 20;
      return matchSearch && matchType && matchPay;
    });
  }, [companies, search, typeFilter, highPay]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A]">
      {/* ── HERO ── */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-14 px-4">
        <div className="container mx-auto max-w-[1400px]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
            </span>
            DTU 2026 Batch — Placement Data*
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Placement Intelligence<br className="hidden sm:block" />{' '}
            <span className="text-blue-600 dark:text-blue-400">Dashboard</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mb-10 leading-relaxed">
            Explore company-wise hiring trends, compensation insights, and student performance analytics.
          </p>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Building2} label="Total Companies" value={stats.totalCompanies} color="#2563EB" />
            <StatCard icon={Users} label="Students Placed" value={stats.totalPlaced} color="#10B981" />
            <StatCard icon={TrendingUp} label="Avg CTC" value={`${stats.avgCtc} LPA`} color="#6366F1" />
            <StatCard icon={Award} label="Highest CTC" value={`${stats.highestCtc} LPA`} sub="Best package offered" color="#F59E0B" />
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="container mx-auto max-w-[1400px] px-4 py-10">

        {/* Insight Engine always visible */}
        <InsightEngine companies={companies} stats={stats} />

        <div className="mt-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 w-fit mb-8">
            {(['directory', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedCo(null); }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize
                  ${activeTab === tab
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                {tab === 'directory' ? 'Company Directory' : 'Global Analytics'}
              </button>
            ))}
          </div>

          {/* ── DIRECTORY TAB ── */}
          {activeTab === 'directory' && (
            selectedCo ? (
              <CompanyDetailPanel co={selectedCo} onBack={() => setSelectedCo(null)} />
            ) : (
              <div className="space-y-5">
                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search company..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                    />
                    {search && (
                      <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                      {['All', 'Tech', 'Core', 'Non-Tech'].map((t) => (
                        <button key={t} onClick={() => setTypeFilter(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                            ${typeFilter === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setHighPay(!highPay)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                        ${highPay ? 'bg-amber-500 text-white border-amber-500' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                      <Filter className="w-3 h-3" /> High Pay (20+ LPA)
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400">{filtered.length} companies</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {filtered.map((co) => (
                    <CompanyCard key={co.name} co={co} onClick={() => setSelectedCo(co)} />
                  ))}
                </div>
              </div>
            )
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === 'analytics' && (
            <GlobalAnalytics companies={companies} stats={stats} />
          )}

          {/* Disclaimer */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              * <span className="font-semibold text-slate-600 dark:text-slate-300">Disclaimer:</span> The placement insights and statistics provided in this dashboard are aggregated from community submissions and word-of-mouth reports. While we strive for accuracy, this is not exact data and may not represent the official university figures. Please use this information for general guidance only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
