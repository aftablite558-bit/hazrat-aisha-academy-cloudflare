const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');
content = content.replace(
  `          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 overflow-x-auto scrollbar-hide mx-4 ">`,
  `          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 overflow-x-auto scrollbar-hide mx-4 min-w-0">`
);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
