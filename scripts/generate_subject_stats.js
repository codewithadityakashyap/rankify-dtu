const fs = require('fs');
const path = require('path');

const transcriptsPath = path.join(__dirname, '../src/data/transcripts.json');
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

console.log('Loading transcripts...');
const transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf-8'));

const subjectsData = {};

for (const roll in transcripts) {
  const student = transcripts[roll];
  for (const sem in student.semesters) {
    const semData = student.semesters[sem];
    if (semData.subjects) {
      semData.subjects.forEach(subj => {
        if (!subj.grade || !gradePoints.hasOwnProperty(subj.grade)) return;
        
        if (!subjectsData[subj.code]) {
          subjectsData[subj.code] = {
            code: subj.code,
            name: subj.name,
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
        
        subjectsData[subj.code].totalStudents++;
        subjectsData[subj.code].totalPoints += gradePoints[subj.grade];
        subjectsData[subj.code].branches.add(roll.split('/')[1] || 'Unknown');
        subjectsData[subj.code].semesters.add(sem);
        if (subjectsData[subj.code].grades.hasOwnProperty(subj.grade)) {
          subjectsData[subj.code].grades[subj.grade]++;
        }
      });
    }
  }
}

console.log('Calculating metrics...');
const result = [];
for (const code in subjectsData) {
  const s = subjectsData[code];
  if (s.totalStudents < 20) continue; // Filter out subjects with very few students
  
  const avgGpa = Number((s.totalPoints / s.totalStudents).toFixed(2));
  const fRate = Number(((s.grades['F'] + s.grades['Ab']) / s.totalStudents * 100).toFixed(2));
  const passRate = Number((100 - fRate).toFixed(2));
  
  result.push({
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
result.sort((a, b) => b.avgGpa - a.avgGpa);

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Saved ${result.length} subjects to ${outputPath}`);
