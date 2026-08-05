import { Metadata } from 'next';
import { PlacementDashboard } from '@/components/placement/PlacementDashboard';

export const metadata: Metadata = {
  title: 'Placement Statistics | Rankify DTU',
  description: 'Explore DTU 2026 batch placement data — company-wise hiring trends, compensation insights, and student analytics.',
};

async function getData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/placements`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    // Fallback: read directly from file system (for server components)
    const fs = (await import('fs')).default;
    const path = (await import('path')).default;
    const raw = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'placements.json'), 'utf-8');
    const data: any[] = JSON.parse(raw);

    function normalizeType(t: string) {
      const s = t.toLowerCase();
      if (s.includes('non')) return 'Non-Tech';
      if (s.includes('core')) return 'Core';
      if (s.includes('tech')) return 'Tech';
      return 'Unknown';
    }
    function round2(n: number) { return Math.round(n * 100) / 100; }
    const VALID = new Set(['CO','IT','EC','EE','ME','CE','CH','BT','SE','MC','PE','AE','EP','EN']);

    const normalized = data.map((r) => ({ ...r, type: normalizeType(r.type), branch: VALID.has(r.branch) ? r.branch : 'Other' }));
    const map: Record<string, any[]> = {};
    for (const r of normalized) {
      (map[r.company] = map[r.company] || []).push(r);
    }
    const companies = Object.entries(map).map(([name, students]) => {
      const ctcs  = students.map((s: any) => s.ctc).filter((v: number) => v > 0).sort((a: number, b: number) => a - b);
      const cgpas = students.map((s: any) => s.cgpa).filter((v: number) => v > 0).sort((a: number, b: number) => a - b);
      const branches: Record<string, number> = {};
      const roles: Record<string, number> = {};
      for (const s of students) {
        branches[s.branch] = (branches[s.branch] || 0) + 1;
        const role = s.role || 'Other';
        roles[role] = (roles[role] || 0) + 1;
      }
      return {
        name, type: students[0]?.type || 'Unknown', hired: students.length,
        avgCtc: ctcs.length ? round2(ctcs.reduce((a: number, b: number) => a + b, 0) / ctcs.length) : 0,
        maxCtc: ctcs.length ? ctcs[ctcs.length - 1] : 0,
        medianCtc: ctcs.length ? ctcs[Math.floor(ctcs.length / 2)] : 0,
        avgCgpa: cgpas.length ? round2(cgpas.reduce((a: number, b: number) => a + b, 0) / cgpas.length) : 0,
        minCgpa: cgpas[0] || 0, maxCgpa: cgpas[cgpas.length - 1] || 0,
        branches, roles,
        students: students.map((s: any) => ({ name: s.name, rollNumber: s.rollNumber, cgpa: s.cgpa, branch: s.branch, role: s.role || 'Unknown', ctc: s.ctc, duration: s.duration || '' })),
      };
    }).sort((a, b) => b.hired - a.hired);

    const allCtcs = normalized.map((r) => r.ctc).filter((v: number) => v > 0);
    const branchCount: Record<string, number> = {};
    for (const r of normalized) branchCount[r.branch] = (branchCount[r.branch] || 0) + 1;

    return {
      companies,
      stats: {
        totalPlaced: normalized.length,
        totalCompanies: companies.length,
        avgCtc: allCtcs.length ? round2(allCtcs.reduce((a: number, b: number) => a + b, 0) / allCtcs.length) : 0,
        highestCtc: allCtcs.length ? Math.max(...allCtcs) : 0,
        branchCount,
      },
    };
  }
}

export default async function PlacementPage() {
  const { companies, stats } = await getData();
  return <PlacementDashboard companies={companies} stats={stats} />;
}
