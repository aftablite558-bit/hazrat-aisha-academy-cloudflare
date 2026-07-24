const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');

const desktopNavMatch = `          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 overflow-x-auto scrollbar-hide mx-4 min-w-0">
            {navLinks.map((link) => (`;

const newDesktopNav = `          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 overflow-x-auto scrollbar-hide mx-4 min-w-0">
            {navLinks.filter(l => ['Home', 'About', 'Academics', 'Admissions', 'Notices', 'Contact'].includes(l.label)).map((link) => (`;

content = content.replace(desktopNavMatch, newDesktopNav);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
