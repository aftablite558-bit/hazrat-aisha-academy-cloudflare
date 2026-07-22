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
    
    // c.className || (c.name, value: c.id -> c.className, value: c.id
    content = content.replace(/\|\| \(\(c as \{ name\?: string \}\)\.name\)/g, '');
    content = content.replace(/\|\| \(\(s as \{ name\?: string \}\)\.name\)/g, '');
    
    // (classes.find... )?.name -> ''
    content = content.replace(/\|\| \(classes\.find\([^)]+\)\)\?\.name /g, '');
    content = content.replace(/\|\| \(subjects\.find\([^)]+\)\)\?\.name /g, '');

    // (s.subjectName || (s.name || '').toLowerCase()
    content = content.replace(/\(s\.subjectName \|\| \(\(s as \{ name\?: string \}\)\.name\)/g, '(s.subjectName');
    
    // c.className || ((c as { name?: string }).name
    content = content.replace(/c\.className \|\| \(\(c as \{ name\?: string \}\)\.name\)/g, 'c.className');
    content = content.replace(/s\.subjectName \|\| \(\(s as \{ name\?: string \}\)\.name\)/g, 's.subjectName');

    fs.writeFileSync(filePath, content);
  }
});
