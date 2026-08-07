import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader || !cookieHeader.includes('dtu_session=')) {
      return NextResponse.json({ authorized: false });
    }

    const match = cookieHeader.match(/dtu_session=([^;]+)/);
    if (!match || !match[1]) {
      return NextResponse.json({ authorized: false });
    }

    const sessionData = decodeURIComponent(match[1]);
    const [rollNumber, token] = sessionData.split('::');

    if (!rollNumber || !token) {
      return NextResponse.json({ authorized: false });
    }

    const sessionsPath = path.join(process.cwd(), 'src/data/sessions.json');
    if (fs.existsSync(sessionsPath)) {
      const fileData = fs.readFileSync(sessionsPath, 'utf8');
      const sessions = JSON.parse(fileData || '{}');
      
      if (sessions[rollNumber] && sessions[rollNumber].active_tokens.includes(token)) {
        return NextResponse.json({ authorized: true, rollNumber });
      }
    }

    return NextResponse.json({ authorized: false });
  } catch (error) {
    console.error('Auth Check Error:', error);
    return NextResponse.json({ authorized: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

