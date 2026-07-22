const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/academic/Attendance.tsx', 'utf8');
content = content.replace(/status\s*\};\s*\}\s*\}\s*await fetchData/g, 'status\n          });\n        }\n      }\n      await fetchData');
fs.writeFileSync('src/pages/dashboard/academic/Attendance.tsx', content);
