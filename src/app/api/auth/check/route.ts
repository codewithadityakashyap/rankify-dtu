import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

    const secret = process.env.AUTH_SECRET || 'dtu_secure_fallback_secret_2026';
    const expectedToken = crypto.createHmac('sha256', secret).update(rollNumber).digest('hex');
    
    if (token === expectedToken) {
      return NextResponse.json({ authorized: true, rollNumber });
    }

    return NextResponse.json({ authorized: false });
  } catch (error) {
    console.error('Auth Check Error:', error);
    return NextResponse.json({ authorized: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

