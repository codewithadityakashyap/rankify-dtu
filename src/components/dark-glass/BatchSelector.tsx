'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Crown, Sparkles, CheckCircle2 } from 'lucide-react';

const BATCHES = ['2027', '2028', '2029'];

export function BatchSelector({ isHeader = false }: { isHeader?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let currentBatch = searchParams.get('batch');
  
  if (!currentBatch) {
    if (pathname.startsWith('/student/')) {
      try {
        const rollMatch = pathname.match(/\/student\/([^/?]+)/);
        if (rollMatch && rollMatch[1]) {
          const decodedRoll = decodeURIComponent(rollMatch[1]).toUpperCase();
          const isLateralEntry2027 = /^(?:24|2K24)\/BT\/5\d{2}$/.test(decodedRoll);
          
          if (decodedRoll.startsWith('23/') || decodedRoll.startsWith('2K23/') || isLateralEntry2027) {
            currentBatch = '2027';
          } else if (decodedRoll.startsWith('24/') || decodedRoll.startsWith('2K24/')) {
            currentBatch = '2028';
          }
        }
      } catch (e) {
        // ignore
      }
    }
    currentBatch = currentBatch || '2027';
  }
  const handleBatchSelect = (batch: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('batch', batch);
    // Reset page to 1 when changing batch if applicable
    if (params.has('page')) params.set('page', '1');
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    
    // Smooth scroll to the branch selector on the homepage
    if (pathname === '/') {
      setTimeout(() => {
        const dashboardEl = document.getElementById('dashboard');
        if (dashboardEl) {
          dashboardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  return (
    <div className={`relative group inline-flex flex-col gap-2 z-40 w-full sm:w-auto mx-auto sm:mx-0 ${!isHeader ? 'mb-6 max-w-sm sm:max-w-max' : ''}`}>
      
      <div className={`flex items-center w-full sm:w-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden ${isHeader ? 'p-1 rounded-xl' : 'p-1.5 rounded-2xl'}`}>
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start">
          {BATCHES.map((batch) => {
            const isActive = currentBatch === batch;
            
            return (
              <button
                key={batch}
                onClick={() => handleBatchSelect(batch)}
                className={`relative flex-1 sm:flex-none font-bold transition-all duration-300 z-10 flex items-center justify-center gap-1.5 ${
                  isActive 
                    ? 'text-white shadow-[0_4px_20px_-4px_rgba(59,130,246,0.5)]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                } ${isHeader ? 'text-xs px-2 sm:px-3 py-1.5 rounded-lg' : 'text-sm px-4 sm:px-6 py-2.5 rounded-xl'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId={isHeader ? "batch-active-bg-header" : "batch-active-bg"}
                    className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 ${isHeader ? 'rounded-lg' : 'rounded-xl'}`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-1">
                  {batch}
                  {isActive && <Sparkles className={`text-blue-200 hidden sm:inline-block ${isHeader ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
