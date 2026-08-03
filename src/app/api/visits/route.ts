export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Store visits count in a JSON file in the project root (persists between hot reloads)
const VISITS_FILE = path.join(process.cwd(), 'visits.json');

function getCount(): number {
  try {
    if (!fs.existsSync(VISITS_FILE)) {
      fs.writeFileSync(VISITS_FILE, JSON.stringify({ count: 0 }), 'utf8');
    }
    const data = JSON.parse(fs.readFileSync(VISITS_FILE, 'utf8'));
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

function incrementCount(): number {
  const current = getCount();
  const next = current + 1;
  fs.writeFileSync(VISITS_FILE, JSON.stringify({ count: next }), 'utf8');
  return next;
}

// GET → just read the current count
export async function GET() {
  return NextResponse.json({ count: getCount() });
}

// POST → increment and return new count
export async function POST() {
  const count = incrementCount();
  return NextResponse.json({ count });
}
