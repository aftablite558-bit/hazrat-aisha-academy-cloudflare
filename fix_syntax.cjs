const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/\(c as \{ name\?: string \}\)\.name\) \|\| ''/g, '(c as { name?: string }).name || \'\'');
    content = content.replace(/\(s as \{ name\?: string \}\)\.name\) \|\| ''/g, '(s as { name?: string }).name || \'\'');
    content = content.replace(/\(c as \{ name\?: string \}\)\.name, value/g, '(c as { name?: string }).name, value');
    content = content.replace(/\(s as \{ name\?: string \}\)\.name, value/g, '(s as { name?: string }).name, value');
    content = content.replace(/\(c as \{ name\?: string \}\)\.name\}/g, '(c as { name?: string }).name}');

    content = content.replace(/\(s as \{ name\?: string \}\)\.name\)\.toLowerCase\(\)/g, '(s as { name?: string }).name).toLowerCase()');
    content = content.replace(/\(c as \{ name\?: string \}\)\.name\)\.toLowerCase\(\)/g, '(c as { name?: string }).name).toLowerCase()');
    
    // Also fix (s.subjectName || (s as { name?: string }).name)
    content = content.replace(/\(s\.subjectName \|\| \(s as \{ name\?: string \}\)\.name\) \|\| ''/g, '(s.subjectName || (s as { name?: string }).name || \'\')');

    // Remove random commas in Users.tsx line 383
    content = content.replace(/e\.target\.value as any\)/g, 'e.target.value as any)');

    fs.writeFileSync(filePath, content);
  }
});
