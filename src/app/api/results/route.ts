import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const branch = searchParams.get('branch');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'rank_asc';

    // Load Data
    const dataPath = path.join(process.cwd(), 'public', 'data', 'results.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    let data = JSON.parse(fileContents);

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
