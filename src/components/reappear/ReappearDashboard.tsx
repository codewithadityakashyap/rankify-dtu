"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, TrendingUp, BookOpen, GraduationCap, Percent, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReappearCharts } from "./ReappearCharts";
import { SubjectDifficulty } from "./SubjectDifficulty";

export function ReappearDashboard({ data }: { data: any }) {
  const { stats, mostFailedSubjects, branchBacklogRate } = data;

  const handleExport = () => {
    let csv = "Subject Code,Subject Name,Failure Count\n";
    mostFailedSubjects.forEach((sub: any) => {
      csv += `"${sub.code}","${sub.name}",${sub.count}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'dtu_reappear_report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Header section */}
      <div className="mb-8 relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 blur-3xl -z-10 rounded-full" />
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Reappear Analytics <span className="text-orange-500 font-light">Module</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Deep dive into the 2027 batch academic performance. Explore backlog trends, reappear success rates, and subject difficulty metrics.
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="shrink-0 gap-2 font-semibold">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Students w/ Backlogs</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studentsWithBacklogs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall Backlog Rate: <span className="font-semibold text-foreground">{stats.overallBacklogRate.toFixed(1)}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Cleared Students</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clearedStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Revised Results Count: <span className="font-semibold text-foreground">{stats.revisedResultsCount}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">Total Failed Subjects</CardTitle>
            <BookOpen className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFailedSubjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg. Backlogs per Student: <span className="font-semibold text-foreground">{stats.averageBacklogsPerStudent.toFixed(1)}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Tracked Base</CardTitle>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total records analyzed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations Section */}
      <ReappearCharts branchBacklogRate={branchBacklogRate} />

      {/* Subject Difficulty Analytics */}
      <SubjectDifficulty mostFailedSubjects={mostFailedSubjects} />
    </div>
  );
}
