'use client';

import Link from 'next/link';
import { ModeToggle } from '@/components/ModeToggle';

export function Header() {
  return (
    <header className="bg-white dark:bg-slate-900 border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Rankify DTU Logo"
            className="w-10 h-10 object-contain rounded-md"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center font-bold text-xl">
            R
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Rankify <span className="text-primary font-light">DTU</span>
          </h1>
        </Link>

        {/* Right side — Links + premium batch badge + theme toggle */}
        <div className="flex items-center gap-4">
          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/placement"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Placement Statistics
            </Link>
          </div>

          {/* Mobile Links */}
          <div className="flex sm:hidden items-center gap-2 mr-1">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/placement"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Placements
            </Link>
          </div>

          {/* Premium "2027 Batch Results" badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 dark:bg-primary/10 dark:border-primary/40 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-primary/90 dark:text-primary whitespace-nowrap">
              2027 Batch
            </span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
