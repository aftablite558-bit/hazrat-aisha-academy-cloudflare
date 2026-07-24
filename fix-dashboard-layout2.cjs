const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');
content = content.replace(
  `<div className="min-h-screen bg-transparent transition-colors flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden relative">`,
  `<div className="min-h-screen bg-transparent transition-colors w-full relative">`
);
content = content.replace(
  `<main className="flex-1 pt-24 p-4 md:p-8 w-full lg:w-[calc(100%-280px)] lg:ml-[280px] max-w-full mx-auto min-w-0">`,
  `<main className="pt-24 p-4 md:p-8 lg:ml-[280px] max-w-full min-w-0">`
);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
