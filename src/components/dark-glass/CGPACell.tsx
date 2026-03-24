"use client";

import { motion } from "framer-motion";

interface CGPACellProps {
  value: number;
  isTop?: boolean;
  rowIndex?: number;
}

export function CGPACell({ value, isTop = false, rowIndex = 0 }: CGPACellProps) {
  const getStyle = () => {
    if (value >= 9.0) return {
      bg: "bg-gradient-to-br from-cyan-100 dark:from-cyan-500/20 to-emerald-50 dark:to-emerald-500/10",
      border: "border-cyan-300 dark:border-cyan-400/60",
      text: "text-cyan-700 dark:text-cyan-300",
      glow: "shadow-[0_2px_8px_rgba(34,211,238,0.2)] dark:shadow-[0_0_20px_rgba(34,211,238,0.35)]",
      pulse: isTop,
    };
    if (value >= 8.0) return {
      bg: "bg-gradient-to-br from-indigo-100 dark:from-indigo-500/20 to-purple-50 dark:to-purple-500/10",
      border: "border-indigo-300 dark:border-indigo-400/60",
      text: "text-indigo-700 dark:text-indigo-300",
      glow: "shadow-[0_2px_6px_rgba(99,102,241,0.15)] dark:shadow-[0_0_12px_rgba(99,102,241,0.25)]",
      pulse: false,
    };
    if (value >= 7.0) return {
      bg: "bg-slate-100 dark:bg-slate-700/40",
      border: "border-slate-300 dark:border-slate-500/50",
      text: "text-slate-600 dark:text-slate-200",
      glow: "",
      pulse: false,
    };
    return {
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-300 dark:border-red-500/50",
      text: "text-red-600 dark:text-red-400",
      glow: "shadow-[0_0_12px_rgba(239,68,68,0.1)] dark:shadow-[0_0_12px_rgba(239,68,68,0.2)]",
      pulse: false,
    };
  };

  const style = getStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rowIndex * 0.015, duration: 0.35, ease: "easeOut" }}
      whileHover={{ scale: 1.06 }}
      className={`
        relative flex items-center justify-center
        min-w-[90px] w-full h-9
        rounded-xl px-3 py-1.5
        border backdrop-blur-sm cursor-default
        transition-all duration-300 ease-in-out
        ${style.bg} ${style.border} ${style.glow}
        ${style.pulse ? "animate-pulse-slow" : ""}
      `}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent rounded-t-xl" />
      <span className={`text-sm font-bold tracking-wide ${style.text}`}>
        {value ? value.toFixed(2) : "—"}
      </span>
      {isTop && (
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"
        />
      )}
    </motion.div>
  );
}
