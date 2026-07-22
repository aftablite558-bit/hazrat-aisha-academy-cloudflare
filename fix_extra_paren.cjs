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
    content = content.replace(/\(c as \{ name\?: string \}\)\.name\) \}\)\)/g, '(c as { name?: string }).name }))');
    content = content.replace(/\(s as \{ name\?: string \}\)\.name\) \}\)\)/g, '(s as { name?: string }).name }))');
    content = content.replace(/\(c as \{ name\?: string \}\)\.name\)\}\)/g, '(c as { name?: string }).name})');
    content = content.replace(/\(s as \{ name\?: string \}\)\.name\)\}\)/g, '(s as { name?: string }).name})');
    
    // Some are .name) }))) etc
    content = content.replace(/\(c as \{ name\?: string \}\)\.name\) /g, '(c as { name?: string }).name ');
    content = content.replace(/\(s as \{ name\?: string \}\)\.name\) /g, '(s as { name?: string }).name ');

    fs.writeFileSync(filePath, content);
  }
});
