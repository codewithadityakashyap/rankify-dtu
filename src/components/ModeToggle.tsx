"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`
        group relative flex items-center gap-2 px-3 py-1.5 rounded-full
        border transition-all duration-300 ease-out
        text-xs font-semibold tracking-wide
        ${isDark
          ? "bg-slate-800/80 border-slate-600/60 text-slate-200 hover:bg-slate-700 hover:border-cyan-500/50 hover:shadow-[0_0_14px_rgba(34,211,238,0.2)]"
          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-amber-400/70 hover:shadow-[0_0_14px_rgba(251,191,36,0.25)]"
        }
      `}
    >
      {/* Animated icon swap */}
      <span className="relative w-4 h-4">
        <Sun
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 text-amber-400
            ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}
        />
        <Moon
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 text-cyan-400
            ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
        />
      </span>

      {/* Label */}
      <span className={`hidden sm:inline transition-colors duration-200 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
