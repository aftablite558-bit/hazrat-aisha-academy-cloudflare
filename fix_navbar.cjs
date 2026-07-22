const fs = require('fs');
let file = 'src/components/layout/Navbar.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('GraduationCap')) {
  // Wait, the error said it IS used but not defined. Let's add it to import { ... } from 'lucide-react';
}
c = c.replace(/import {([^}]+)} from 'lucide-react';/, (match, p1) => {
  if (!p1.includes('GraduationCap')) {
    return \`import { \${p1.trim()}, GraduationCap } from 'lucide-react';\`;
  }
  return match;
});

fs.writeFileSync(file, c);
