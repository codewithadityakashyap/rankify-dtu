"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="group flex items-center gap-2 px-4 py-2 bg-[#1E293B] hover:bg-slate-800 text-[#E2E8F0] rounded-full border border-slate-700/50 shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-cyan-500/50"
    >
      <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform duration-300" />
      <span className="text-sm font-medium tracking-wide">Back to Home</span>
    </button>
  );
}
