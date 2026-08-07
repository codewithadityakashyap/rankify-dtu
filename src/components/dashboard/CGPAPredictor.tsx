'use client';

import { useState } from 'react';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

interface CGPAPredictorProps {
  student: any;
}

export function CGPAPredictor({ student }: CGPAPredictorProps) {
  // Extract completed semesters (1 to 8 max)
  const completedSems = [
    student.sgpa.sem1,
    student.sgpa.sem2,
    student.sgpa.sem3,
    student.sgpa.sem4,
    student.sgpa.sem5,
    student.sgpa.sem6,
    student.sgpa.sem7,
    student.sgpa.sem8,
  ].filter(val => val !== undefined && val !== null);
  
  let highestCompletedSem = 0;
  for (let i = 1; i <= 8; i++) {
    if (student.sgpa[`sem${i}`] !== undefined && student.sgpa[`sem${i}`] !== null) {
      highestCompletedSem = i;
    }
  }
  
  const currentCgpa = student.cgpa || (completedSems.length > 0 ? completedSems.reduce((a, b) => a + b, 0) / completedSems.length : 0);
  const currentTotal = currentCgpa * completedSems.length;
  
  const totalSemesters = 8;
  const remainingSemsCount = Math.max(0, totalSemesters - highestCompletedSem);
  
  // State for predicted future semesters
  const [predictedSems, setPredictedSems] = useState<number[]>(
    Array(remainingSemsCount).fill(8.5) // Default prediction 8.5
  );

  const handlePredictChange = (index: number, value: number) => {
    const newPredictions = [...predictedSems];
    newPredictions[index] = value;
    setPredictedSems(newPredictions);
  };

  const projectedTotal = currentTotal + predictedSems.reduce((a, b) => a + b, 0);
  const projectedCgpa = projectedTotal / totalSemesters;
  
  const diff = projectedCgpa - currentCgpa;

  if (remainingSemsCount <= 0) {
    return (
      <div className="bg-card rounded-xl border p-6 text-center text-muted-foreground">
        <Target className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
        <p>This student has completed all 8 semesters.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Target className="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-none">Rank & CGPA Predictor</h3>
          <p className="text-xs text-muted-foreground mt-1">Estimate your final CGPA based on future performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <h4 className="text-sm font-semibold border-b pb-2 text-foreground">Future Semesters (Target SGPA)</h4>
          <div className="space-y-4">
            {predictedSems.map((val, idx) => {
              const semNumber = highestCompletedSem + idx + 1;
              return (
                <div key={semNumber} className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/20 p-3 rounded-lg border border-border/50">
                  <div className="w-24 shrink-0 font-medium text-sm text-foreground">Semester {semNumber}</div>
                  <div className="flex-1 flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" max="10" step="0.1" 
                      value={val}
                      onChange={(e) => handlePredictChange(idx, parseFloat(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="w-12 text-right font-bold text-indigo-600 dark:text-indigo-400">
                      {val.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 rounded-xl p-5 border border-indigo-500/10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Current CGPA</div>
            <div className="text-2xl font-semibold text-foreground">{currentCgpa.toFixed(3)}</div>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-[1px] h-8 bg-border"></div>
          </div>

          <div className="text-center">
            <div className="text-xs text-indigo-500 uppercase tracking-widest font-bold mb-1">Projected Final CGPA</div>
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {projectedCgpa.toFixed(3)}
            </div>
            
            <div className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              diff > 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : diff < 0 
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
            }`}>
              {diff !== 0 && <TrendingUp className={`w-3 h-3 ${diff < 0 ? 'rotate-180' : ''}`} />}
              {diff > 0 ? '+' : ''}{diff.toFixed(2)}
            </div>
          </div>
          
          <div className="mt-6 text-[10px] text-muted-foreground text-center leading-relaxed bg-background/50 p-3 rounded-lg border border-border/50">
            <AlertTriangle className="w-3 h-3 inline mr-1 mb-0.5 opacity-70" />
            Note: This is a simplified projection. Actual CGPA depends on the exact credit weightage of future subjects, which varies by semester.
          </div>
        </div>
      </div>
    </div>
  );
}
