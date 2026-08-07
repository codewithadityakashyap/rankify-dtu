'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { Search, Loader2, User, Building, GraduationCap, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = React.useState<{ students: any[]; placements: any[] }>({ students: [], placements: [] });
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => setQuery(''), 150); // slight delay to allow smooth close animation
    }
  }, [open]);

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const searchParams = useSearchParams();
  const currentBatch = searchParams?.get('batch') || '2027';

  React.useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.length < 2) {
        setResults({ students: [], placements: [] });
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&batch=${currentBatch}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [debouncedQuery]);

  const onSelectStudent = (rollNumber: string) => {
    setOpen(false);
    // Navigate directly to the student profile card smoothly
    router.push(`/student/${encodeURIComponent(rollNumber)}`);
  };

  const onSelectPlacement = (company: string) => {
    setOpen(false);
    router.push(`/placement?company=${encodeURIComponent(company)}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 rounded-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden ring-1 ring-black/5 dark:ring-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Search className="h-4 w-4 text-indigo-500 dark:text-indigo-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
        <span className="hidden sm:inline-flex relative z-10 bg-gradient-to-r from-slate-800 to-slate-500 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-semibold tracking-wide">Explore Data...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 rounded border border-indigo-100 dark:border-indigo-800 shadow-sm relative z-10">
          <span className="text-xs">⌘</span>K
        </kbd>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-[1.5s] ease-in-out transition-transform bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent skew-x-12 z-0"></div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border overflow-hidden flex flex-col" style={{ maxHeight: '70vh' }}>
            <Command label="Global Search" className="flex flex-col w-full h-full bg-transparent" shouldFilter={false}>
              <div className="flex items-center px-4 border-b">
                <Search className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                <Command.Input
                  autoFocus
                  placeholder="Type your name, Roll number, or company name..."
                  className="flex-1 h-12 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/80"
                  value={query}
                  onValueChange={setQuery}
                />
                {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground ml-2 shrink-0" />}
                <button
                  onClick={() => setOpen(false)}
                  className="ml-2 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Close search"
                >
                  <span className="text-[10px] font-semibold hidden sm:inline-block">ESC</span>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Command.List className="overflow-y-auto p-2">
                {query.length > 0 && !loading && results.students.length === 0 && results.placements.length === 0 && (
                  <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                    No results found.
                  </Command.Empty>
                )}

                {results.students.length > 0 && (
                  <Command.Group heading="Students" className="px-2 text-xs font-medium text-muted-foreground mb-2">
                    {results.students.map((student) => (
                      <Command.Item
                        key={student.rollNumber}
                        onSelect={() => onSelectStudent(student.rollNumber)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                      >
                        <User className="h-4 w-4 text-primary" />
                        <div className="flex flex-col">
                          <span className="font-medium">{student.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {student.rollNumber} • {student.branch} • CGPA: {student.cgpa}
                          </span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {results.placements.length > 0 && (
                  <Command.Group heading="Placements & Companies" className="px-2 text-xs font-medium text-muted-foreground mb-2 mt-4">
                    {results.placements.map((placement, i) => (
                      <Command.Item
                        key={`\${placement.company}-\${i}`}
                        onSelect={() => onSelectPlacement(placement.company)}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800"
                      >
                        <Building className="h-4 w-4 text-emerald-500" />
                        <div className="flex flex-col">
                          <span className="font-medium">{placement.company}</span>
                          <span className="text-xs text-muted-foreground">
                            {placement.role} • {placement.name} • {placement.ctc} LPA
                          </span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </div>
          
          {/* Backdrop click to close */}
          <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
