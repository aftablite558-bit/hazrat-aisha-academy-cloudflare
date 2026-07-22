const fs = require('fs');
let file = 'src/components/layout/Sidebar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import \{ .* \} from 'lucide-react';/, (match) => {
  if (!match.includes('Briefcase')) {
    return match.replace(/\} from 'lucide-react'/, ", Briefcase } from 'lucide-react'");
  }
  return match;
});

c = c.replace(/\{ icon: Contact, label: 'Careers', path: '\/dashboard\/careers' \},/g, "{ icon: Briefcase, label: 'Careers', path: '/dashboard/careers' },");
c = c.replace(/\{ icon: Contact, label: 'Career Requests', path: '\/dashboard\/career-requests' \},/g, "{ icon: FileText, label: 'Career Requests', path: '/dashboard/career-requests' },");

fs.writeFileSync(file, c);
