export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { validateRequestOrigin } from '@/lib/security';

import resultsData from '../../../../src/data/results.json';

export async function GET(request: Request) {
  // SECURITY CHECK
  if (!validateRequestOrigin(request as any)) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const branch = searchParams.get('branch');
    const page = parseInt(searchParams.get('page') || '1');
    const requestedLimit = parseInt(searchParams.get('limit') || '10');
    const limit = Math.min(requestedLimit, 50); // Hard limit to prevent scraping
    const sort = searchParams.get('sort') || 'rank_asc';

    // Load Data
    
    
    let data = resultsData;

    // Filter
    if (q) {
      data = data.filter((s: any) => 
        s.name.toLowerCase().includes(q) || 
        s.rollNumber.toLowerCase().includes(q)
      );
    }
    if (branch && branch !== 'All') {
      data = data.filter((s: any) => s.branch.toLowerCase() === branch.toLowerCase());
    }

    // Sort
    if (sort === 'rank_asc') data.sort((a: any, b: any) => a.overallRank - b.overallRank);
    if (sort === 'rank_desc') data.sort((a: any, b: any) => b.overallRank - a.overallRank);
    if (sort === 'cgpa_desc') data.sort((a: any, b: any) => b.cgpa - a.cgpa);
    if (sort === 'cgpa_asc') data.sort((a: any, b: any) => a.cgpa - b.cgpa);
    if (sort === 'name_asc') data.sort((a: any, b: any) => a.name.localeCompare(b.name));
    if (sort === 'name_desc') data.sort((a: any, b: any) => b.name.localeCompare(a.name));
    if (sort.startsWith('sem')) {
      const [sem, direction] = sort.split('_');
      data.sort((a: any, b: any) => {
        const valA = a.sgpa?.[sem] || 0;
        const valB = b.sgpa?.[sem] || 0;
        return direction === 'desc' ? valB - valA : valA - valB;
      });
    }

    // Pagination
    const total = data.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = data.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      data: paginatedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
