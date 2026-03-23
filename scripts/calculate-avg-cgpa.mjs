import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../public/data/results.json');

console.log("Loading dataset from:", jsonPath);

try {
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(rawData);

  const branchStats = {};
  const STRICT_BRANCHES = ["AE", "BT", "CE", "CH", "CS", "EC", "EE", "EP", "EN", "IT", "MC", "ME", "PE", "SE"];
  
  STRICT_BRANCHES.forEach(b => {
      branchStats[b] = { total: 0, count: 0 };
  });

  data.forEach(student => {
      const branch = student.branch?.toUpperCase();
      const cgpa = parseFloat(student.cgpa);
      
      // Handle valid CGPA and valid branch
      if (branch && branchStats[branch] && !isNaN(cgpa) && cgpa > 0) {
          branchStats[branch].total += cgpa;
          branchStats[branch].count += 1;
      }
  });

  const averages = [];
  for (const [branch, stats] of Object.entries(branchStats)) {
      if (stats.count > 0) {
          averages.push({
              branch: branch,
              averageCgpa: parseFloat((stats.total / stats.count).toFixed(2))
          });
      }
  }

  // Sort descending
  averages.sort((a, b) => b.averageCgpa - a.averageCgpa);

  console.log("\n=== 🎯 BRANCH-WISE AVERAGE CGPA VERIFICATION ===");
  console.log("Exactly computed from Results - 2027.xlsx dataset");
  console.log("--------------------------------------------------");
  averages.forEach((item, idx) => {
      const rank = (idx + 1).toString().padStart(2, ' ');
      console.log(`${rank}. ${item.branch.padEnd(4, ' ')} -> ${item.averageCgpa}`);
  });
  console.log("--------------------------------------------------\n");

} catch (error) {
  console.error("Error reading or processing dataset:", error);
}
