const fs = require('fs');
const path = require('path');

const transcriptsPath = path.join(__dirname, '../src/data/transcripts.json');
const resultsPath = path.join(__dirname, '../src/data/results.json');

const transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf8'));
let results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

// Create a map of existing results
const resultsMap = new Map();
results.forEach(r => resultsMap.set(r.rollNumber, r));

// Update results with transcript data
for (const [roll, data] of Object.entries(transcripts)) {
  let student = resultsMap.get(roll);
  if (!student) {
    const branchMatch = roll.match(/\d+\/([A-Z]+)\/\d+/);
    const branch = branchMatch ? branchMatch[1] : 'Unknown';
    student = {
      rollNumber: roll,
      name: data.name,
      branch: branch
    };
    results.push(student);
    resultsMap.set(roll, student);
  }
  
  student.sgpa = {};
  
  let totalGradePoints = 0;
  let totalCredits = 0;
  
  for (const [sem, semData] of Object.entries(data.semesters)) {
    const sgpa = semData.sgpa;
    student.sgpa[sem] = sgpa;
    
    // Calculate total credits for this semester
    let semCredits = 0;
    if (semData.subjects && Array.isArray(semData.subjects)) {
      for (const sub of semData.subjects) {
        if (typeof sub.credits === 'number') {
           semCredits += sub.credits;
        }
      }
    }
    
    // Only include this semester in CGPA if it has a valid SGPA and credits
    if (sgpa > 0 && semCredits > 0) {
      totalGradePoints += (sgpa * semCredits);
      totalCredits += semCredits;
    }
  }
  
  // Calculate cgpa properly with weighted credits
  if (totalCredits > 0) {
    student.cgpa = Number((totalGradePoints / totalCredits).toFixed(3));
  } else {
    student.cgpa = 0;
  }
  
  const availableSems = [1,2,3,4,5,6].map(s => student.sgpa['sem'+s]).filter(s => s > 0);
  if (availableSems.length >= 2) {
    const latest = availableSems[availableSems.length - 1];
    const prev = availableSems[availableSems.length - 2];
    student.improvement = Number((latest - prev).toFixed(3));
  } else {
    student.improvement = 0;
  }
  
  student.latestSgpa = availableSems[availableSems.length - 1] || 0;
}

// 0. Filter out non-2027 batch students
const validPrefixes = ['23/', '24/', '2K23/', '2K24/'];
const isWanted = (roll) => validPrefixes.some(p => roll.toUpperCase().startsWith(p));
results = results.filter(r => isWanted(r.rollNumber));

// 1. Compute Overall Rank
results.sort((a, b) => b.cgpa - a.cgpa);
let overallRank = 1;
results.forEach((s, idx) => {
  if (idx > 0 && s.cgpa === results[idx - 1].cgpa) {
    s.overallRank = results[idx - 1].overallRank;
  } else {
    s.overallRank = overallRank;
  }
  overallRank++;
});

// 2. Compute Branch Rank
const branchGroups = {};
results.forEach(s => {
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
results.sort((a, b) => b.latestSgpa - a.latestSgpa);
let semRank = 1;
results.forEach((s, idx) => {
  if (idx > 0 && s.latestSgpa === results[idx - 1].latestSgpa) {
    s.semesterRank = results[idx - 1].semesterRank;
  } else {
    s.semesterRank = semRank;
  }
  semRank++;
});

// Calculate Most Improved globally
results.sort((a, b) => b.improvement - a.improvement);
let bestImprovement = results[0]?.improvement || 0;
results.forEach(s => {
  s.isMostImproved = s.improvement === bestImprovement && bestImprovement > 0;
});

// Restore sort by overall rank
results.sort((a, b) => a.overallRank - b.overallRank);

fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf8');
console.log(`Successfully updated ${results.length} students with credit-weighted CGPA in ${resultsPath}`);
