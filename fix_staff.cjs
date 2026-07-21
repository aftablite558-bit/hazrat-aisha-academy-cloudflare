const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/master/Staff.tsx', 'utf8');
content = content.replace(/\(s as \{ name\?: string \}\)\.name \|\| ""\)/g, '(((s as { name?: string }).name || ""))');
fs.writeFileSync('src/pages/dashboard/master/Staff.tsx', content);
