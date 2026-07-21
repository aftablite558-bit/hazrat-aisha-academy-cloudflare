const fs = require('fs');
let file = 'src/components/layout/Sidebar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "{ icon: Contact, label: 'Admissions', path: '/dashboard/admissions' },",
  "{ icon: Contact, label: 'Admission Requests', path: '/dashboard/admissions' },"
);

fs.writeFileSync(file, c);
