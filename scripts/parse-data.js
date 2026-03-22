const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelFilePath = path.join(__dirname, '../../Results - 2027.xlsx');
console.log('Reading file:', excelFilePath);

const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Read raw data
const rawData = xlsx.utils.sheet_to_json(worksheet);

// Helper to safely parse numbers
const parseNum = (val, defaultVal = 0) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? defaultVal : parsed;
};

// Map and normalize data
let students = rawData.map(row => {
  const s1 = parseNum(row['Sem 1']);
  const s2 = parseNum(row['Sem 2']);
  const s3 = parseNum(row['Sem 3']);
  const s4 = parseNum(row['Sem 4']);
  const s5 = parseNum(row['Sem 5']);
  
  let cgpa = parseNum(row['Aggregate CGPA']);
  if (cgpa === 0) {
    const validSems = [s1, s2, s3, s4, s5].filter(s => s > 0);
    cgpa = validSems.length > 0 ? validSems.reduce((a, b) => a + b, 0) / validSems.length : 0;
  }
  
  // Improvement metric (e.g. from Sem 4 SGPA to Sem 5 SGPA)
  const improvement = (s5 > 0 && s4 > 0) ? (s5 - s4) : 0;

  return {
    univRank: row['Univ Rank'] || null,
    name: row['Name'] ? row['Name'].trim() : 'Unknown',
    rollNumber: row['Roll'] ? row['Roll'].trim() : '',
    branch: row['Dept.'] ? row['Dept.'].trim() : 'Unknown',
    sgpa: {
      sem1: s1,
      sem2: s2,
      sem3: s3,
      sem4: s4,
      sem5: s5,
    },
    latestSgpa: s5 || s4 || s3 || s2 || s1,
    cgpa: Number(cgpa.toFixed(3)),
    improvement: Number(improvement.toFixed(3))
  };
}).filter(s => s.rollNumber !== '');

// Rank calculation
// 1. Compute Overall Rank
students.sort((a, b) => b.cgpa - a.cgpa);
let overallRank = 1;
students.forEach((s, idx) => {
  if (idx > 0 && s.cgpa === students[idx - 1].cgpa) {
    s.overallRank = students[idx - 1].overallRank;
  } else {
    s.overallRank = overallRank;
  }
  overallRank++;
});

// 2. Compute Branch Rank
const branchGroups = {};
students.forEach(s => {
  if (!branchGroups[s.branch]) branchGroups[s.branch] = [];
  branchGroups[s.branch].push(s);
});

Object.keys(branchGroups).forEach(branch => {
  const group = branchGroups[branch];
  group.sort((a, b) => b.cgpa - a.cgpa);
  let bRank = 1;
  group.forEach((s, idx) => {
    if (idx > 0 && s.cgpa === group[idx - 1].cgpa) {
      s.branchRank = group[idx - 1].branchRank;
    } else {
      s.branchRank = bRank;
    }
    bRank++;
  });
});

// 3. Compute Semester Rank (Based on latestSgpa)
students.sort((a, b) => b.latestSgpa - a.latestSgpa);
let semRank = 1;
students.forEach((s, idx) => {
  if (idx > 0 && s.latestSgpa === students[idx - 1].latestSgpa) {
    s.semesterRank = students[idx - 1].semesterRank;
  } else {
    s.semesterRank = semRank;
  }
  semRank++;
});

// Calculate Most Improved globally
students.sort((a, b) => b.improvement - a.improvement);
let bestImprovement = students[0]?.improvement || 0;
students.forEach(s => {
  s.isMostImproved = s.improvement === bestImprovement && bestImprovement > 0;
});

// Restore sort by overall rank
students.sort((a, b) => a.overallRank - b.overallRank);

const outputDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outPath = path.join(outputDir, 'results.json');
fs.writeFileSync(outPath, JSON.stringify(students, null, 2), 'utf8');

console.log(`Successfully parsed ${students.length} students to ${outPath}`);
