"use client";

import { motion } from "framer-motion";

interface RankBadgeProps {
  rank: number;
  rowIndex?: number;
}

export function RankBadge({ rank, rowIndex = 0 }: RankBadgeProps) {
  const topStyles: Record<number, { bg: string; text: string; glow: string; label: string }> = {
    1: {
      bg: "bg-gradient-to-br from-yellow-400/30 to-amber-500/10 border-yellow-400/60",
      text: "text-yellow-300 font-bold",
      glow: "shadow-[0_0_14px_rgba(250,204,21,0.4)]",
      label: "🥇",
    },
    2: {
      bg: "bg-gradient-to-br from-slate-300/20 to-slate-400/10 border-slate-400/50",
      text: "text-slate-200 font-bold",
      glow: "shadow-[0_0_10px_rgba(203,213,225,0.3)]",
      label: "🥈",
    },
    3: {
      bg: "bg-gradient-to-br from-orange-400/20 to-orange-600/10 border-orange-400/50",
      text: "text-orange-300 font-bold",
      glow: "shadow-[0_0_10px_rgba(251,146,60,0.3)]",
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
          : "bg-slate-800/60 border-slate-700/50 text-slate-400"
        }
      `}
    >
      {isTopThree && <span className="text-xs leading-none">{top.label}</span>}
      <span className={isTopThree ? "text-xs font-bold tracking-wide" : "text-xs font-medium"}>{rank}</span>
    </motion.div>
  );
}
