"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function SubjectDifficulty({ mostFailedSubjects }: { mostFailedSubjects: any[] }) {
  return (
    <Card className="bg-white dark:bg-[#1E293B]/80 backdrop-blur-xl border-slate-200 dark:border-slate-700/50 mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Subject Difficulty Analytics</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400">Top 10 most failed subjects across all branches</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="w-[100px] font-semibold text-slate-700 dark:text-slate-300">Code</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Subject Name</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Failure Count</TableHead>
                <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Affected Branches</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostFailedSubjects.map((subject, index) => (
                <TableRow key={subject.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                      <span className="text-slate-900 dark:text-slate-200 font-bold">{subject.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300 font-medium">{subject.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 font-bold">
                      {subject.count}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      {subject.branches.slice(0, 3).map((branch: string) => (
                        <span key={branch} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {branch}
                        </span>
                      ))}
                      {subject.branches.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                          +{subject.branches.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {mostFailedSubjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                    No failure data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
