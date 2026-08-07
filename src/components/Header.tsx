'use client';

import Link from 'next/link';
import { ModeToggle } from '@/components/ModeToggle';
import { GlobalSearch } from '@/components/GlobalSearch';
import { Suspense } from 'react';
import { BatchSelector } from '@/components/dark-glass/BatchSelector';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSearchParams, usePathname } from 'next/navigation';

function BatchAwareLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const searchParams = useSearchParams();
  const batch = searchParams?.get('batch');
  const finalHref = batch && href === '/' ? `/?batch=${batch}` : href;

  return (
    <Link href={finalHref} className={className}>
      {children}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const showBatchSelector = pathname === '/' || pathname.startsWith('/branch');
  const logoContent = (
    <>
      <img
        src="/logo.png"
        alt="Rankify DTU Logo"
        className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-md"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <div className="hidden w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-primary text-white flex items-center justify-center font-bold text-lg sm:text-xl">
        R
      </div>
      <h1 className="flex flex-col sm:flex-row sm:items-baseline leading-none sm:leading-normal text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        <span>Rankify</span>
        <span className="text-[10px] sm:text-xl text-primary font-bold sm:font-light sm:ml-1 uppercase tracking-wider sm:tracking-normal sm:normal-case mt-0.5 sm:mt-0">
          DTU
        </span>
      </h1>
    </>
  );

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm sticky top-0 z-50 transition-colors" style={{ transform: 'translateZ(0)' }}>
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Suspense fallback={<Link href="/" className="flex items-center gap-2 sm:gap-3">{logoContent}</Link>}>
          <BatchAwareLink href="/" className="flex items-center gap-2 sm:gap-3">
            {logoContent}
          </BatchAwareLink>
        </Suspense>

        {/* Right side — Links + premium batch badge + theme toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-5 mr-2">
            <Suspense fallback={<Link href="/" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Home</Link>}>
              <BatchAwareLink href="/" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                Home
              </BatchAwareLink>
            </Suspense>
            <Link
              href="/placement"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Placements
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/subjects"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Subject Analysis
            </Link>
            <Link
              href="/rank-estimator"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              Rank Estimator
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors focus:outline-none">
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
            <Link
              href="/report-discrepancy"
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-full shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Report Discrepancy
            </Link>
          </div>
          
          <Suspense fallback={<div className="w-8 h-8 sm:w-48 sm:h-9 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />}>
            <GlobalSearch />
          </Suspense>

          {/* Premium Batch Selector */}
          <div className="hidden md:flex items-center">
            {showBatchSelector && (
              <Suspense fallback={<div className="w-20 h-8 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg" />}>
                <BatchSelector isHeader={true} />
              </Suspense>
            )}
          </div>

          <ModeToggle />

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 -mr-2 text-slate-600 dark:text-slate-300">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Suspense fallback={<Link href="/" className="w-full cursor-pointer">Home</Link>}>
                    <BatchAwareLink href="/" className="w-full cursor-pointer">Home</BatchAwareLink>
                  </Suspense>
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
                  <Link href="/rank-estimator" className="w-full cursor-pointer">Rank Estimator</Link>
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
