"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
    <div className={cn("relative w-full overflow-hidden py-4", className)}>
      {/* Scrollable Container with Hidden Scrollbar */}
      <div
        ref={scrollContainerRef}
        className="flex lg:justify-center overflow-x-auto scroll-smooth px-4 lg:px-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
