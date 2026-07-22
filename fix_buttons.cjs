const fs = require('fs');

const files = [
  'src/pages/dashboard/enterprise/Admissions.tsx',
  'src/pages/dashboard/enterprise/Fees.tsx',
  'src/pages/dashboard/enterprise/BackupRestore.tsx',
  'src/pages/dashboard/enterprise/ProfileSettings.tsx',
  'src/pages/dashboard/enterprise/AuditLogs.tsx',
  'src/pages/dashboard/enterprise/Settings.tsx',
  'src/pages/dashboard/enterprise/Users.tsx',
  'src/pages/dashboard/enterprise/Reports.tsx',
  'src/pages/dashboard/content/Alumni.tsx',
  'src/pages/dashboard/content/Documents.tsx',
  'src/pages/dashboard/content/Gallery.tsx',
  'src/pages/dashboard/content/Facilities.tsx',
  'src/pages/dashboard/content/Testimonials.tsx',
  'src/pages/dashboard/content/Achievements.tsx',
  'src/pages/dashboard/content/Enquiries.tsx',
  'src/pages/dashboard/content/AcademicCalendar.tsx',
  'src/pages/dashboard/content/Notices.tsx',
  'src/pages/dashboard/content/Careers.tsx',
  'src/pages/dashboard/master/Subjects.tsx',
  'src/pages/dashboard/master/Teachers.tsx',
  'src/pages/dashboard/master/Classes.tsx',
  'src/pages/dashboard/master/Students.tsx',
  'src/pages/dashboard/master/Staff.tsx',
  'src/pages/dashboard/academic/Results.tsx',
  'src/pages/dashboard/academic/Homework.tsx',
  'src/pages/dashboard/academic/Attendance.tsx',
  'src/pages/dashboard/academic/ExamSchedule.tsx',
  'src/pages/dashboard/academic/ExamMarks.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('BackButton')) continue;

  const importRegex = /import\s+{[^}]+}\s+from\s+['"]\.\.\/\.\.\/\.\.\/components\/common\/[^'"]+['"];/g;
  let lastImportMatch;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    lastImportMatch = match;
  }
  
  if (lastImportMatch) {
    const importStr = "import { BackButton } from '../../../components/common/BackButton';\n";
    content = content.slice(0, lastImportMatch.index + lastImportMatch[0].length) + '\n' + importStr + content.slice(lastImportMatch.index + lastImportMatch[0].length);
  } else {
    const firstImportMatch = content.match(/import\s+.*?;/);
    if (firstImportMatch) {
      const importStr = "import { BackButton } from '../../../components/common/BackButton';\n";
      content = content.slice(0, firstImportMatch.index + firstImportMatch[0].length) + '\n' + importStr + content.slice(firstImportMatch.index + firstImportMatch[0].length);
    }
  }

  content = content.replace(/(<PageHeader)/, '<div className="flex justify-start mb-[-1.5rem] relative z-20">\n        <BackButton />\n      </div>\n      $1');

  fs.writeFileSync(file, content);
}
