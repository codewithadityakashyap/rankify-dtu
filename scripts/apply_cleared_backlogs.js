const fs = require('fs');
const path = require('path');

const FAILED_STUDENTS_PATH = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/2050239f-b0cd-4f71-9a9b-e0b73f3f18f3/scratch/failed_students_2027.json';
const TRANSCRIPTS_PATH = path.join(__dirname, '../src/data/transcripts.json');

console.log('Loading datasets...');
const failedData = JSON.parse(fs.readFileSync(FAILED_STUDENTS_PATH, 'utf-8'));
const transcriptsData = JSON.parse(fs.readFileSync(TRANSCRIPTS_PATH, 'utf-8'));

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

let studentsUpdated = 0;
let gradesUpdated = 0;

for (const roll in failedData) {
    if (!transcriptsData[roll]) continue;

    const reappearStudent = failedData[roll];
    const transcriptStudent = transcriptsData[roll];

    // Determine the highest non-F grade for each subject in the reappear data
    const bestGrades = {};
    reappearStudent.results.forEach(res => {
        res.subjects.forEach(subj => {
            if (subj.grade !== 'F' && subj.grade !== 'Ab' && subj.grade !== 'N/A') {
                const currentBest = bestGrades[subj.code] ? gradePoints[bestGrades[subj.code]] : -1;
                const newScore = gradePoints[subj.grade];
                if (newScore > currentBest) {
                    bestGrades[subj.code] = subj.grade;
                }
            }
        });
    });

    if (Object.keys(bestGrades).length === 0) continue; // No cleared subjects

    let studentModified = false;

    // Go through original transcript and update the failing grades
    for (const [sem, semData] of Object.entries(transcriptStudent.semesters)) {
        let semesterModified = false;
        
        semData.subjects.forEach(subj => {
            if (bestGrades[subj.code] && (subj.grade === 'F' || subj.grade === 'Ab')) {
                console.log(`[${roll}] Updating ${subj.code} from ${subj.grade} -> ${bestGrades[subj.code]} in ${sem}`);
                subj.grade = bestGrades[subj.code];
                semesterModified = true;
                gradesUpdated++;
                studentModified = true;
            }
        });

        // Recalculate SGPA for this semester if any grade was updated
        if (semesterModified) {
            let totalPoints = 0;
            let totalCredits = 0;
            semData.subjects.forEach(subj => {
                if (typeof subj.credits === 'number') {
                    totalCredits += subj.credits;
                    const gp = gradePoints[subj.grade] || 0;
                    totalPoints += (gp * subj.credits);
                }
            });
            if (totalCredits > 0) {
                const newSgpa = Number((totalPoints / totalCredits).toFixed(2));
                console.log(`[${roll}] ${sem} SGPA updated: ${semData.sgpa} -> ${newSgpa}`);
                semData.sgpa = newSgpa;
            }
        }
    }

    if (studentModified) {
        studentsUpdated++;
    }
}

fs.writeFileSync(TRANSCRIPTS_PATH, JSON.stringify(transcriptsData, null, 2));

console.log(`\nOperation Complete.`);
console.log(`Students updated: ${studentsUpdated}`);
console.log(`Grades updated: ${gradesUpdated}`);
console.log(`Updated transcripts saved to ${TRANSCRIPTS_PATH}`);
