const fs = require('fs');

let content = fs.readFileSync('src/routes/AppRoutes.tsx', 'utf-8');

// Add Suspense and lazy imports
if (!content.includes('import { Suspense, lazy }')) {
  content = content.replace("import { Routes, Route } from 'react-router-dom';", "import { Routes, Route } from 'react-router-dom';\nimport { Suspense, lazy } from 'react';");
}

// Extract all dashboard imports
const dashboardImportRegex = /import { ([^}]+) } from '..\/pages\/dashboard\/([^']+)';/g;
let match;
const lazyImports = [];

while ((match = dashboardImportRegex.exec(content)) !== null) {
  const [fullMatch, components, path] = match;
  
  if (components.includes('as')) {
    const parts = components.split('as').map(s => s.trim());
    lazyImports.push(`const ${parts[1]} = lazy(() => import('../pages/dashboard/${path}').then(m => ({ default: m.${parts[0]} })));`);
  } else {
    lazyImports.push(`const ${components.trim()} = lazy(() => import('../pages/dashboard/${path}').then(m => ({ default: m.${components.trim()} })));`);
  }
  
  content = content.replace(fullMatch, '');
}

// Add the lazy declarations after standard imports
const lastImportIndex = content.lastIndexOf('import ');
const endOfLastImport = content.indexOf('\n', lastImportIndex) + 1;
content = content.slice(0, endOfLastImport) + '\n' + lazyImports.join('\n') + '\n\n' + content.slice(endOfLastImport);

// Wrap Routes with Suspense
content = content.replace(/<Routes>/g, '<Suspense fallback={<div className="flex h-screen items-center justify-center text-primary-500">Loading Module...</div>}>\n      <Routes>');
content = content.replace(/<\/Routes>/g, '<\/Routes>\n    </Suspense>');

fs.writeFileSync('src/routes/AppRoutes.tsx', content);
