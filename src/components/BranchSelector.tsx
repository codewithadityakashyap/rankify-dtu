"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// Strict list of branches as requested
export const STRICT_BRANCHES = [
  "All", "AE", "BT", "CE", "CH", "CS", "EC", "EE", "EP", "EN", "IT", "MC", "ME", "PE", "SE"
];

export interface BranchSelectorProps {
  branches?: string[];
  selectedBranch: string;
  onSelect: (branch: string) => void;
  className?: string;
}

export function BranchSelector({
  branches = STRICT_BRANCHES,
  selectedBranch,
  onSelect,
  className,
}: BranchSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTabElement, setActiveTabElement] = useState<HTMLButtonElement | null>(null);

  // Auto-scroll logic for mobile
  useEffect(() => {
    if (activeTabElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft =
        activeTabElement.offsetLeft -
        container.offsetWidth / 2 +
        activeTabElement.offsetWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [selectedBranch, activeTabElement]);

  const handleSelect = (branch: string, el: HTMLButtonElement) => {
    // Premium Haptic feedback (supported on many mobile browsers)
    if (typeof window !== "undefined" && typeof window.navigator !== "undefined" && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(50); // Light tap
      } catch (e) {
        // Ignore if vibrate is not supported/allowed
      }
    }
    setActiveTabElement(el);
    onSelect(branch);
  };

  return (
    <div className={cn("relative w-full py-4 flex justify-center", className)}>
      {/* Mobile Dropdown (Hidden on Desktop) */}
      <div className="md:hidden w-full max-w-[280px] mx-auto px-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between bg-white dark:bg-[#1E293B] px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm outline-none transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500">
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-base tracking-tight">
              Branch: <span className="text-blue-600 dark:text-cyan-400 font-bold ml-1">{selectedBranch}</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-[264px] max-h-[350px] overflow-y-auto rounded-2xl shadow-2xl border-slate-200/80 dark:border-slate-700/80 p-1.5 backdrop-blur-xl bg-white/95 dark:bg-[#0F172A]/95">
            {branches.map((branch) => (
              <DropdownMenuItem 
                key={branch} 
                onClick={(e) => {
                   if (typeof window !== "undefined" && typeof window.navigator !== "undefined" && window.navigator.vibrate) {
                     try { window.navigator.vibrate(50); } catch (err) {}
                   }
                   onSelect(branch);
                }} 
                className={cn(
                  "cursor-pointer font-semibold py-3 px-4 rounded-xl my-0.5 text-[15px] transition-colors",
                  selectedBranch === branch 
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                )}
              >
                {branch === 'All' ? '🌟 All Branches' : `📚 ${branch} Analytics`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Scrollable Pills (Hidden on Mobile) */}
      <div
        ref={scrollContainerRef}
        className="hidden md:flex lg:justify-center w-full overflow-x-auto scroll-smooth px-4 lg:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex items-center gap-1.5 lg:gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-300/50 dark:border-slate-700/50 shadow-inner backdrop-blur-xl">
          {branches.map((branch) => {
            const isActive = selectedBranch === branch;

            return (
              <button
                key={branch}
                ref={(el) => {
                  if (isActive && el && !activeTabElement) {
                    setActiveTabElement(el);
                  }
                }}
                onClick={(e) => handleSelect(branch, e.currentTarget)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "text-white dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200/80 dark:hover:text-slate-100 dark:hover:bg-slate-700/80"
                )}
                aria-selected={isActive}
                role="tab"
              >
                {/* Active Slider Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeBranchIndicator"
                    className="absolute inset-0 bg-blue-600 dark:bg-blue-600 rounded-full shadow-md"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                      mass: 0.8,
                    }}
                  />
                )}
                
                {/* Text (lifted above background) */}
                <span className="relative z-10 flex items-center justify-center whitespace-nowrap">
                  {branch}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
