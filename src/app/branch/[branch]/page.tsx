import { BranchDashboard } from '@/components/dark-glass/BranchDashboard';

export default async function BranchPage({ params }: { params: Promise<{ branch: string }> }) {
  // In Next.js App Router (version >= 13), `params` can be treated structurally or must be awaited depending on exact typings, but standard synchronous `params.branch` works in basic pages, though TS may require it to be awaited as per latest App Router definitions.
  // We'll await params safely to be rigorous.
  const resolvedParams = await params;
  
  return <BranchDashboard branch={resolvedParams.branch.toUpperCase()} />;
}
