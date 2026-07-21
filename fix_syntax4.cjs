const fs = require('fs');

let file = 'src/pages/dashboard/enterprise/Users.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/<\/GlassModal>\n      \)}/g, '</GlassModal>');
fs.writeFileSync(file, c);

let file2 = 'src/pages/public/Careers.tsx';
let c2 = fs.readFileSync(file2, 'utf8');
c2 = c2.replace(/<\/GlassModal>\n      \)}/g, '</GlassModal>');
fs.writeFileSync(file2, c2);

