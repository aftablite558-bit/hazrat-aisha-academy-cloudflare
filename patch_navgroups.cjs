const fs = require('fs');
const path = 'src/components/layout/Navbar.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "{ label: 'Home', path: '/' },\n        { label: 'About', path: '/about' },\n        { label: 'Contact', path: '/contact' },",
  "{ label: 'Home', path: '/' },\n        { label: 'About', path: '/about' },"
);

code = code.replace(
  "{ label: 'Feedback', path: '/feedback' },\n        { label: 'Careers', path: '/careers' },",
  "{ label: 'Feedback', path: '/feedback' },\n        { label: 'Careers', path: '/careers' },\n        { label: 'Contact', path: '/contact' },"
);

fs.writeFileSync(path, code);
console.log('patched navgroups');
