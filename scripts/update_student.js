const fs = require('fs');
const path = require('path');

const transcriptsPath = path.join(__dirname, '../src/data/transcripts.json');
const resultsPath = path.join(__dirname, '../src/data/results.json');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log("Usage: node update_student.js <rollNumber> <field> <value>");
  console.log("Example: node update_student.js 2K21/CO/123 cgpa 8.95");
  process.exit(1);
}

const [rollNumber, field, value] = args;
let parsedValue = value;

// Parse numbers correctly
if (!isNaN(parseFloat(value))) {
  parsedValue = parseFloat(value);
}

// 1. Update Transcripts
const transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf8'));
if (transcripts[rollNumber]) {
  transcripts[rollNumber][field] = parsedValue;
  fs.writeFileSync(transcriptsPath, JSON.stringify(transcripts, null, 2));
  console.log(`✅ Updated ${field} for ${rollNumber} in transcripts.json`);
} else {
  console.log(`⚠️ ${rollNumber} not found in transcripts.json (ignoring)`);
}

// 2. Update Results
let results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const studentIndex = results.findIndex(r => r.rollNumber === rollNumber);

if (studentIndex !== -1) {
  results[studentIndex][field] = parsedValue;
  
  // If CGPA changed, we must re-sort and re-rank everyone!
  if (field === 'cgpa') {
    console.log("🔄 CGPA changed, recalculating all global rankings...");
    
    // Sort descending by CGPA
    results.sort((a, b) => b.cgpa - a.cgpa);
    
    // Re-assign ranks
    let currentRank = 1;
    let prevCgpa = results[0].cgpa;
    
    for (let i = 0; i < results.length; i++) {
      if (results[i].cgpa !== prevCgpa) {
        currentRank = i + 1;
        prevCgpa = results[i].cgpa;
      }
      results[i].overallRank = currentRank;
    }
    
    console.log("🏆 Rankings recalculated successfully!");
  }
  
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`✅ Updated ${field} for ${rollNumber} in results.json`);
} else {
  console.log(`❌ ${rollNumber} not found in results.json either!`);
}

console.log(`\n🎉 Success! You can now commit and push the changes.`);
