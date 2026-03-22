const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const excelFilePath = path.join(__dirname, '../../Results - 2027.xlsx');
console.log('Reading file:', excelFilePath);

const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
const output = {
  columns: data[0],
  firstRow: data[1],
  secondRow: data[2],
  thirdRow: data[3],
};

fs.writeFileSync(path.join(__dirname, '../inspect-output.json'), JSON.stringify(output, null, 2), 'utf8');
console.log('Wrote output to inspect-output.json');
