const fs = require('fs');
let file = 'src/components/layout/Sidebar.tsx';
let c = fs.readFileSync(file, 'utf8');

if (c.includes('{ icon: Contact, label: \'Careers\', path: \'/dashboard/careers\' },')) {
  c = c.replace(
    /\{ icon: Contact, label: 'Careers', path: '\/dashboard\/careers' \},/,
    "{ icon: Contact, label: 'Careers', path: '/dashboard/careers' },\n      { icon: Contact, label: 'Career Requests', path: '/dashboard/career-requests' },"
  );
}

fs.writeFileSync(file, c);
