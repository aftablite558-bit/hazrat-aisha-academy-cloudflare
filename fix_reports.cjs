const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/enterprise/Reports.tsx', 'utf8');
content = content.replace(/\(classes as any\[\]\)\?\.find\(\(c: any\) => c\.id === id\)\?\.className/g, 'classes.find(c => c.id === id)?.className');
content = content.replace(/\(students as any\[\]\)\?\.find\(\(s: any\) => s\.id === id\)\?\.fullName/g, 'students.find(s => s.id === id)?.fullName');
content = content.replace(/\(settings as any\[\]\)\?\.\[0\]\?\.schoolName/g, 'settings[0]?.schoolName');
fs.writeFileSync('src/pages/dashboard/enterprise/Reports.tsx', content);
