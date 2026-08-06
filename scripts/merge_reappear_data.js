const fs = require('fs');
const path = require('path');

// Use relative path to where the user's workspace is. Since this script runs in the dtu-result-portal root.
// Or I can use absolute path.
const FAILED_STUDENTS_PATH = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/2050239f-b0cd-4f71-9a9b-e0b73f3f18f3/scratch/failed_students_2027.json';
const RESULTS_PATH = path.join(__dirname, '../src/data/results.json');
const TRANSCRIPTS_PATH = path.join(__dirname, '../public/data/transcripts.json');

console.log('Reading datasets...');
const failedData = JSON.parse(fs.readFileSync(FAILED_STUDENTS_PATH, 'utf-8'));
const resultsData = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
const transcriptsData = fs.existsSync(TRANSCRIPTS_PATH) ? JSON.parse(fs.readFileSync(TRANSCRIPTS_PATH, 'utf-8')) : {};

console.log(`Loaded ${Object.keys(failedData).length} students with reappear data.`);
console.log(`Loaded ${resultsData.length} total students in results.json.`);

let mergedCount = 0;

// Helper to determine status
function calculateReappearInfo(studentData) {
    const subjectGrades = {}; // code -> list of grades
    const allSubjects = {}; // code -> subject details

    studentData.results.forEach(res => {
        res.subjects.forEach(subj => {
            if (!subjectGrades[subj.code]) {
                subjectGrades[subj.code] = [];
            }
            subjectGrades[subj.code].push(subj.grade);
            allSubjects[subj.code] = subj;
        });
    });

    const failedSubjects = [];
    const clearedSubjects = [];

    for (const [code, grades] of Object.entries(subjectGrades)) {
        if (grades.includes('F')) {
            // Check if cleared
            const nonFGrades = grades.filter(g => g !== 'F' && g !== 'N/A' && g !== 'Ab');
            if (nonFGrades.length > 0) {
                clearedSubjects.push(allSubjects[code]);
            } else {
                failedSubjects.push(allSubjects[code]);
            }
        }
    }

    let status = 'No Backlogs';
    if (failedSubjects.length > 0) {
        status = 'Has Active Backlogs';
    } else if (clearedSubjects.length > 0) {
        status = 'Cleared Through Revised Results';
    }

    return {
        status,
        totalBacklogs: failedSubjects.length,
        failedSubjects,
        clearedSubjects,
        revisedSubjects: clearedSubjects, // Mapping cleared to revised for now
        reRegisterSubjects: [], // Hard to determine without specific markers
        lastUpdated: new Date().toISOString()
    };
}

// 1. Merge into results.json
const newResultsData = resultsData.map(student => {
    const roll = student.rollNumber;
    if (failedData[roll]) {
        const reappearInfo = calculateReappearInfo(failedData[roll]);
        if (reappearInfo.status !== 'No Backlogs' || reappearInfo.clearedSubjects.length > 0) {
            student.reappearInfo = reappearInfo;
            mergedCount++;
        }
    }
    return student;
});

fs.writeFileSync(RESULTS_PATH, JSON.stringify(newResultsData, null, 2));
console.log(`Merged reappear data for ${mergedCount} students into results.json.`);

// 2. Merge into transcripts.json (if exists)
let transcriptMerged = 0;
for (const roll in transcriptsData) {
    if (failedData[roll]) {
        const reappearInfo = calculateReappearInfo(failedData[roll]);
        if (reappearInfo.status !== 'No Backlogs' || reappearInfo.clearedSubjects.length > 0) {
            transcriptsData[roll].reappearInfo = reappearInfo;
            transcriptMerged++;
        }
    }
}
if (Object.keys(transcriptsData).length > 0) {
    fs.writeFileSync(TRANSCRIPTS_PATH, JSON.stringify(transcriptsData, null, 2));
    console.log(`Merged reappear data for ${transcriptMerged} students into transcripts.json.`);
}

console.log('Data integration complete.');
