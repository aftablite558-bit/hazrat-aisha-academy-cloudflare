const fs = require('fs');

let file = 'src/pages/dashboard/enterprise/Users.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/<\/form>\n          <\/GlassCard>\n        <\/div>\n      \)}/g, '</form>\n      </GlassModal>\n      )}');
fs.writeFileSync(file, c);

let file2 = 'src/pages/public/Careers.tsx';
let c2 = fs.readFileSync(file2, 'utf8');
c2 = c2.replace(/<\/form>\n          <\/motion\.div>\n        <\/div>\n      \)}/g, '</form>\n      </GlassModal>\n      )}');
fs.writeFileSync(file2, c2);

