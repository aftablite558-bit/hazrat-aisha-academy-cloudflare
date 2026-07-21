const fs = require('fs');
const files = [
  'src/pages/public/Contact.tsx',
  'src/pages/dashboard/enterprise/Fees.tsx',
  'src/pages/dashboard/content/Notices.tsx',
  'src/pages/dashboard/academic/Results.tsx',
  'src/pages/dashboard/academic/ExamMarks.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/addRecord\(([^;]+)\;/g, 'addRecord($1);');
  fs.writeFileSync(file, content);
}
