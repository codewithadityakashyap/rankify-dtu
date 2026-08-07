import { Metadata } from 'next';
import { CompanyProfileClient } from './CompanyProfileClient';

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const companyName = decodeURIComponent(params.name);
  return {
    title: `${companyName} Placements | Rankify DTU`,
    description: `Detailed placement statistics, average CTC, and hiring trends for ${companyName} at Delhi Technological University.`,
  };
}

async function getCompanyData(name: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  let data: any[] = [];
  try {
    const res = await fetch(`${base}/api/placements`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      data = json;
    }
  } catch {
    const fs = (await import('fs')).default;
    const path = (await import('path')).default;
    const raw = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'placements.json'), 'utf-8');
    data = JSON.parse(raw);
  }

  const VALID = new Set(['CO','IT','EC','EE','ME','CE','CH','BT','SE','MC','PE','AE','EP','EN']);
  const companyData = data.filter((r) => r.company.toLowerCase() === name.toLowerCase());

  if (companyData.length === 0) return null;

  const normalized = companyData.map((r) => ({
    ...r,
    type: r.type?.toLowerCase().includes('non') ? 'Non-Tech' : r.type?.toLowerCase().includes('core') ? 'Core' : r.type?.toLowerCase().includes('tech') ? 'Tech' : 'Unknown',
    branch: VALID.has(r.branch) ? r.branch : 'Other'
  }));

  const ctcs = normalized.map(s => s.ctc).filter(v => v > 0).sort((a, b) => a - b);
  const cgpas = normalized.map(s => s.cgpa).filter(v => v > 0).sort((a, b) => a - b);
  
  const branches: Record<string, number> = {};
  const roles: Record<string, number> = {};
  for (const s of normalized) {
    branches[s.branch] = (branches[s.branch] || 0) + 1;
    const role = s.role || 'Other';
    roles[role] = (roles[role] || 0) + 1;
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;

  return {
    name: normalized[0].company,
    type: normalized[0].type,
    hired: normalized.length,
    avgCtc: ctcs.length ? round2(ctcs.reduce((a, b) => a + b, 0) / ctcs.length) : 0,
    maxCtc: ctcs.length ? ctcs[ctcs.length - 1] : 0,
    medianCtc: ctcs.length ? ctcs[Math.floor(ctcs.length / 2)] : 0,
    avgCgpa: cgpas.length ? round2(cgpas.reduce((a, b) => a + b, 0) / cgpas.length) : 0,
    minCgpa: cgpas[0] || 0,
    maxCgpa: cgpas[cgpas.length - 1] || 0,
    branches,
    roles,
    students: normalized
  };
}

export default async function CompanyPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const data = await getCompanyData(name);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-xl font-bold text-slate-500">Company not found.</p>
      </div>
    );
  }

  return <CompanyProfileClient companyData={data} />;
}
