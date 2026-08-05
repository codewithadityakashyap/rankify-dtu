'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileDown, Award, TrendingUp, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function StudentModal({ student, open, onOpenChange }: { student: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [transcript, setTranscript] = useState<any>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  useEffect(() => {
    if (open && student) {
      const fetchTranscript = async () => {
        setLoadingTranscript(true);
        try {
          const res = await fetch(`/api/transcript?rollNumber=${encodeURIComponent(student.rollNumber)}`);
          if (res.ok) {
            const data = await res.json();
            setTranscript(data);
          } else {
            setTranscript(null);
          }
        } catch (error) {
          console.error("Failed to fetch transcript", error);
          setTranscript(null);
        } finally {
          setLoadingTranscript(false);
        }
      };
      fetchTranscript();
    } else {
      setTranscript(null);
    }
  }, [open, student]);

  if (!student) return null;

  // Transform data for recharts
  const chartData = [
    { name: 'Sem 1', sgpa: student.sgpa.sem1 || null },
    { name: 'Sem 2', sgpa: student.sgpa.sem2 || null },
    { name: 'Sem 3', sgpa: student.sgpa.sem3 || null },
    { name: 'Sem 4', sgpa: student.sgpa.sem4 || null },
    { name: 'Sem 5', sgpa: student.sgpa.sem5 || null },
    { name: 'Sem 6', sgpa: student.sgpa.sem6 || null },
  ].filter(d => d.sgpa !== null);

  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Primary blue
    doc.text('Rankify DTU - Official Report', 14, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // slate 900
    doc.text(`Student: ${student.name}`, 14, 40);
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Roll No: ${student.rollNumber}  |  Branch: ${student.branch}`, 14, 48);
    
    // Stats Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 55, 180, 25, 3, 3, 'FD');
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(`Aggregate CGPA: ${student.cgpa.toFixed(3)}`, 20, 65);
    doc.text(`Overall Rank: #${student.overallRank}`, 80, 65);
    doc.text(`Branch Rank: #${student.branchRank}`, 140, 65);
    
    // Table
    autoTable(doc, {
      startY: 90,
      head: [['Semester', 'Exact Score']],
      body: [
        ['Semester 1', student.sgpa.sem1?.toFixed(3) || 'N/A'],
        ['Semester 2', student.sgpa.sem2?.toFixed(3) || 'N/A'],
        ['Semester 3', student.sgpa.sem3?.toFixed(3) || 'N/A'],
        ['Semester 4', student.sgpa.sem4?.toFixed(3) || 'N/A'],
        ['Semester 5', student.sgpa.sem5?.toFixed(3) || 'N/A'],
        ['Semester 6', student.sgpa.sem6?.toFixed(3) || 'N/A'],
      ],
      headStyles: { fillColor: [37, 99, 235] },
      theme: 'grid'
    });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Generated dynamically by Rankify DTU Portal.', 14, (doc as any).lastAutoTable.finalY + 15);
    
    doc.save(`${student.rollNumber}_DTU_Report.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl bg-card">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold font-sans text-foreground">{student.name}</DialogTitle>
              <DialogDescription className="font-mono mt-1 text-muted-foreground">
                {student.rollNumber} • {student.branch} Core
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{student.cgpa.toFixed(3)}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Aggregate CGPA</div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6 overflow-y-auto pr-1 -mr-1 max-h-[60vh] sm:max-h-[65vh] scrollbar-thin scrollbar-thumb-muted">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-muted/50 to-muted/10 rounded-xl p-3 sm:p-4 text-center border shadow-sm">
              <div className="text-2xl sm:text-3xl font-semibold mb-1 text-foreground">#{student.overallRank}</div>
              <div className="text-[10px] sm:text-[11px] uppercase text-muted-foreground font-bold tracking-widest flex items-center justify-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Overall Rank
              </div>
            </div>
            <div className="bg-gradient-to-br from-muted/50 to-muted/10 rounded-xl p-3 sm:p-4 text-center border shadow-sm">
              <div className="text-2xl sm:text-3xl font-semibold mb-1 text-foreground">#{student.branchRank}</div>
              <div className="text-[10px] sm:text-[11px] uppercase text-muted-foreground font-bold tracking-widest flex items-center justify-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-accent" /> Branch Rank
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-3 sm:p-4 text-center border border-emerald-500/20 shadow-sm">
              <div className="text-2xl sm:text-3xl font-semibold mb-1 text-emerald-600 dark:text-emerald-400">
                {student.improvement > 0 ? '+' : ''}{student.improvement?.toFixed(2) || '0.00'}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase text-emerald-600/80 dark:text-emerald-400/80 font-bold tracking-widest flex items-center justify-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Improvement
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block shadow-[0_0_8px_rgba(37,99,235,0.6)]"></span>
              SGPA Performance Timeline
            </h4>
            <div className="h-[160px] sm:h-[200px] w-full pt-4 pr-4 pb-2 bg-gradient-to-b from-transparent to-muted/10 rounded-xl border border-muted/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <YAxis domain={['auto', 10]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} width={40} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    itemStyle={{ color: '#2563EB' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sgpa" 
                    stroke="#2563EB" 
                    strokeWidth={3.5} 
                    dot={{ r: 4.5, strokeWidth: 2.5, fill: 'white' }} 
                    activeDot={{ r: 7, fill: '#2563EB', stroke: 'white', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {chartData.map((d) => (
              <Badge key={d.name} variant="secondary" className="px-3 py-1 font-mono">
                {d.name}: {d.sgpa.toFixed(2)}
              </Badge>
            ))}
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2 border-t pt-6">
              <BookOpen className="w-4 h-4 text-primary" />
              Detailed Transcript
            </h4>
            
            {loadingTranscript ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading detailed grades...
              </div>
            ) : transcript && transcript.semesters ? (
              <Accordion type="single" collapsible className="w-full">
                {Object.keys(transcript.semesters).map((semKey) => {
                  const semData = transcript.semesters[semKey];
                  if (!semData || !semData.subjects) return null;
                  
                  return (
                    <AccordionItem value={semKey} key={semKey} className="border bg-muted/10 rounded-lg px-4 mb-2">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-semibold uppercase text-sm">Semester {semKey.replace('sem', '')}</span>
                          <Badge variant="outline" className="font-mono bg-background">SGPA: {semData.sgpa.toFixed(3)}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="overflow-x-auto rounded-md border bg-background">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-semibold">
                              <tr>
                                <th className="px-1.5 sm:px-3 py-2 border-b text-[10px] sm:text-sm">Code</th>
                                <th className="px-1.5 sm:px-3 py-2 border-b text-[10px] sm:text-sm">Subject Name</th>
                                <th className="px-1.5 sm:px-3 py-2 border-b text-center text-[10px] sm:text-sm">Cr.</th>
                                <th className="px-1.5 sm:px-3 py-2 border-b text-center text-[10px] sm:text-sm">Grade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {semData.subjects.map((sub: any, idx: number) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
                                  <td className="px-1.5 sm:px-3 py-2 font-mono text-[9px] sm:text-xs text-muted-foreground whitespace-nowrap">{sub.code}</td>
                                  <td className="px-1.5 sm:px-3 py-2 text-[11px] sm:text-sm font-medium min-w-[90px] sm:min-w-[130px] max-w-[160px] sm:max-w-none break-words whitespace-normal leading-tight sm:leading-snug">{sub.name}</td>
                                  <td className="px-1.5 sm:px-3 py-2 text-center text-[10px] sm:text-sm text-muted-foreground">{sub.credits}</td>
                                  <td className="px-1.5 sm:px-3 py-2 text-center font-bold text-[10px] sm:text-sm text-primary">{sub.grade}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center bg-muted/10 rounded-md border border-dashed">
                Detailed transcript not available for this student yet.
              </div>
            )}
          </div>

        </div>

        <div className="pt-4 border-t flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2">
          <Button variant="outline" onClick={downloadReport} className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm font-semibold transition-all hover:scale-[1.02]">
            <FileDown className="w-4 h-4" /> Download PDF
          </Button>
          <Button asChild className="w-full sm:w-auto shadow-md font-semibold transition-all hover:scale-[1.02] bg-primary text-primary-foreground p-0">
            <a href={`/student/${encodeURIComponent(student.rollNumber)}`} onClick={() => onOpenChange(false)} className="flex items-center justify-center gap-2 w-full h-full px-4 py-2">
              <Award className="w-4 h-4" /> View Full Profile
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
