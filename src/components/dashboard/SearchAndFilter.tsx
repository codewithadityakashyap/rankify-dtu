import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  branch: string;
  setBranch: (val: string) => void;
  academicStatus: string;
  setAcademicStatus: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  onReset: () => void;
  branches: string[];
}

export function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  branch,
  setBranch,
  academicStatus,
  setAcademicStatus,
  sort,
  setSort,
  onReset,
  branches
}: SearchAndFilterProps) {
  const isFiltered = searchQuery.length > 0 || branch !== 'All' || academicStatus !== 'All' || sort !== 'rank_asc';

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row items-center p-1.5 gap-2 bg-card rounded-2xl border shadow-sm w-full transition-all focus-within:ring-2 focus-within:ring-primary/20">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full flex items-center bg-muted/30 rounded-xl px-3 transition-colors focus-within:bg-background h-12">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <Input
            placeholder="Search roll number or name..."
            className="border-0 shadow-none bg-transparent focus-visible:ring-0 h-full px-0 flex-1 text-[15px] placeholder:text-muted-foreground/70"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Desktop Divider */}
        <div className="hidden md:block w-px h-8 bg-border/60 mx-1"></div>
        
        {/* Filters Container */}
        <div className="flex w-full md:w-auto items-center overflow-x-auto pb-1 md:pb-0 scrollbar-none snap-x border-t md:border-t-0 border-border/40 mt-1 md:mt-0 pt-1 md:pt-0">
          <Select value={branch} onValueChange={(val) => setBranch(val || 'All')}>
            <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-muted/50 font-medium h-10 rounded-xl transition-colors whitespace-nowrap focus:ring-0 snap-start shrink-0 text-sm">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg">
              <SelectItem value="All" className="font-medium">All Branches</SelectItem>
              {branches.map((b: string) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-5 bg-border/60 mx-1 shrink-0"></div>

          <Select value={academicStatus} onValueChange={(val) => setAcademicStatus(val || 'All')}>
            <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-muted/50 font-medium h-10 rounded-xl transition-colors whitespace-nowrap focus:ring-0 snap-start shrink-0 text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg">
              <SelectItem value="All" className="font-medium">All Status</SelectItem>
              <SelectItem value="No Backlogs">No Backlogs</SelectItem>
              <SelectItem value="Has Active Backlogs">Active Backlogs</SelectItem>
              <SelectItem value="Cleared Through Revised Results">Cleared Results</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-px h-5 bg-border/60 mx-1 shrink-0"></div>

          <Select value={sort} onValueChange={(val) => setSort(val || 'rank_asc')}>
            <SelectTrigger className="border-0 bg-transparent shadow-none hover:bg-muted/50 font-medium h-10 rounded-xl transition-colors whitespace-nowrap focus:ring-0 snap-start shrink-0 text-sm">
              <SelectValue placeholder="Sort By">
                {sort === 'rank_asc' && 'Rank (Top First)'}
                {sort === 'rank_desc' && 'Rank (Lowest First)'}
                {sort === 'cgpa_desc' && 'CGPA (High to Low)'}
                {sort === 'cgpa_asc' && 'CGPA (Low to High)'}
                {sort === 'name_asc' && 'Name (A-Z)'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg">
              <SelectItem value="rank_asc" className="font-medium">Rank (Top First)</SelectItem>
              <SelectItem value="rank_desc">Rank (Lowest First)</SelectItem>
              <SelectItem value="cgpa_desc" className="font-medium">CGPA (High to Low)</SelectItem>
              <SelectItem value="cgpa_asc">CGPA (Low to High)</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {isFiltered && (
            <div className="flex items-center">
              <div className="w-px h-6 bg-border/60 mx-1"></div>
              <Button 
                variant="ghost" 
                onClick={onReset} 
                className="h-12 px-3 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                title="Reset Filters"
                aria-label="Reset Filters"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
