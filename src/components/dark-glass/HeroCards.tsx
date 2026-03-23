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
  const cards = [
    {
      title: "Top Performer",
      value: topper?.cgpa ? `${topper.cgpa.toFixed(2)} CGPA` : "N/A",
      subtitle: topper?.name || "Computing...",
      icon: <Trophy className="w-6 h-6 text-indigo-400" />,
      glow: "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
      border: "border-indigo-500/30"
    },
    {
      title: "Most Improved",
      value: mostImproved?.computedDrop ? `+${(-mostImproved.computedDrop).toFixed(2)} SGPA` : "N/A",
      subtitle: mostImproved?.name || "Computing...",
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
      glow: "shadow-[0_0_20px_rgba(34,211,238,0.2)]",
      border: "border-cyan-500/30"
    },
    {
      title: "Most Consistent",
      value: mostConsistent?.cgpa ? `${mostConsistent.cgpa.toFixed(2)} CGPA` : "N/A",
      subtitle: mostConsistent?.name || "Computing...",
      icon: <Target className="w-6 h-6 text-green-400" />,
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.2)]",
      border: "border-green-500/30"
    },
    {
      title: "Critical Alert",
      value: `${atRiskCount} Students`,
      subtitle: "CGPA < 7.0 (At Risk)",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]",
      border: "border-red-500/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`relative p-6 rounded-2xl bg-[#1E293B]/80 backdrop-blur-xl border ${card.border} ${card.glow} overflow-hidden`}
        >
          {/* Glass Overlay Highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-100">{card.value}</h3>
              <p className="text-sm text-cyan-400/80 mt-1 break-words leading-snug">{card.subtitle}</p>
            </div>
            <div className={`p-3 rounded-xl bg-slate-900/50 backdrop-blur-md border border-slate-700`}>
              {card.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
