const fs = require('fs');

// 1. Fix Button animation type issues
let file = 'src/components/common/FloatingActionButton.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\{...props\}/g, '{...(props as any)}');
fs.writeFileSync(file, content);

file = 'src/components/common/GlassButton.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/\{...props\}/g, '{...(props as any)}');
fs.writeFileSync(file, content);

// 2. Fix useMasterData sessionId
file = 'src/hooks/useMasterData.ts';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/\(dataToSave as Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>\)/g, 'dataToSave');
content = content.replace(/dataToSave\.sessionId/g, '(dataToSave as any).sessionId');
fs.writeFileSync(file, content);

// 3. Fix error.message
const glob = require('child_process').execSync('find src -type f -name "*.ts" -o -name "*.tsx"').toString().split('\n').filter(Boolean);
for (const f of glob) {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('catch (error: unknown)') || c.includes('catch (err: unknown)')) {
    c = c.replace(/catch \(error: unknown\)/g, 'catch (error: any)');
    c = c.replace(/catch \(err: unknown\)/g, 'catch (err: any)');
    fs.writeFileSync(f, c);
  }
}

// 4. Fix UserProfile id
file = 'src/types/index.ts';
content = fs.readFileSync(file, 'utf8');
if (!content.includes('id?: string; // added back')) {
  content = content.replace(/export interface UserProfile \{/, 'export interface UserProfile {\n  id?: string; // added back');
  fs.writeFileSync(file, content);
}
