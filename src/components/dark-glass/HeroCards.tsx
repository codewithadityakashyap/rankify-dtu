"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Target, AlertTriangle } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });


interface HeroCardsProps {
  topper: any;
  mostImproved: any;
  mostConsistent: any;
  atRiskCount: number;
}

// Helper to convert ALL CAPS to proper Title Case
function toTitleCase(str: string) {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function HeroCards({ topper, mostImproved, mostConsistent, atRiskCount }: HeroCardsProps) {
  const improvementValue = mostImproved?.computedDrop
    ? `+${Math.abs(mostImproved.computedDrop).toFixed(2)} SGPA`
    : "N/A";

  const cards = [
    {
      id: "topper",
      isTopper: true,
      cgpa: topper?.cgpa ? `${parseFloat(topper.cgpa).toFixed(2)} CGPA` : "N/A",
      name: topper?.name ? toTitleCase(topper.name) : "Computing...",
    },
    {
      id: "improved",
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
      id: "consistent",
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
      id: "risk",
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
    <>
      <style>{`
        @keyframes shimmer-gold {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float-crown {
          0%, 100% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.6)); }
          50% { transform: translateY(-5px) rotate(5deg); filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.9)); }
        }
        .gold-shimmer-text {
          background: linear-gradient(90deg, #B48608, #D4AF37, #996515, #B48608);
          background-size: 200% auto;
          animation: shimmer-gold 4s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.05));
        }
        .dark .gold-shimmer-text {
          background: linear-gradient(90deg, #FFD700, #FACC15, #EAB308, #FFD700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 4px rgba(250, 204, 21, 0.2));
        }
        .float-crown {
          animation: float-crown 2s ease-in-out infinite;
          display: inline-block;
        }
        .topper-card-bg {
          background: linear-gradient(135deg, rgba(250,204,21,0.08), rgba(99,102,241,0.08));
          border: 1px solid rgba(250,204,21,0.3);
        }
        .dark .topper-card-bg {
          background: linear-gradient(135deg, rgba(250,204,21,0.05), rgba(99,102,241,0.05));
          border: 1px solid rgba(250,204,21,0.2);
        }
      `}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => {
          if (card.isTopper) {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.35, ease: "easeOut" }}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{ willChange: "transform" }}
                className="relative p-4 sm:p-5 rounded-2xl backdrop-blur-xl overflow-hidden cursor-default transition-all duration-300 topper-card-bg shadow-[0_8px_20px_rgba(250,204,21,0.08)] dark:shadow-[0_8px_20px_rgba(250,204,21,0.12)] hover:shadow-[0_15px_30px_rgba(250,204,21,0.2)] dark:hover:shadow-[0_15px_30px_rgba(250,204,21,0.2)] flex flex-col justify-center min-h-[110px]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/60 dark:via-yellow-300/40 to-transparent" />
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-xl transform rotate-12" />
                </div>
                <div className="relative z-10 flex flex-col items-start w-full">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl sm:text-2xl leading-none">👑</span>
                    <p className="text-[11px] sm:text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest pl-0.5">
                      Top Performer
                    </p>
                  </div>
                  <h3 
                    className={`${playfair.className} text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none my-0 sm:-mt-1 pb-1 w-full truncate`}
                  >
                    {card.name}
                  </h3>
                  <p className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white drop-shadow-sm mt-0 sm:mt-1">
                    {card.cgpa}
                  </p>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.25, ease: "easeOut" }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: "transform" }}
              className={`relative p-4 sm:p-5 rounded-2xl border backdrop-blur-xl overflow-hidden cursor-default transition-colors duration-300 flex flex-col justify-center min-h-[110px] ${card.bg} ${card.border} ${card.glow}`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent" />
              <div className="flex items-start justify-between gap-3 w-full">
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
          );
        })}
      </div>
    </>
  );
}
