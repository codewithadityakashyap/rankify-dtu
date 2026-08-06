'use client';

import Link from 'next/link';
import { ModeToggle } from '@/components/ModeToggle';
import { GlobalSearch } from '@/components/GlobalSearch';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-40 transition-colors">
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
        <div className="flex items-center gap-2 sm:gap-4">
          <GlobalSearch />
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
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
              Placements
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Subject Analysis
            </Link>
            <Link
              href="/report-discrepancy"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
            >
              Report Discrepancy
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors focus:outline-none">
                  Compare
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/compare-students" className="w-full cursor-pointer">Compare Students</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/compare-branches" className="w-full cursor-pointer">Compare Branches</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Premium "2027 Batch Results" badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 dark:bg-primary/10 dark:border-primary/40 shadow-sm ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-primary/90 dark:text-primary whitespace-nowrap">
              2027 Batch
            </span>
          </div>

          <ModeToggle />

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 -mr-2 text-slate-600 dark:text-slate-300">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/" className="w-full cursor-pointer">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/placement" className="w-full cursor-pointer">Placements</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blog" className="w-full cursor-pointer">Insights</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subjects" className="w-full cursor-pointer">Subject Analysis</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/report-discrepancy" className="w-full cursor-pointer text-orange-500">Report Discrepancy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/compare-students" className="w-full cursor-pointer">Compare Students</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/compare-branches" className="w-full cursor-pointer">Compare Branches</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about" className="w-full cursor-pointer">About</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
