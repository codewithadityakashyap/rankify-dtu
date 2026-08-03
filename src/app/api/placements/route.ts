import fs from 'fs';
import path from 'path';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'placements.json');
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Placement data not found' }, { status: 404 });
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: PlacementRecord[] = JSON.parse(raw);

  // ── Normalize types ──────────────────────────────────────────────────────
  const normalized = data.map((r) => ({
    ...r,
    type: normalizeType(r.type),
    branch: r.branch === 'Unknown' ? 'Other' : r.branch,
  }));

  // ── Aggregate by company ─────────────────────────────────────────────────
  const companiesMap: Record<string, CompanyAgg> = {};
  for (const r of normalized) {
    const co = r.company;
    if (!companiesMap[co]) {
      companiesMap[co] = {
        name: co, students: [], type: r.type,
        avgCtc: 0, maxCtc: 0, medianCtc: 0,
        avgCgpa: 0, minCgpa: 0, maxCgpa: 0,
        branches: {}, roles: {}, hired: 0,
      };
    }
    companiesMap[co].students.push(r);
  }

  const companies: CompanyAgg[] = Object.values(companiesMap).map((c) => {
    const ctcs    = c.students.map((s) => s.ctc).filter((v) => v > 0).sort((a, b) => a - b);
    const cgpas   = c.students.map((s) => s.cgpa).filter((v) => v > 0).sort((a, b) => a - b);
    const branches: Record<string, number> = {};
    const roles:    Record<string, number> = {};
    for (const s of c.students) {
      branches[s.branch] = (branches[s.branch] || 0) + 1;
      const role = s.role || 'Other';
      roles[role] = (roles[role] || 0) + 1;
    }
    return {
      name: c.name,
      type: c.students[0]?.type || 'Unknown',
      hired: c.students.length,
      avgCtc: ctcs.length ? round2(ctcs.reduce((a, b) => a + b, 0) / ctcs.length) : 0,
      maxCtc: ctcs.length ? ctcs[ctcs.length - 1] : 0,
      medianCtc: ctcs.length ? ctcs[Math.floor(ctcs.length / 2)] : 0,
      avgCgpa: cgpas.length ? round2(cgpas.reduce((a, b) => a + b, 0) / cgpas.length) : 0,
      minCgpa: cgpas[0] || 0,
      maxCgpa: cgpas[cgpas.length - 1] || 0,
      branches,
      roles,
      students: c.students.map((s) => ({ name: s.name, cgpa: s.cgpa, branch: s.branch, role: s.role || 'Unknown', ctc: s.ctc })),
    };
  }).sort((a, b) => b.hired - a.hired);

  // ── Global stats ──────────────────────────────────────────────────────────
  const allCtcs  = normalized.map((r) => r.ctc).filter((v) => v > 0);
  const allCgpas = normalized.map((r) => r.cgpa).filter((v) => v > 0);
  const branchCount: Record<string, number> = {};
  for (const r of normalized) {
    branchCount[r.branch] = (branchCount[r.branch] || 0) + 1;
  }

  return NextResponse.json({
    companies,
    stats: {
      totalPlaced:   normalized.length,
      totalCompanies: companies.length,
      avgCtc:        allCtcs.length ? round2(allCtcs.reduce((a, b) => a + b, 0) / allCtcs.length) : 0,
      highestCtc:    allCtcs.length ? Math.max(...allCtcs) : 0,
      branchCount,
    },
  });
}

// ── helpers ───────────────────────────────────────────────────────────────
function round2(n: number) { return Math.round(n * 100) / 100; }
function normalizeType(t: string): string {
  const s = t.toLowerCase();
  if (s.includes('non')) return 'Non-Tech';
  if (s.includes('core')) return 'Core';
  if (s.includes('tech')) return 'Tech';
  return 'Unknown';
}

// ── Types ─────────────────────────────────────────────────────────────────
interface PlacementRecord {
  rollNumber: string; name: string; cgpa: number;
  company: string; role?: string; ctc: number;
  type: string; branch: string;
}
interface CompanyAgg {
  name: string; type: string; hired: number;
  avgCtc: number; maxCtc: number; medianCtc: number;
  avgCgpa: number; minCgpa: number; maxCgpa: number;
  branches: Record<string, number>;
  roles: Record<string, number>;
  students: any[];
}
