const fs = require('fs');

const files = [
  'src/components/common/GlassImageUpload.tsx',
  'src/components/dashboard/master/FileUpload.tsx',
  'src/components/dashboard/master/ImageUpload.tsx'
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/error\?\.message/g, '(error instanceof Error ? error.message : String(error))');
  fs.writeFileSync(f, c);
}
