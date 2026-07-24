const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');
content = content.replace(
  `        <main className="pt-24 p-4 md:p-8 w-full min-w-0 overflow-x-hidden max-w-[100vw]">`,
  `        <main className="px-4 pb-4 md:px-8 md:pb-8 pt-24 md:pt-28 w-full min-w-0 overflow-x-hidden max-w-[100vw]">`
);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
