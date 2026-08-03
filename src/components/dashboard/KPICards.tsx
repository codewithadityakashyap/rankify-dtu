import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, TrendingUp } from 'lucide-react';

interface Student {
  name: string;
  cgpa: number;
  branch: string;
  improvement?: number;
}

interface KPICardsProps {
  overallTopper: Student | null;
  branchTopper: Student | null;
  mostImproved: Student | null;
}

export function KPICards({ overallTopper, branchTopper, mostImproved }: KPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-primary">Overall Topper</CardTitle>
          <Trophy className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold truncate">{overallTopper?.name || '---'}</div>
          <p className="text-xs text-muted-foreground mt-1">
            CGPA: <span className="font-semibold text-foreground">{overallTopper?.cgpa || '-'}</span> • {overallTopper?.branch || '-'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-accent-foreground">Branch Topper</CardTitle>
          <Medal className="w-4 h-4 text-accent-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold truncate">{branchTopper?.name || '---'}</div>
          <p className="text-xs text-muted-foreground mt-1">
            CGPA: <span className="font-semibold text-foreground">{branchTopper?.cgpa || '-'}</span> • {branchTopper?.branch || '-'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Most Improved</CardTitle>
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold truncate">{mostImproved?.name || '---'}</div>
          <p className="text-xs text-muted-foreground mt-1">
            +{mostImproved?.improvement?.toFixed(2) || '0.00'} SGPA Bump • {mostImproved?.branch || '-'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
