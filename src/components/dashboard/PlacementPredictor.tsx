'use client';

import { useState } from 'react';
import { Briefcase, Building, CheckCircle2, XCircle } from 'lucide-react';

interface PlacementPredictorProps {
  student: any;
  placementData: {
    companies: Array<{
      name: string;
      minCgpa: number;
      package: string;
      type: string;
      branches: string[];
    }>;
  };
}

export function PlacementPredictor({ student, placementData }: PlacementPredictorProps) {
  const [testCgpa, setTestCgpa] = useState<number>(student.cgpa);
  // Sort companies by package (descending)
  const sortedCompanies = [...placementData.companies].sort((a, b) => {
    const pkgA = parseFloat(a.package);
    const pkgB = parseFloat(b.package);
    return pkgB - pkgA;
  });

  const normalizeBranch = (branch: string) => {
    const map: Record<string, string> = {
      'CO': 'CSE', 'CS': 'CSE',
      'SE': 'SE',
      'IT': 'IT',
      'MC': 'MCE', 'MCE': 'MCE',
      'EC': 'ECE', 'ECE': 'ECE',
      'EE': 'EE',
      'EP': 'EP',
      'ME': 'ME',
      'AE': 'AE',
      'CE': 'CE',
      'PE': 'PIE', 'PIE': 'PIE',
      'CH': 'CHE', 'CHE': 'CHE',
      'EN': 'ENE', 'ENE': 'ENE',
      'BT': 'BT'
    };
    return map[branch.toUpperCase()] || branch.toUpperCase();
  };

  const BRANCH_PRIORITY = ['CSE', 'IT', 'SE', 'MCE', 'ECE', 'EE', 'EP', 'ME', 'AE', 'CE', 'PIE', 'CHE', 'ENE', 'BT'];

  const checkBranchEligible = (companyBranches: string[], studentBranch: string) => {
    if (companyBranches.includes("ALL")) return true;
    
    const normalizedStudent = normalizeBranch(studentBranch);
    const studentIdx = BRANCH_PRIORITY.indexOf(normalizedStudent);
    if (studentIdx === -1) return false;

    let lowestIdx = -1;
    for (const b of companyBranches) {
      const idx = BRANCH_PRIORITY.indexOf(normalizeBranch(b));
      if (idx > lowestIdx) lowestIdx = idx;
    }

    return lowestIdx !== -1 && studentIdx <= lowestIdx;
  };

  const isEligible = (company: any) => {
    const cgpaEligible = testCgpa >= company.minCgpa;
    const branchEligible = checkBranchEligible(company.branches, student.branch);
    return cgpaEligible && branchEligible;
  };

  const eligibleCompanies = sortedCompanies.filter(isEligible);
  const ineligibleCompanies = sortedCompanies.filter(c => !isEligible(c));

  return (
    <div className="bg-card rounded-xl border shadow-sm">
      <div className="p-5 md:p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none mb-1.5">Company Eligibility</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[400px]">
                Eligibility predictions are estimated based on historical hiring patterns of previously recruited students. 
                <span className="block mt-0.5 text-[10px] italic opacity-80 border-l-2 border-orange-500/30 pl-2">
                  *Disclaimer: This is an algorithmic approximation and may not guarantee actual official eligibility.
                </span>
              </p>
            </div>
          </div>
          
          <div className="bg-muted/20 px-4 py-2 rounded-lg border border-border/50 min-w-[240px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold">Test CGPA</span>
              <span className="text-sm font-bold text-orange-500">{testCgpa.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="5" max="10" step="0.1" 
              value={testCgpa}
              onChange={(e) => setTestCgpa(parseFloat(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> 
            Eligible Companies ({eligibleCompanies.length})
          </h4>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted">
            {eligibleCompanies.length > 0 ? (
              eligibleCompanies.map((company, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border shadow-sm shrink-0">
                      <Building className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{company.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{company.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{company.package}</div>
                    <div className="text-[10px] text-muted-foreground">CGPA Cutoff: {company.minCgpa.toFixed(2)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-lg">
                No eligible companies found based on current criteria.
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-red-500/80 mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> 
            Not Eligible ({ineligibleCompanies.length})
          </h4>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted">
            {ineligibleCompanies.map((company, idx) => {
              const cgpaShortfall = company.minCgpa - testCgpa;
              const isBranchEligible = checkBranchEligible(company.branches, student.branch);
              const reason = !isBranchEligible
                ? `Requires: Top ${company.branches.length > 0 ? normalizeBranch(company.branches[0]) : 'Branches'}`
                : `Need +${cgpaShortfall.toFixed(2)} CGPA`;

              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-red-500/10 bg-red-500/5 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border shadow-sm shrink-0">
                      <Building className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{company.name}</div>
                      <div className="text-[10px] text-red-500/80 uppercase tracking-widest font-semibold">{reason}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-muted-foreground">{company.package}</div>
                    <div className="text-[10px] text-muted-foreground">CGPA Cutoff: {company.minCgpa.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
