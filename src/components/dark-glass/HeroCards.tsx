"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Target, AlertTriangle } from "lucide-react";

interface HeroCardsProps {
  topper: any;
  mostImproved: any;
  mostConsistent: any;
  atRiskCount: number;
}

export function HeroCards({ topper, mostImproved, mostConsistent, atRiskCount }: HeroCardsProps) {
  const improvementValue = mostImproved?.computedDrop
    ? `+${Math.abs(mostImproved.computedDrop).toFixed(2)} SGPA`
    : "N/A";

  const cards = [
    {
      title: "Top Performer",
      value: topper?.cgpa ? `${parseFloat(topper.cgpa).toFixed(2)} CGPA` : "N/A",
      subtitle: topper?.name || "Computing...",
      valueColor: "text-slate-900 dark:text-slate-100",
      bg: "bg-white dark:bg-[#1E293B]/80",
      border: "border-indigo-200 dark:border-indigo-500/30",
      glow: "shadow-md dark:shadow-[0_0_18px_rgba(99,102,241,0.15)]",
      icon: <Trophy className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      iconBg: "bg-indigo-50 dark:bg-slate-900/50 border-indigo-100 dark:border-slate-700/50",
    },
    {
      title: "Most Improved",
      value: improvementValue,
      subtitle: mostImproved?.name || "Computing...",
      valueColor: "text-green-600 dark:text-green-400",
      bg: "bg-white dark:bg-[#1E293B]/80",
      border: "border-green-200 dark:border-green-500/30",
      glow: "shadow-md dark:shadow-[0_0_18px_rgba(34,197,94,0.15)]",
      icon: <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />,
      iconBg: "bg-green-50 dark:bg-slate-900/50 border-green-100 dark:border-slate-700/50",
    },
    {
      title: "Most Consistent",
      value: mostConsistent?.cgpa ? `${parseFloat(mostConsistent.cgpa).toFixed(2)} CGPA` : "N/A",
      subtitle: mostConsistent?.name || "Computing...",
      valueColor: "text-slate-900 dark:text-slate-100",
      bg: "bg-white dark:bg-[#1E293B]/80",
      border: "border-cyan-200 dark:border-cyan-500/30",
      glow: "shadow-md dark:shadow-[0_0_18px_rgba(34,211,238,0.15)]",
      icon: <Target className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      iconBg: "bg-cyan-50 dark:bg-slate-900/50 border-cyan-100 dark:border-slate-700/50",
    },
    {
      title: "Critical Alert",
      value: `${atRiskCount} Students`,
      subtitle: "CGPA < 7.0 (At Risk)",
      valueColor: "text-slate-900 dark:text-slate-100",
      bg: "bg-white dark:bg-[#1E293B]/80",
      border: "border-red-200 dark:border-red-500/30",
      glow: "shadow-md dark:shadow-[0_0_18px_rgba(239,68,68,0.15)]",
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      iconBg: "bg-red-50 dark:bg-slate-900/50 border-red-100 dark:border-slate-700/50",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06, duration: 0.25, ease: "easeOut" }}
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          style={{ willChange: "transform" }}
          className={`relative p-4 sm:p-5 rounded-2xl border backdrop-blur-xl overflow-hidden cursor-default transition-colors duration-300 ${card.bg} ${card.border} ${card.glow}`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-400 mb-1 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className={`text-xl sm:text-2xl font-bold ${card.valueColor}`}>
                {card.value}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-words leading-snug">
                {card.subtitle}
              </p>
            </div>
            <div className={`shrink-0 p-2.5 rounded-xl border ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
