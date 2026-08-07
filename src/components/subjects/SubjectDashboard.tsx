'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend
} from 'recharts';
import { BookOpen, TrendingUp, AlertTriangle, Users, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useSearchParams } from 'next/navigation';
import { BatchSelector } from '@/components/dark-glass/BatchSelector';

interface SubjectStats {
  code: string;
  name: string;
  credits: number;
  totalStudents: number;
  avgGpa: number;
  passRate: number;
  failRate: number;
  branches: string[];
  semesters: string[];
  grades: { [key: string]: number };
}

const getCategory = (code: string) => {
  // Check if it's a branch-specific foundational course e.g., AM102 (CS)
  const branchMatch = code.match(/\(([A-Z0-9]+)\)$/);
  if (branchMatch) {
    return branchMatch[1];
  }

  const match = code.match(/^[a-zA-Z]+/);
  if (!match) return 'OTHER';
  const prefix = match[0].toUpperCase();
  
  if (prefix.startsWith('MBA') || prefix === 'MG') return 'MBA';
  
  return prefix;
};

export default function SubjectDashboard({ initialData }: { initialData: Record<string, SubjectStats[]> }) {
  const searchParams = useSearchParams();
  const batch = searchParams.get('batch') || '2027';
  
  // Get data for the selected batch
  const currentBatchData = initialData[batch] || initialData['All'] || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: keyof SubjectStats, direction: 'asc' | 'desc' }>({ key: 'avgGpa', direction: 'desc' });
  const [selectedSubject, setSelectedSubject] = useState<SubjectStats | null>(null);

  // Initialize selected subject when batch changes
  React.useEffect(() => {
    if (currentBatchData.length > 0) {
      setSelectedSubject(currentBatchData[0]);
    }
  }, [batch, currentBatchData]);

  const filteredData = useMemo(() => {
    let data = [...currentBatchData];
    if (searchTerm) {
      data = data.filter(s => 
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      data = data.filter(s => {
        const cat = getCategory(s.code);
        if (cat === selectedCategory) return true;
        // Include MOOC courses if the selected category is one of the student branches that took it
        if (cat === 'MOOC' && s.branches.includes(selectedCategory)) return true;
        return false;
      });
    }
    if (selectedSemester !== 'All') {
      data = data.filter(s => s.semesters.includes(selectedSemester));
    }
    data.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [currentBatchData, searchTerm, selectedCategory, selectedSemester, sortConfig]);

  const topEasiest = useMemo(() => [...filteredData].sort((a, b) => b.avgGpa - a.avgGpa).slice(0, 5), [filteredData]);
  const topToughest = useMemo(() => [...filteredData].sort((a, b) => b.failRate - a.failRate).slice(0, 5), [filteredData]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    currentBatchData.forEach(s => categories.add(getCategory(s.code)));
    return ['All', ...Array.from(categories).sort()];
  }, [currentBatchData]);

  const allSemesters = useMemo(() => {
    const sems = new Set<string>();
    currentBatchData.forEach(s => s.semesters.forEach(sem => sems.add(sem)));
    return ['All', ...Array.from(sems).sort()];
  }, [currentBatchData]);

  const requestSort = (key: keyof SubjectStats) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof SubjectStats) => {
    if (sortConfig.key !== key) return <span className="opacity-0 w-4 h-4" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 inline" /> : <ChevronDown className="w-4 h-4 inline" />;
  };

  // Prepare Pie Chart Data for Selected Subject
  const pieData = useMemo(() => {
    if (!selectedSubject) return [];
    return Object.entries(selectedSubject.grades)
      .map(([name, value]) => ({ name, value }))
      .filter(g => g.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [selectedSubject]);

  const GRADE_COLORS: Record<string, string> = {
    'O': '#10B981',   // Emerald 500
    'A+': '#14B8A6',  // Teal 500
    'A': '#0EA5E9',   // Sky 500
    'B+': '#6366F1',  // Indigo 500
    'B': '#8B5CF6',   // Violet 500
    'C': '#F59E0B',   // Amber 500
    'P': '#64748B',   // Slate 500
    'F': '#EF4444',   // Red 500
    'Ab': '#B91C1C',  // Red 700
  };

  return (
    <div className="max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            Subject Analysis
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Discover the easiest scoring subjects, toughest courses, and detailed grade distributions across the university.
          </p>
        </div>
        
        <div className="w-full md:w-64">
          <BatchSelector />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Subjects</h3>
          <div className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            {filteredData.length}
            <Users className="w-5 h-5 text-indigo-500 opacity-80" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Most Scoring Subject</h3>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 truncate">
            {topEasiest[0]?.code || 'N/A'}
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">{topEasiest[0]?.name} (Avg: {topEasiest[0]?.avgGpa})</p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-red-500/50 transition-colors">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Toughest Subject</h3>
          <div className="text-xl font-black text-red-500 dark:text-red-400 truncate">
            {topToughest[0]?.code || 'N/A'}
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">{topToughest[0]?.name} ({topToughest[0]?.failRate}% Fail)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Data Table */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-500" />
                Subject Directory
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {allCategories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                </select>
                
                <select 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  {allSemesters.map(s => <option key={s} value={s}>{s === 'All' ? 'All Semesters' : s.replace('sem', 'Semester ')}</option>)}
                </select>
                
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text"
                    placeholder="Search subject code or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 shadow-sm">
                  <TableRow className="border-slate-200 dark:border-slate-700">
                    <TableHead className="w-24 font-bold cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => requestSort('code')}>
                      Code {getSortIcon('code')}
                    </TableHead>
                    <TableHead className="min-w-[200px] font-bold cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => requestSort('name')}>
                      Subject Name {getSortIcon('name')}
                    </TableHead>
                    <TableHead className="text-right font-bold cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => requestSort('totalStudents')}>
                      Students {getSortIcon('totalStudents')}
                    </TableHead>
                    <TableHead className="text-right font-bold cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => requestSort('avgGpa')}>
                      Avg GPA {getSortIcon('avgGpa')}
                    </TableHead>
                    <TableHead className="text-right font-bold cursor-pointer hover:text-indigo-500 transition-colors" onClick={() => requestSort('failRate')}>
                      Fail % {getSortIcon('failRate')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map(subject => (
                    <TableRow 
                      key={subject.code} 
                      onClick={() => setSelectedSubject(subject)}
                      className={`cursor-pointer transition-colors border-slate-100 dark:border-slate-800 ${
                        selectedSubject?.code === subject.code 
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <TableCell className="font-semibold text-slate-900 dark:text-white">{subject.code}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]" title={subject.name}>{subject.name}</TableCell>
                      <TableCell className="text-right text-slate-600 dark:text-slate-400 font-mono">{subject.totalStudents.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-bold">{subject.avgGpa.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-red-500 dark:text-red-400 font-medium">{subject.failRate.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  {filteredData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-slate-500">No subjects found matching &quot;{searchTerm}&quot;</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Dive & Top Lists */}
        <div className="flex flex-col gap-6">
          
          {/* Selected Subject Card */}
          {selectedSubject && (
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2 border border-indigo-100 dark:border-indigo-500/20">
                    {selectedSubject.code} • {selectedSubject.credits} Credits
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedSubject.name}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-400 uppercase mb-1">Avg GPA</span>
                  <span className="text-3xl font-black text-emerald-500">{selectedSubject.avgGpa.toFixed(2)}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-400 uppercase mb-1">Failure Rate</span>
                  <span className="text-3xl font-black text-red-500">{selectedSubject.failRate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex-1 min-h-[250px] relative">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">Grade Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.name] || '#94A3B8'} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => [value, `${name} Grade`]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value, entry, index) => <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top 5 Toughest Subjects */}
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Highest Failure Rates
            </h3>
            <div className="space-y-3">
              {topToughest.map((s, i) => (
                <div key={s.code} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-slate-400 font-bold w-4">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.code}</p>
                      <p className="text-xs text-slate-500 truncate w-32 sm:w-48">{s.name}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">
                    {s.failRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
