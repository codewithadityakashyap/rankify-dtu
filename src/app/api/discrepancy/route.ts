import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const rollNumber = formData.get('rollNumber') as string;
    const branch = formData.get('branch') as string;
    const semester = formData.get('semester') as string;
    const givenGpa = formData.get('givenGpa') as string;
    const updatedGpa = formData.get('updatedGpa') as string;

    if (!file || !name || !rollNumber || !givenGpa || !updatedGpa) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize roll number for filename
    const safeRoll = rollNumber.replace(/\//g, '-').toUpperCase();
    const safeName = name.replace(/[^a-z0-9]/gi, '_').toUpperCase();
    const extension = path.extname(file.name) || '.pdf';
    
    const fileName = `${safeRoll}_${safeName}${extension}`;
    
    // The directory is in the root of the project `data/discrepancies`
    const dirPath = path.join(process.cwd(), 'data', 'discrepancies');
    const filePath = path.join(dirPath, fileName);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, buffer);

    // Also log the text data
    const logPath = path.join(dirPath, 'logs.json');
    let logs = [];
    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    
    logs.push({
      timestamp: new Date().toISOString(),
      name,
      rollNumber,
      branch,
      semester,
      givenGpa,
      updatedGpa,
      proofFile: fileName,
    });
    
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    return NextResponse.json({ success: true, message: 'Discrepancy reported successfully' });
  } catch (error) {
    console.error('Error handling discrepancy submission:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
