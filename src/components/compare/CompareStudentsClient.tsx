'use client';

import React, { useState } from 'react';
import { Search, User, Award, TrendingUp, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function CompareStudentsClient({ allStudents, allTranscripts }: { allStudents: any[], allTranscripts?: any }) {
  const [student1, setStudent1] = useState<any>(null);
  const [student2, setStudent2] = useState<any>(null);
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');

  // Very simple client-side search logic
  const getFilteredStudents = (query: string, exclude: any) => {
    if (query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return allStudents
      .filter(s => s !== exclude)
      .filter(s => s.name.toLowerCase().includes(lowerQuery) || s.rollNumber.toLowerCase().includes(lowerQuery))
      .slice(0, 5); // Limit to top 5
  };

  const filtered1 = getFilteredStudents(search1, student2);
  const filtered2 = getFilteredStudents(search2, student1);

  // Chart data generation for SGPA and Rank Trend
  const lineChartData = [];
  const rankChartData = [];
  
  if (student1 || student2) {
    for (let i = 1; i <= 8; i++) {
      const s1 = student1 ? student1.sgpa[`sem${i}`] : null;
      const s2 = student2 ? student2.sgpa[`sem${i}`] : null;
      
      if (s1 !== undefined || s2 !== undefined) {
        lineChartData.push({
          name: `Sem ${i}`,
          [student1 ? student1.name : 'Student 1']: s1 || null,
          [student2 ? student2.name : 'Student 2']: s2 || null,
        });

        // Compute historical rank for this semester
        let rank1 = null;
        let rank2 = null;
        
        const allSgpasForSem = allStudents
          .map(s => s.sgpa[`sem${i}`])
          .filter(val => val !== undefined && val !== null)
          .sort((a, b) => b - a);

        if (s1 !== undefined && s1 !== null) {
          rank1 = allSgpasForSem.indexOf(s1) + 1;
        }
        if (s2 !== undefined && s2 !== null) {
          rank2 = allSgpasForSem.indexOf(s2) + 1;
        }

        rankChartData.push({
          name: `Sem ${i}`,
          [student1 ? student1.name : 'Student 1']: rank1,
          [student2 ? student2.name : 'Student 2']: rank2,
        });
      }
    }
  }

  // Common subjects logic
  let commonSubjectsBySem: { semester: string, subjects: any[] }[] = [];
  if (student1 && student2 && allTranscripts) {
    const t1 = allTranscripts[student1.rollNumber];
    const t2 = allTranscripts[student2.rollNumber];
    
    if (t1?.semesters && t2?.semesters) {
      const subMap2 = new Map<string, any>();
      
      Object.values(t2.semesters).forEach((sem: any) => {
        sem.subjects?.forEach((sub: any) => {
          subMap2.set(sub.code, { grade: sub.grade });
        });
      });
      
      Object.entries(t1.semesters).forEach(([semKey, semData]: [string, any]) => {
        const semNumber = semKey.replace('sem', '');
        const matchedSubjects: any[] = [];
        
        semData.subjects?.forEach((sub: any) => {
          if (subMap2.has(sub.code)) {
            const s2Data = subMap2.get(sub.code);
            matchedSubjects.push({
              code: sub.code,
              name: sub.name,
              credits: sub.credits,
              grade1: sub.grade,
              grade2: s2Data.grade
            });
            // Remove to prevent duplicates
            subMap2.delete(sub.code);
          }
        });

        if (matchedSubjects.length > 0) {
          commonSubjectsBySem.push({
            semester: `Semester ${semNumber}`,
            subjects: matchedSubjects
          });
        }
      });
    }
  }

  // Radar chart data based on random synthetic skills to simulate analytics profile
  // We'll use branch rank, overall rank percentile, cgpa percentile, improvement, etc.
  
  const getPercentile = (rank: number, total: number) => Math.max(1, 100 - ((rank / total) * 100));
  const s1CgpaScore = student1 ? (student1.cgpa / 10) * 100 : 0;
  const s2CgpaScore = student2 ? (student2.cgpa / 10) * 100 : 0;
  const s1Overall = student1 ? getPercentile(student1.overallRank, 2500) : 0;
  const s2Overall = student2 ? getPercentile(student2.overallRank, 2500) : 0;
  const s1Branch = student1 ? getPercentile(student1.branchRank, 150) : 0;
  const s2Branch = student2 ? getPercentile(student2.branchRank, 150) : 0;
  const s1Improv = student1 ? 50 + (student1.improvement * 20) : 0; // Normalize improvement around 50
  const s2Improv = student2 ? 50 + (student2.improvement * 20) : 0;

  const radarData = [
    { subject: 'Absolute CGPA', [student1?.name || 'S1']: s1CgpaScore, [student2?.name || 'S2']: s2CgpaScore },
    { subject: 'Overall Rank (Pct)', [student1?.name || 'S1']: s1Overall, [student2?.name || 'S2']: s2Overall },
    { subject: 'Branch Rank (Pct)', [student1?.name || 'S1']: s1Branch, [student2?.name || 'S2']: s2Branch },
    { subject: 'Momentum', [student1?.name || 'S1']: s1Improv, [student2?.name || 'S2']: s2Improv },
  ];

  const renderSearchBox = (
    student: any, 
    setStudent: (s: any) => void, 
    search: string, 
    setSearch: (q: string) => void, 
    filtered: any[],
    title: string,
    colorClass: string
  ) => {
    return (
      <div className="flex-1 bg-card rounded-xl border p-5 shadow-sm relative">
        <h3 className="font-bold mb-4 text-sm text-muted-foreground uppercase tracking-wider">{title}</h3>
        {student ? (
          <div className={`p-4 rounded-lg border ${colorClass} bg-background/50 flex justify-between items-center`}>
            <div>
              <div className="font-bold text-lg">{student.name}</div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">{student.rollNumber} • {student.branch}</div>
            </div>
            <button onClick={() => setStudent(null)} className="p-2 hover:bg-muted rounded-md transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                className="w-full pl-9 pr-4 py-3 bg-muted/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="Search by name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filtered.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-card border rounded-lg shadow-lg overflow-hidden">
                {filtered.map(s => (
                  <div
                    key={s.rollNumber}
                    onClick={() => { setStudent(s); setSearch(''); }}
                    className="px-4 py-3 hover:bg-muted cursor-pointer border-b last:border-0"
                  >
                    <div className="font-semibold text-sm">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.rollNumber} • {s.branch}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {renderSearchBox(student1, setStudent1, search1, setSearch1, filtered1, "Student 1", "border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]")}
        {renderSearchBox(student2, setStudent2, search2, setSearch2, filtered2, "Student 2", "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]")}
      </div>

      {(student1 || student2) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <h3 className="font-bold text-lg mb-6 border-b pb-2">Academic Progression</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto', 10]} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  {student1 && <Line type="monotone" dataKey={student1.name} stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1'}} />}
                  {student2 && <Line type="monotone" dataKey={student2.name} stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <h3 className="font-bold text-lg mb-6 border-b pb-2">Performance Radar</h3>
            {student1 && student2 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 11, fill: '#64748b'}} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name={student1.name} dataKey={student1.name} stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                    <Radar name={student2.name} dataKey={student2.name} stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-lg bg-muted/10">
                Select a second student to see radar comparison
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border p-5 shadow-sm md:col-span-2">
            <h3 className="font-bold text-lg mb-6 border-b pb-2">University Rank Trend (Lower is better)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  {/* Reversed Y Axis because rank 1 is best */}
                  <YAxis reversed domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => `#${value}`}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                  {student1 && <Line type="monotone" dataKey={student1.name} stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b'}} />}
                  {student2 && <Line type="monotone" dataKey={student2.name} stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: '#ec4899'}} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {student1 && student2 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-muted-foreground font-semibold text-sm">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 w-1/3 text-xs sm:text-sm">Metric</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 w-1/3 text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">{student1.name}</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 w-1/3 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">{student2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              <tr className="hover:bg-muted/20">
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm">Branch</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm">{student1.branch}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm">{student2.branch}</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm">Aggregate CGPA</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-lg">{student1.cgpa.toFixed(3)}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-lg">{student2.cgpa.toFixed(3)}</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm">Overall Rank</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">#{student1.overallRank}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">#{student2.overallRank}</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm">Branch Rank</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">#{student1.branchRank}</td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">#{student2.branchRank}</td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm">Recent Improvement</td>
                <td className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm ${student1.improvement > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {student1.improvement > 0 ? '+' : ''}{student1.improvement?.toFixed(2) || 0}
                </td>
                <td className={`px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm ${student2.improvement > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {student2.improvement > 0 ? '+' : ''}{student2.improvement?.toFixed(2) || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {student1 && student2 && commonSubjectsBySem.length > 0 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="font-bold text-lg leading-none">Common Subjects Comparison</h3>
            <p className="text-xs text-muted-foreground mt-1">Comparing grades for subjects taken by both students.</p>
          </div>
          <div className="overflow-x-auto max-h-[500px] scrollbar-thin scrollbar-thumb-muted">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-muted-foreground font-semibold text-sm sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">Subject</th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm hidden sm:table-cell">Credits</th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">{student1.name.split(' ')[0]}</th>
                  <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">{student2.name.split(' ')[0]}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {commonSubjectsBySem.map((semGroup, grpIdx) => (
                  <React.Fragment key={grpIdx}>
                    <tr className="bg-muted/10 border-t-2 border-b-2">
                      <td colSpan={4} className="px-6 py-2 font-semibold text-xs uppercase tracking-widest text-muted-foreground">
                        {semGroup.semester}
                      </td>
                    </tr>
                    {semGroup.subjects.map((sub, idx) => (
                      <tr key={`${grpIdx}-${idx}`} className="hover:bg-muted/20">
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="font-bold text-foreground text-xs sm:text-sm whitespace-normal sm:whitespace-nowrap sm:max-w-none max-w-[140px] truncate sm:truncate-none break-words">{sub.name}</div>
                          <div className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">{sub.code}</div>
                        </td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm hidden sm:table-cell">{sub.credits}</td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-center font-bold text-sm sm:text-lg text-indigo-600 dark:text-indigo-400">{sub.grade1}</td>
                        <td className="px-2 sm:px-6 py-3 sm:py-4 text-center font-bold text-sm sm:text-lg text-emerald-600 dark:text-emerald-400">{sub.grade2}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
