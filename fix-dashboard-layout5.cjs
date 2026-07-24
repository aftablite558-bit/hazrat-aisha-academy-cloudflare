const fs = require('fs');
let content = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf-8');
content = content.replace(
  `<main className="pt-24 p-4 md:p-8 lg:pl-[280px] min-w-0 w-full overflow-x-hidden">`,
  `<main className="pt-24 p-4 md:p-8 lg:ml-[280px] w-full lg:w-[calc(100%-280px)] min-w-0 overflow-x-hidden">`
);
fs.writeFileSync('src/layouts/DashboardLayout.tsx', content);
