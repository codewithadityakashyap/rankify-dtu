"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import logosMap from '@/data/logos.json';

interface Recruiter {
  name: string;
  logoFile: string; // filename in /public/logos/ (e.g. "amazon.svg")
  tier?: "top";
}

const RECRUITERS: Recruiter[] = [
  { name: "Amazon",            logoFile: "amazon.svg",          tier: "top" },
  { name: "Google",            logoFile: "google.svg",          tier: "top" },
  { name: "Microsoft",         logoFile: "microsoft.svg",       tier: "top" },
  { name: "Adobe",             logoFile: "adobe.svg" },
  { name: "Salesforce",        logoFile: "salesforce.svg" },
  { name: "Flipkart",          logoFile: "flipkart.svg" },
  { name: "Uber",              logoFile: "uber.svg" },
  { name: "Expedia",           logoFile: "expedia.svg" },
  { name: "Meesho",            logoFile: "meesho.svg" },
  { name: "Sprinklr",          logoFile: "sprinklr.svg" },
  { name: "UnifyApps",         logoFile: "unifyapps.svg" },
  { name: "Cvent",             logoFile: "cvent.svg" },
  { name: "Magicpin",          logoFile: "magicpin.svg" },
  { name: "Oracle",            logoFile: "oracle.svg" },
  { name: "Cisco",             logoFile: "cisco.svg" },
  { name: "Optum",             logoFile: "optum.svg" },
  { name: "Goldman Sachs",     logoFile: "goldmansachs.svg" },
  { name: "Bain & Company",    logoFile: "bain.svg" },
  { name: "KPMG",              logoFile: "kpmg.svg" },
  { name: "ZS Associates",     logoFile: "zsassociates.svg" },
  { name: "BlackRock",         logoFile: "blackrock.svg" },
  { name: "JPMC",              logoFile: "jpmorgan.svg" },
  { name: "Texas Instruments", logoFile: "texasinstruments.svg" },
  { name: "Qualcomm",          logoFile: "qualcomm.svg" },
  { name: "NXP Semiconductor", logoFile: "nxp.svg" },
  { name: "ExxonMobil",        logoFile: "exxonmobil.svg" },
  { name: "Schlumberger",      logoFile: "schlumberger.svg" },
];

function LogoCard({ recruiter }: { recruiter: Recruiter }) {
  const [imgError, setImgError] = useState(false);
  
  const baseName = recruiter.logoFile.replace(/\.svg$/, '');
  const mappedFile = (logosMap as Record<string, string>)[baseName];
  const src = mappedFile ? `/logos/${mappedFile}` : `/logos/${baseName}.svg`;

  return (
    <div
      className="group relative flex flex-col items-center justify-center gap-2.5 px-5 py-4 rounded-2xl select-none cursor-default
        bg-slate-100 dark:bg-white/[0.04]
        hover:bg-slate-200 dark:hover:bg-white/[0.08]
        border border-slate-200 dark:border-white/[0.06]
        shadow-sm dark:shadow-[0_2px_16px_rgba(0,0,0,0.15)]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:scale-[1.04] hover:shadow-md dark:hover:shadow-[0_6px_24px_rgba(34,211,238,0.12)]"
      title="Hired students in 2026 placements"
      style={{ minWidth: 100 }}
    >
      {/* Top-tier ring pulse */}
      {recruiter.tier === "top" && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
        </span>
      )}

      {/* Subtle radial glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 70%)" }}
      />

      {/* Logo */}
      <div className="w-10 h-10 flex items-center justify-center shrink-0">
        {!imgError ? (
          <img
            src={src}
            alt={recruiter.name}
            onError={() => setImgError(true)}
            className="w-9 h-9 object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs">
            {recruiter.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name */}
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100 text-center leading-tight transition-colors duration-200 max-w-[88px] truncate">
        {recruiter.name}
      </span>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: Recruiter[]; reverse?: boolean }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items]; // duplicate for seamless loop

  const animationStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    animation: `marquee${reverse ? "Rev" : ""} 40s linear infinite`,
    animationPlayState: paused ? "paused" : "running",
    willChange: "transform",
  };

  return (
    <div
      className="overflow-hidden w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={animationStyle}>
        {doubled.map((r, i) => (
          <LogoCard key={`${r.name}-${i}`} recruiter={r} />
        ))}
      </div>
    </div>
  );
}

export function TopRecruiters() {
  const row1 = RECRUITERS.slice(0, 14);
  const row2 = RECRUITERS.slice(14);

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden bg-[#F0F4FF] dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800/50">
      {/* Ambient background glow — subtle in light, stronger in dark */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-64 bg-blue-400/5 dark:bg-cyan-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-64 bg-indigo-400/5 dark:bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] text-blue-500 dark:text-cyan-400/80 uppercase mb-3">
            Placement Network
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Top Recruiters at DTU
          </h2>
          <p className="text-slate-500 dark:text-slate-500 text-sm max-w-md mx-auto">
            Companies that hired students from the 2022 batch dataset
          </p>
        </motion.div>
      </div>

      {/* Marquee Row 1 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-3"
      >
        <MarqueeRow items={row1} />
      </motion.div>

      {/* Marquee Row 2 — reversed */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <MarqueeRow items={row2} reverse />
      </motion.div>

      {/* Edge fade masks — match bg per theme using CSS custom properties trick */}
      <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-[#F0F4FF] dark:from-[#0B1120] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#F0F4FF] dark:from-[#0B1120] to-transparent pointer-events-none z-10" />

      {/* Marquee keyframe styles */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRev {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
