import { Metadata } from 'next';
import { BackButton } from '@/components/BackButton';
import { CompareBranchesClient } from '@/components/compare/CompareBranchesClient';
import resultsData from '../../../public/data/results.json';
import placementData from '../../../public/data/placement_data.json';

export const metadata: Metadata = {
  title: 'Compare Branches - DTU Result & Placement Analytics',
  description: 'Side-by-side comparison of DTU engineering branches based on average CGPA, top students, and placement statistics.',
};

export default function CompareBranchesPage() {
  // Aggregate data by branch
  const branches = Array.from(new Set(resultsData.map((s: any) => s.branch)));
  
  const branchStats = branches.map(branch => {
    const studentsInBranch = resultsData.filter((s: any) => s.branch === branch);
    const avgCgpa = studentsInBranch.reduce((sum: number, s: any) => sum + s.cgpa, 0) / studentsInBranch.length;
    
    // Find median
    const sortedCgpa = [...studentsInBranch].map((s: any) => s.cgpa).sort((a, b) => b - a);
    const medianCgpa = sortedCgpa[Math.floor(sortedCgpa.length / 2)];
    
    const highestCgpa = sortedCgpa[0];
    const top10Avg = sortedCgpa.slice(0, Math.max(1, Math.floor(sortedCgpa.length * 0.1))).reduce((a, b) => a + b, 0) / Math.max(1, Math.floor(sortedCgpa.length * 0.1));

    // Determine average package from mock placement data based on branch eligibility
    const eligibleCompanies = placementData.companies.filter(c => c.branches.includes("ALL") || c.branches.includes(branch));
    let medianPackage = 0;
    if (eligibleCompanies.length > 0) {
      const packages = eligibleCompanies.map(c => parseFloat(c.package)).sort((a, b) => a - b);
      medianPackage = packages[Math.floor(packages.length / 2)];
    }

    return {
      branch,
      studentCount: studentsInBranch.length,
      avgCgpa,
      medianCgpa,
      highestCgpa,
      top10Avg,
      medianPackage
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-sans text-foreground tracking-tight">Compare Branches</h1>
        <p className="text-muted-foreground mt-2">Select branches to compare their academic and placement metrics side-by-side.</p>
      </div>
      
      <CompareBranchesClient initialStats={branchStats} />
    </div>
  );
}
