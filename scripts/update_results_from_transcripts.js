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
    const branch = data.branch || (branchMatch ? branchMatch[1] : 'Unknown');
    student = {
      rollNumber: roll,
      name: data.name,
      branch: branch
    };
    results.push(student);
    resultsMap.set(roll, student);
  } else if (data.branch) {
    student.branch = data.branch;
  }

  student.sgpa = {};

  let totalGradePoints = 0;
  let totalCredits = 0;

  student.historicalCgpa = {};

  const orderedSems = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6'];
  for (const sem of orderedSems) {
    if (!data.semesters[sem]) continue;
    const semData = data.semesters[sem];
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
    
    // Store historical cumulative CGPA at the end of this semester
    if (totalCredits > 0) {
      student.historicalCgpa[sem] = Number((totalGradePoints / totalCredits).toFixed(3));
    }
  }

  // Calculate final cgpa properly with weighted credits
  if (totalCredits > 0) {
    student.cgpa = Number((totalGradePoints / totalCredits).toFixed(3));
  } else {
    student.cgpa = 0;
  }

  const availableSems = orderedSems.map(s => student.sgpa[s]).filter(s => s > 0);
  if (availableSems.length >= 2) {
    const latest = availableSems[availableSems.length - 1];
    const prev = availableSems[availableSems.length - 2];
    student.improvement = Number((latest - prev).toFixed(3));
  } else {
    student.improvement = 0;
  }

  student.latestSgpa = availableSems[availableSems.length - 1] || 0;
}

// 0. Filter out non-2027/2028/2029 batch students
const validPrefixes = ['23/', '24/', '25/', '2K23/', '2K24/', '2K25/'];
const isWanted = (roll) => validPrefixes.some(p => roll.toUpperCase().startsWith(p));
results = results.filter(r => isWanted(r.rollNumber));

// Add batch logic
results.forEach(s => {
  const roll = s.rollNumber.toUpperCase();
  const isLateralEntry2027 = /^(?:24|2K24)\/[A-Z]+\/5\d{2}$/.test(roll);
  const isLateralEntry2028 = /^(?:25|2K25)\/[A-Z]+\/8\d{2}$/.test(roll);

  if (roll.startsWith('23/') || roll.startsWith('2K23/') || isLateralEntry2027) {
    s.batch = '2027';
  } else if (roll.startsWith('24/') || roll.startsWith('2K24/') || isLateralEntry2028) {
    s.batch = '2028';
  } else if (roll.startsWith('25/') || roll.startsWith('2K25/')) {
    s.batch = '2029';
  } else {
    s.batch = 'Unknown';
  }
});

// Helper to rank within a group based on a value function
function rankGroup(group, valueFn, rankKey) {
  group.sort((a, b) => valueFn(b) - valueFn(a));
  let rank = 1;
  group.forEach((s, idx) => {
    if (idx > 0 && valueFn(s) === valueFn(group[idx - 1])) {
      s[rankKey] = group[idx - 1][rankKey];
    } else {
      s[rankKey] = rank;
    }
    rank++;
  });
}

// Group by batch
const batchGroups = {};
results.forEach(s => {
  if (!batchGroups[s.batch]) batchGroups[s.batch] = [];
  batchGroups[s.batch].push(s);
});

// Process ranks per batch
Object.values(batchGroups).forEach(batchGroup => {
  // 1. Compute Overall Rank
  rankGroup(batchGroup, s => s.cgpa, 'overallRank');

  // 2. Compute Branch Rank
  const branchGroups = {};
  batchGroup.forEach(s => {
    if (!branchGroups[s.branch]) branchGroups[s.branch] = [];
    branchGroups[s.branch].push(s);
  });
  Object.values(branchGroups).forEach(bg => {
    rankGroup(bg, s => s.cgpa, 'branchRank');
  });

  // 3. Compute Semester Rank (Based on latestSgpa)
  rankGroup(batchGroup, s => s.latestSgpa, 'semesterRank');

  // Calculate Most Improved within batch
  batchGroup.sort((a, b) => b.improvement - a.improvement);
  let bestImprovement = batchGroup[0]?.improvement || 0;
  batchGroup.forEach(s => {
    s.isMostImproved = s.improvement === bestImprovement && bestImprovement > 0;
  });
  
  // 4. Compute Historical Ranks
  const orderedSems = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6'];
  for (const sem of orderedSems) {
    // Get students who have historicalCgpa for this semester
    const semBatchGroup = batchGroup.filter(s => s.historicalCgpa && s.historicalCgpa[sem]);
    
    if (semBatchGroup.length > 0) {
      // Historical Overall Rank
      semBatchGroup.sort((a, b) => b.historicalCgpa[sem] - a.historicalCgpa[sem]);
      let oRank = 1;
      semBatchGroup.forEach((s, idx) => {
        if (!s.historicalRanks) s.historicalRanks = {};
        if (!s.historicalRanks[sem]) s.historicalRanks[sem] = {};
        
        if (idx > 0 && s.historicalCgpa[sem] === semBatchGroup[idx - 1].historicalCgpa[sem]) {
          s.historicalRanks[sem].overall = semBatchGroup[idx - 1].historicalRanks[sem].overall;
        } else {
          s.historicalRanks[sem].overall = oRank;
        }
        oRank++;
      });
      
      // Historical Branch Rank
      const semBranchGroups = {};
      semBatchGroup.forEach(s => {
        if (!semBranchGroups[s.branch]) semBranchGroups[s.branch] = [];
        semBranchGroups[s.branch].push(s);
      });
      
      Object.values(semBranchGroups).forEach(bg => {
        bg.sort((a, b) => b.historicalCgpa[sem] - a.historicalCgpa[sem]);
        let bRank = 1;
        bg.forEach((s, idx) => {
          if (idx > 0 && s.historicalCgpa[sem] === bg[idx - 1].historicalCgpa[sem]) {
            s.historicalRanks[sem].branch = bg[idx - 1].historicalRanks[sem].branch;
          } else {
            s.historicalRanks[sem].branch = bRank;
          }
          bRank++;
        });
      });
    }
  }
});

// Restore sort by batch then overall rank
results.sort((a, b) => {
  if (a.batch !== b.batch) return a.batch.localeCompare(b.batch);
  return a.overallRank - b.overallRank;
});

fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2), 'utf8');
console.log(`Successfully updated ${results.length} students with credit-weighted CGPA in ${resultsPath}`);
