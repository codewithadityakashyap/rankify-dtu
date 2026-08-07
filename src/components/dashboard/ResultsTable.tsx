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

  const batch = data.length > 0 ? data[0].batch : null;
  const is2028 = batch === '2028';
  const is2029 = batch === '2029';
  if (isLoading) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">Loading results...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">No students found.</div>;
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col pt-1">
      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-3 p-3 bg-muted/10">
        {data.map((student) => {
          const isTopper = student.overallRank === 1;
          return (
            <div 
              key={student.rollNumber}
              onClick={() => onRowClick(student)}
              className={`p-4 cursor-pointer transition-all border rounded-xl shadow-sm bg-card hover:border-primary/40 ${isTopper ? 'border-amber-200/60 shadow-amber-500/5 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    {isTopper && <Crown className="w-3.5 h-3.5 text-amber-500 -mt-0.5" />}
                    <span className="font-bold text-[15px] leading-tight line-clamp-1">{student.name}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono mt-0.5">{student.rollNumber}</span>
                </div>
                <div className="text-right flex flex-col items-end pl-2 shrink-0">
                  <span className="font-bold text-lg text-primary leading-tight">{student.cgpa.toFixed(3)}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 rounded-sm ${isTopper ? 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:bg-amber-950/50' : 'bg-muted/50 text-muted-foreground'}`}>
                      #{student.overallRank}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="text-[10px] px-2 py-0 h-4">{student.branch}</Badge>
                <span className="text-[10px] text-muted-foreground font-medium">Branch Rank: #{student.branchRank}</span>
              </div>
              
              <div className={`grid ${is2029 ? 'grid-cols-4' : (is2028 ? 'grid-cols-4' : 'grid-cols-6')} gap-2 pt-3 border-t border-muted/60`}>
                {[1, 2, 3, 4, 5, 6].filter(sem => is2029 ? sem <= 1 : (is2028 ? sem <= 4 : true)).map(sem => {
                  const val = student.sgpa?.[`sem${sem}`];
                  return (
                    <div key={sem} className="flex flex-col text-center bg-muted/20 rounded-md py-1.5">
                      <span className="text-[9px] uppercase text-muted-foreground font-bold mb-0.5 tracking-wider">S{sem}</span>
                      <span className={`text-xs ${val ? 'font-semibold text-foreground' : 'text-muted-foreground/30'}`}>
                        {val ? val.toFixed(2) : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
              {!is2029 && (
                <>
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
                </>
              )}
              {!(is2028 || is2029) && (
                <>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('sem5')} className="h-8 px-2 font-medium -mr-2">
                      Sem 5 <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleSort('sem6')} className="h-8 px-2 font-medium -mr-2">
                      Sem 6 <ArrowUpDown className="ml-1 w-3 h-3" />
                    </Button>
                  </TableHead>
                </>
              )}
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
                  {!is2029 && (
                    <>
                      <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem2 ? student.sgpa.sem2.toFixed(3) : '-'}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem3 ? student.sgpa.sem3.toFixed(3) : '-'}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem4 ? student.sgpa.sem4.toFixed(3) : '-'}</TableCell>
                    </>
                  )}
                  {!(is2028 || is2029) && (
                    <>
                      <TableCell className="text-right text-muted-foreground">{student.sgpa?.sem5 ? student.sgpa.sem5.toFixed(3) : '-'}</TableCell>
                      <TableCell className="text-right font-medium text-slate-700 dark:text-slate-300">{student.sgpa?.sem6 ? student.sgpa.sem6.toFixed(3) : '-'}</TableCell>
                    </>
                  )}

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
