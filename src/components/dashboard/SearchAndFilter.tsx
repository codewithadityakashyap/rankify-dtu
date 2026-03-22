import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  branch: string;
  setBranch: (val: string) => void;
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
  sort,
  setSort,
  onReset,
  branches
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-card p-4 rounded-xl border shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search roll number or name..."
          className="pl-9 bg-background border-muted"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={branch} onValueChange={(val) => setBranch(val || '')}>
          <SelectTrigger className="w-full sm:w-[160px] bg-background">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Branches</SelectItem>
            {branches.map((b: string) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(val) => setSort(val || '')}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rank_asc">Rank (Top First)</SelectItem>
            <SelectItem value="rank_desc">Rank (Bottom First)</SelectItem>
            <SelectItem value="cgpa_desc">CGPA (High to Low)</SelectItem>
            <SelectItem value="cgpa_asc">CGPA (Low to High)</SelectItem>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
