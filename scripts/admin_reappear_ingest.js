const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Admin Pipeline Utility for Reappear Analytics
 * 
 * Usage:
 * node admin_reappear_ingest.js <path_to_new_pdf_or_json>
 * 
 * Future usage: This script will take a directory of new Reappear PDFs,
 * run the Python scraper, and merge the output into results.json seamlessly.
 */

const inputPath = process.argv[2];

if (!inputPath) {
  console.log('Usage: node admin_reappear_ingest.js <path_to_new_data.json>');
  process.exit(1);
}

console.log(`[Reappear Admin] Ingesting data from: ${inputPath}`);

try {
  // Check if input is JSON (if it was a PDF, we'd call python script first)
  if (path.extname(inputPath) !== '.json') {
    console.error('Error: Currently only accepts pre-processed .json files.');
    process.exit(1);
  }

  // Load the new data
  const newData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(`Loaded ${Object.keys(newData).length} records from input.`);

  // Load existing results
  const resultsPath = path.join(__dirname, '../src/data/results.json');
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

  // Load transcripts
  const transcriptsPath = path.join(__dirname, '../public/data/transcripts.json');
  const transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf-8'));

  let updatedCount = 0;

  // Merge logic (similar to merge_reappear_data.js)
  for (const [roll, data] of Object.entries(newData)) {
    const student = results.find(s => s.rollNumber === roll);
    if (student) {
      student.reappearInfo = data;
      updatedCount++;
    }

    // Update transcript
    if (transcripts[roll] && transcripts[roll].semesters) {
      // Find the latest semester
      const sems = Object.keys(transcripts[roll].semesters).sort();
      const latestSem = sems[sems.length - 1];
      if (latestSem) {
        if (!transcripts[roll].semesters[latestSem].subjects) {
          transcripts[roll].semesters[latestSem].subjects = [];
        }
        
        // Mark failed subjects
        transcripts[roll].semesters[latestSem].subjects.forEach(sub => {
          if (data.failedSubjects.some(f => f.code === sub.code)) {
            sub.reappearStatus = 'F';
          }
        });
      }
    }
  }

  // Save back
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  fs.writeFileSync(transcriptsPath, JSON.stringify(transcripts, null, 2));

  console.log(`[Reappear Admin] Successfully updated ${updatedCount} records.`);
  console.log('[Reappear Admin] Pipeline complete.');

} catch (e) {
  console.error('[Reappear Admin] Error during ingestion:', e);
  process.exit(1);
}
