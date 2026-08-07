'use client';

import { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, Calculator, X, Plus } from 'lucide-react';

interface CGPAPredictorProps {
  student: any;
}

export function CGPAPredictor({ student }: CGPAPredictorProps) {
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
  
  // Estimate current total credits based on average of 20 per semester
  const estimatedCurrentCredits = completedSems.length * 20;
  const currentTotalGradePoints = currentCgpa * estimatedCurrentCredits;
  
  const totalSemesters = 8;
  const remainingSemsCount = Math.max(0, totalSemesters - highestCompletedSem);
  
  // State for predicted future semesters
  const [predictedSems, setPredictedSems] = useState(
    Array(remainingSemsCount).fill(null).map((_, idx) => ({
      semNumber: highestCompletedSem + idx + 1,
      sgpa: 8.5,
      credits: 20,
      enabled: true
    }))
  );

  const handleUpdatePrediction = (index: number, field: string, value: number | boolean) => {
    const newPredictions = [...predictedSems];
    newPredictions[index] = { ...newPredictions[index], [field]: value };
    setPredictedSems(newPredictions);
  };

  const activePredictions = predictedSems.filter(p => p.enabled);
  
  const futureCredits = activePredictions.reduce((sum, p) => sum + p.credits, 0);
  const futureGradePoints = activePredictions.reduce((sum, p) => sum + (p.sgpa * p.credits), 0);
  
  const totalProjectedCredits = estimatedCurrentCredits + futureCredits;
  const projectedCgpa = totalProjectedCredits > 0 
    ? (currentTotalGradePoints + futureGradePoints) / totalProjectedCredits 
    : currentCgpa;
  
  const diff = projectedCgpa - currentCgpa;

  if (remainingSemsCount <= 0) {
    return (
      <div className="bg-card rounded-xl border p-6 text-center text-muted-foreground shadow-sm">
        <Target className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
        <p>This student has completed all 8 semesters.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-none">CGPA Predictor</h3>
          <p className="text-xs text-muted-foreground mt-1">Estimate your final CGPA with custom credits & SGPA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-sm font-semibold border-b pb-2 text-foreground flex items-center justify-between">
            <span>Future Semesters</span>
            <span className="text-xs font-normal text-muted-foreground">Toggle to include/exclude</span>
          </h4>
          
          <div className="space-y-3">
            {predictedSems.map((prediction, idx) => (
              <div 
                key={prediction.semNumber} 
                className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  prediction.enabled 
                    ? 'bg-muted/10 border-border/60 shadow-sm' 
                    : 'bg-muted/5 border-dashed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={prediction.enabled}
                      onChange={(e) => handleUpdatePrediction(idx, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                    />
                    <div className="font-semibold text-sm text-foreground">Semester {prediction.semNumber}</div>
                  </div>
                </div>
                
                {prediction.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 pl-7">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Target SGPA</label>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{prediction.sgpa.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="10" step="0.1" 
                        value={prediction.sgpa}
                        onChange={(e) => handleUpdatePrediction(idx, 'sgpa', parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Credits</label>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{prediction.credits}</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" max="30" step="1" 
                        value={prediction.credits}
                        onChange={(e) => handleUpdatePrediction(idx, 'credits', parseInt(e.target.value))}
                        className="w-full accent-slate-500 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 rounded-2xl p-6 border border-indigo-500/10 flex flex-col justify-center relative overflow-hidden h-fit sticky top-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="text-center mb-8 relative z-10">
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Current CGPA</div>
            <div className="text-3xl font-semibold text-foreground">{currentCgpa.toFixed(3)}</div>
            <div className="text-[10px] text-muted-foreground mt-1">Based on ~{estimatedCurrentCredits} credits</div>
          </div>
          
          <div className="flex items-center justify-center mb-8 relative z-10">
            <div className="w-[1px] h-10 bg-gradient-to-b from-transparent via-border to-transparent"></div>
          </div>

          <div className="text-center relative z-10">
            <div className="text-xs text-indigo-500 uppercase tracking-widest font-bold mb-2">Projected Final CGPA</div>
            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 drop-shadow-sm">
              {projectedCgpa.toFixed(3)}
            </div>
            
            <div className={`mt-4 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border ${
              diff > 0 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                : diff < 0 
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                  : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
            }`}>
              {diff !== 0 && <TrendingUp className={`w-3.5 h-3.5 ${diff < 0 ? 'rotate-180' : ''}`} />}
              {diff > 0 ? '+' : ''}{diff.toFixed(2)}
            </div>
          </div>
          
          <div className="mt-8 text-[10px] text-muted-foreground text-center leading-relaxed bg-background/60 p-3 rounded-lg border border-border/50 relative z-10">
            <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 opacity-70 text-amber-500" />
            Projection assumes previous semesters averaged 20 credits each. Adjusting future credits calculates a true credit-weighted average.
          </div>
        </div>
      </div>
    </div>
  );
}
