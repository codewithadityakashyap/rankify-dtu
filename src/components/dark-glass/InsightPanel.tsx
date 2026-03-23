"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function InsightPanel({ data, kpi }: { data?: any[], kpi?: any }) {
  if (!kpi || !data) return null;

  const riskPrecent = ((kpi.atRiskCount / (kpi.totalStudents || 1)) * 100).toFixed(1);

  const insights = [
    `The BT branch currently has ${kpi.totalStudents || 'several'} competitive students tracked in the system.`,
    `Top performers are maintaining a CGPA of >9.0, led by ${kpi.topper?.name} at ${parseFloat(kpi.topper?.cgpa).toFixed(2)}.`,
    `${kpi.mostImproved?.name} demonstrated the highest academic resilience with an SGPA improvement of +${(-kpi.mostImproved?.computedDrop).toFixed(2)}.`
  ];

  if (parseFloat(riskPrecent) > 0) {
    insights.push(`Attention: ${riskPrecent}% of the branch (${kpi.atRiskCount} students) are currently at academic risk (CGPA < 7.0).`);
  } else {
    insights.push(`Excellent standing: 0% of students are considered at academic risk.`);
  }

  return (
    <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.05)] p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
      
      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        AI Insights Panel
      </h3>
      
      <div className="flex flex-col gap-2.5">
        {insights.map((text, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm font-medium text-slate-300 leading-relaxed shadow-inner"
          >
            <span className="text-cyan-400 mr-2">{"▸"}</span>
            {text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
