const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');
content = content.replace(
  `<div className="min-h-screen bg-transparent transition-colors w-full relative">`,
  `<div className="min-h-screen bg-transparent transition-colors relative flex">`
);
content = content.replace(
  `<main className="pt-24 p-4 md:p-8 lg:ml-[280px] max-w-full min-w-0">`,
  `<main className="flex-1 pt-24 p-4 md:p-8 lg:ml-[280px] min-w-0 max-w-[100vw] lg:max-w-[calc(100vw-280px)]">`
);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
