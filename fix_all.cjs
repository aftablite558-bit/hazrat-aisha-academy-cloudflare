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
    
    content = content.replace(/\|\| \(\(c as \{ name\?: string \}\)\.name\)/g, '');
    content = content.replace(/\|\| \(\(s as \{ name\?: string \}\)\.name\)/g, '');
    
    // (classes.find(c => c.id === student.classId)?.name ||
    content = content.replace(/\|\| \(classes\.find\([^)]+\)\)\?\.name/g, '');
    content = content.replace(/\|\| \(classes\.find\([^)]+\)\)\?\.name /g, '');
    content = content.replace(/\|\| \(classes\.find[^\?]+\)\?\.name /g, '');
    content = content.replace(/\|\| \(classes\.find[^\?]+\)\?\.name/g, '');
    content = content.replace(/\|\| \(subjects\.find[^\?]+\)\?\.name /g, '');
    content = content.replace(/\|\| \(subjects\.find[^\?]+\)\?\.name/g, '');

    content = content.replace(/\(s\.subjectName \|\| \(\(s as \{ name\?: string \}\)\.name\)/g, '(s.subjectName');
    
    content = content.replace(/c\.className \|\| \(\(c as \{ name\?: string \}\)\.name\)/g, 'c.className');
    content = content.replace(/s\.subjectName \|\| \(\(s as \{ name\?: string \}\)\.name\)/g, 's.subjectName');
    
    // Some are like: c.className || ((c as { name?: string }).name, value: c.id
    content = content.replace(/c\.className \|\| \(\(c as \{ name\?: string \}\)\.name/g, 'c.className');
    content = content.replace(/s\.subjectName \|\| \(\(s as \{ name\?: string \}\)\.name/g, 's.subjectName');
    
    // And for the ones missed: c.className || (c.name
    content = content.replace(/c\.className \|\| \(c\.name/g, 'c.className');
    content = content.replace(/s\.subjectName \|\| \(s\.name/g, 's.subjectName');
    content = content.replace(/s\.name \|\| ""/g, 's.subjectName || ""');

    fs.writeFileSync(filePath, content);
  }
});
