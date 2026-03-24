"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="group flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-[#E2E8F0] rounded-full border border-slate-300 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:border-blue-400 dark:hover:border-cyan-500/50 hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
    >
      <ArrowLeft className="w-4 h-4 text-blue-500 dark:text-cyan-400 group-hover:-translate-x-1 transition-transform duration-300" />
      <span className="text-sm font-medium tracking-wide">Back to Home</span>
    </button>
  );
}
