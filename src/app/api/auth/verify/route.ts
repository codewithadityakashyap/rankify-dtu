import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { rollNumber, sgpa } = await request.json();

    if (!rollNumber || typeof rollNumber !== 'string') {
      return NextResponse.json({ success: false, error: 'Roll number is required' }, { status: 400 });
    }

    if (sgpa === undefined || isNaN(parseFloat(sgpa))) {
      return NextResponse.json({ success: false, error: 'SGPA challenge is required' }, { status: 400 });
    }

    const cleanedRollNumber = rollNumber.trim().toUpperCase();
    const enteredSgpa = parseFloat(sgpa);

    const resultsPath = path.join(process.cwd(), 'src/data/results.json');
    let studentData: any = null;

    if (fs.existsSync(resultsPath)) {
      const resultsData = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      studentData = resultsData.find((s: any) => s.rollNumber === cleanedRollNumber);
    } 

    if (!studentData) {
      return NextResponse.json({ success: false, error: 'Invalid Roll Number. Not found in university database.' }, { status: 401 });
    }

    // Knowledge-Based Verification: Check if entered SGPA matches their latest SGPA (allow small floating point difference)
    if (Math.abs(studentData.latestSgpa - enteredSgpa) > 0.02) {
      return NextResponse.json({ success: false, error: 'Security Challenge Failed. Incorrect SGPA.' }, { status: 401 });
    }

    // Generate Stateless Session Token (HMAC signed)
    const secret = process.env.AUTH_SECRET || 'dtu_secure_fallback_secret_2026';
    const sessionToken = crypto.createHmac('sha256', secret).update(cleanedRollNumber).digest('hex');

    const response = NextResponse.json({ success: true, rollNumber: cleanedRollNumber });
    
    // Cookie format: rollNumber::token
    const cookieValue = `${cleanedRollNumber}::${sessionToken}`;
    response.cookies.set('dtu_session', cookieValue, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth Verify Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

