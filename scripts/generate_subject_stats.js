const fs = require('fs');
const path = require('path');

const transcriptsPath = path.join(__dirname, '../src/data/transcripts.json');
const resultsPath = path.join(__dirname, '../src/data/results.json');
const outputPath = path.join(__dirname, '../src/data/subject_stats.json');

const gradePoints = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0,
  'Ab': 0,
  'N/A': 0
};

console.log('Loading transcripts and results...');
const transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf-8'));
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

// Build roll to batch mapping
const rollToBatch = {};
results.forEach(r => {
  rollToBatch[r.rollNumber] = r.batch;
});

const subjectsData = {
  'All': {},
  '2027': {},
  '2028': {},
  '2029': {}
};

const branchSpecificCourses = new Set(['AM101', 'AM102', 'AC101a', 'AP101', 'AP102', 'AP102a', 'AP102n']);
const branchSpecificPrefixes = ['CO', 'EV', 'MS', 'SC', 'AM', 'AC', 'AP'];

const isBranchSpecific = (code) => {
  if (branchSpecificCourses.has(code)) return true;
  for (const prefix of branchSpecificPrefixes) {
    if (code.startsWith(prefix)) return true;
  }
  return false;
};

for (const roll in transcripts) {
  const student = transcripts[roll];
  const batch = rollToBatch[roll];
  if (!batch || batch === 'Unknown') continue;

  const branch = roll.split('/')[1] || 'Unknown';

  for (const sem in student.semesters) {
    const semData = student.semesters[sem];
    if (semData.subjects) {
      semData.subjects.forEach(subj => {
        if (!subj.grade || !gradePoints.hasOwnProperty(subj.grade)) return;
        
        let subjCode = subj.code;
        let subjName = subj.name;
        
        // Segregate specific foundational courses by branch
        if (isBranchSpecific(subjCode)) {
          subjCode = `${subjCode} (${branch})`;
          subjName = `${subjName} (${branch})`;
        }
        
        // Helper to initialize subject in a specific batch dict
        const initSubject = (groupData) => {
          if (!groupData[subjCode]) {
            groupData[subjCode] = {
              code: subjCode,
              name: subjName,
              totalStudents: 0,
              totalPoints: 0,
              credits: subj.credits || 0,
              branches: new Set(),
              semesters: new Set(),
              grades: {
                'O': 0, 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'P': 0, 'F': 0, 'Ab': 0
              }
            };
          }
          return groupData[subjCode];
        };

        const updateSubject = (subjStats) => {
          subjStats.totalStudents++;
          subjStats.totalPoints += gradePoints[subj.grade];
          subjStats.branches.add(branch);
          subjStats.semesters.add(sem);
          if (subjStats.grades.hasOwnProperty(subj.grade)) {
            subjStats.grades[subj.grade]++;
          }
        };

        // Update 'All'
        updateSubject(initSubject(subjectsData['All']));
        // Update specific batch
        if (subjectsData[batch]) {
          updateSubject(initSubject(subjectsData[batch]));
        }
      });
    }
  }
}

console.log('Calculating metrics...');
const finalResult = {
  'All': [],
  '2027': [],
  '2028': [],
  '2029': []
};

Object.keys(subjectsData).forEach(batch => {
  const batchData = subjectsData[batch];
  
  for (const code in batchData) {
    const s = batchData[code];
    // Lowered threshold to 5 for batches so electives aren't filtered out
    if (s.totalStudents < 5) continue; 
    
    const avgGpa = Number((s.totalPoints / s.totalStudents).toFixed(2));
    const fRate = Number(((s.grades['F'] + s.grades['Ab']) / s.totalStudents * 100).toFixed(2));
    const passRate = Number((100 - fRate).toFixed(2));
    
    finalResult[batch].push({
      code: s.code,
      name: s.name,
      credits: s.credits,
      totalStudents: s.totalStudents,
      avgGpa,
      passRate,
      failRate: fRate,
      branches: Array.from(s.branches).sort(),
      semesters: Array.from(s.semesters).sort(),
      grades: s.grades
    });
  }
  
  // Sort by avgGpa descending initially
  finalResult[batch].sort((a, b) => b.avgGpa - a.avgGpa);
});

fs.writeFileSync(outputPath, JSON.stringify(finalResult, null, 2));
console.log(`Saved nested subjects to ${outputPath}`);
