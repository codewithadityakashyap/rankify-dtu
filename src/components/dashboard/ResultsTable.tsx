import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Crown, ArrowUpDown } from 'lucide-react';

interface ResultsTableProps {
  data: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
  onRowClick: (student: any) => void;
  sort: string;
  setSort: (s: string) => void;
}

export function ResultsTable({ data, isLoading, page, totalPages, setPage, onRowClick, sort, setSort }: ResultsTableProps) {
  const handleSort = (field: string) => {
    if (sort === `${field}_desc`) setSort(`${field}_asc`);
    else setSort(`${field}_desc`);
  };

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">Loading results...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">No students found.</div>;
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col pt-1">
      <div className="overflow-x-auto">
        <Table className="whitespace-nowrap min-w-max">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-16 text-center">Rank</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Roll No.</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-center">Branch Rank</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('sem1')} className="h-8 px-2 font-medium -mr-2">
                  Sem 1 <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('sem2')} className="h-8 px-2 font-medium -mr-2">
                  Sem 2 <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('sem3')} className="h-8 px-2 font-medium -mr-2">
                  Sem 3 <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('sem4')} className="h-8 px-2 font-medium -mr-2">
                  Sem 4 <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('sem5')} className="h-8 px-2 font-medium -mr-2">
                  Sem 5 <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleSort('cgpa')} className="h-8 px-2 font-bold text-primary hover:text-primary -mr-2">
                  Aggregate CGPA <ArrowUpDown className="ml-1 w-3 h-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student) => {
              const isTopper = student.overallRank === 1;
              return (
                <TableRow 
                  key={student.rollNumber}
                  onClick={() => onRowClick(student)}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${isTopper ? 'bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-900/30' : ''}`}
                >
                  <TableCell className="font-medium text-center relative">
                    {isTopper && <Crown className="w-3 h-3 text-amber-500 absolute top-3 left-2 -rotate-12" />}
                    <span className={isTopper ? 'text-amber-600 dark:text-amber-400' : ''}>
                      #{student.overallRank}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">{student.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{student.rollNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{student.branch}</Badge>
                  </TableCell>
                  <TableCell className="text-center">#{student.branchRank}</TableCell>
                  
                  {/* Exact Semester Columns */}
                  <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem1 ? student.sgpa.sem1.toFixed(3) : '-'}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem2 ? student.sgpa.sem2.toFixed(3) : '-'}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem3 ? student.sgpa.sem3.toFixed(3) : '-'}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem4 ? student.sgpa.sem4.toFixed(3) : '-'}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem5 ? student.sgpa.sem5.toFixed(3) : '-'}</TableCell>

                  <TableCell className="text-right font-bold text-primary">{student.cgpa.toFixed(3)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
        <div className="text-sm text-muted-foreground">
          Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
