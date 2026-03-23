"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    const SESSION_KEY = "rankify_visit_counted";
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

    if (!alreadyCounted) {
      // First load in this browser session → increment
      fetch("/api/visits", { method: "POST" })
        .then(r => r.json())
        .then(d => {
          setVisits(d.count);
          sessionStorage.setItem(SESSION_KEY, "1");
        })
        .catch(() => {
          // Fallback: just read without incrementing
          fetch("/api/visits")
            .then(r => r.json())
            .then(d => setVisits(d.count))
            .catch(() => {});
        });
    } else {
      // Already counted this session → just read
      fetch("/api/visits")
        .then(r => r.json())
        .then(d => setVisits(d.count))
        .catch(() => {});
    }
  }, []);

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto animate-in fade-in duration-1000">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center gap-2">
        <p className="text-slate-900 dark:text-slate-200">
          Developed &amp; Maintained by{" "}
          <a
            href="https://www.linkedin.com/in/aditya-raj-054bb1205/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:text-blue-700 dark:hover:text-blue-400 hover:underline underline-offset-4 transition-all duration-300"
          >
            Aditya Raj
          </a>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Rankify DTU. All rights reserved.
        </p>

        {/* Live Visit Counter */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/50 w-full max-w-[200px] flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Total Visits
          </span>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-200 font-mono font-semibold text-sm tracking-widest">
              {visits === null ? (
                <span className="opacity-40 animate-pulse">———</span>
              ) : (
                visits.toLocaleString()
              )}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
