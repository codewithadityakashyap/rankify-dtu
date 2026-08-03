import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileDown, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function StudentModal({ student, open, onOpenChange }: { student: any, open: boolean, onOpenChange: (open: boolean) => void }) {
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
          <div className="flex items-start justify-between">
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

        <div className="py-4 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-3 text-center border">
              <div className="text-2xl font-semibold mb-1">#{student.overallRank}</div>
              <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest flex items-center justify-center gap-1">
                <Award className="w-3 h-3" /> Overall Rank
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center border">
              <div className="text-2xl font-semibold mb-1">#{student.branchRank}</div>
              <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-accent" /> Branch Rank
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center border">
              <div className="text-2xl font-semibold mb-1 text-emerald-600 dark:text-emerald-400">
                {student.improvement > 0 ? '+' : ''}{student.improvement?.toFixed(2) || '0.00'}
              </div>
              <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> Improvement
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              SGPA Performance Timeline
            </h4>
            <div className="h-[200px] w-full pt-4 pr-4 bg-muted/10 rounded-xl border">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis domain={['auto', 10]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={35} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sgpa" 
                    stroke="#2563EB" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: 'white' }} 
                    activeDot={{ r: 6, fill: '#2563EB' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {chartData.map((d) => (
              <Badge key={d.name} variant="secondary" className="px-3 py-1 font-mono">
                {d.name}: {d.sgpa.toFixed(2)}
              </Badge>
            ))}
          </div>

        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button onClick={downloadReport} className="flex items-center gap-2 shadow-sm font-semibold transition-all hover:scale-[1.02]">
            <FileDown className="w-4 h-4" /> Download PDF Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
