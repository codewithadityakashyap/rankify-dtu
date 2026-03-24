"use client";

import { motion } from "framer-motion";

interface RankBadgeProps {
  rank: number;
  rowIndex?: number;
}

export function RankBadge({ rank, rowIndex = 0 }: RankBadgeProps) {
  const topStyles: Record<number, { bg: string; text: string; glow: string; label: string }> = {
    1: {
      bg: "bg-gradient-to-br from-yellow-100 dark:from-yellow-400/30 to-amber-50 dark:to-amber-500/10 border-yellow-300 dark:border-yellow-400/60",
      text: "text-yellow-700 dark:text-yellow-300 font-bold",
      glow: "shadow-[0_2px_8px_rgba(250,204,21,0.25)] dark:shadow-[0_0_14px_rgba(250,204,21,0.4)]",
      label: "🥇",
    },
    2: {
      bg: "bg-gradient-to-br from-slate-200 dark:from-slate-300/20 to-slate-100 dark:to-slate-400/10 border-slate-300 dark:border-slate-400/50",
      text: "text-slate-700 dark:text-slate-200 font-bold",
      glow: "shadow-[0_2px_6px_rgba(100,116,139,0.2)] dark:shadow-[0_0_10px_rgba(203,213,225,0.3)]",
      label: "🥈",
    },
    3: {
      bg: "bg-gradient-to-br from-orange-100 dark:from-orange-400/20 to-amber-50 dark:to-orange-600/10 border-orange-300 dark:border-orange-400/50",
      text: "text-orange-700 dark:text-orange-300 font-bold",
      glow: "shadow-[0_2px_6px_rgba(251,146,60,0.2)] dark:shadow-[0_0_10px_rgba(251,146,60,0.3)]",
      label: "🥉",
    },
  };

  const isTopThree = rank <= 3;
  const top = topStyles[rank];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(rowIndex * 0.01, 0.4), duration: 0.3, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      className={`
        inline-flex items-center justify-center gap-1 min-w-[52px] h-8
        rounded-lg border px-2 text-sm select-none cursor-default
        transition-all duration-300
        ${isTopThree
          ? `${top.bg} ${top.text} ${top.glow}`
          : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400"
        }
      `}
    >
      {isTopThree && <span className="text-xs leading-none">{top.label}</span>}
      <span className={isTopThree ? "text-xs font-bold tracking-wide" : "text-xs font-medium"}>{rank}</span>
    </motion.div>
  );
}
