const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<GlassModal([^>]*)\s+size="[^"]*"/g, '<GlassModal$1');
  content = content.replace(/<GlassModal([^>]*)\s+size=\{[^}]*\}/g, '<GlassModal$1');
  fs.writeFileSync(filePath, content);
}

fixFile('src/pages/public/GalleryPage.tsx');
fixFile('src/pages/public/PublicAchievements.tsx');
