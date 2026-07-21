const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/Users.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  '<option value="admin" className="bg-slate-50 dark:bg-slate-900">Admin</option>',
  '<option value="admin" className="bg-slate-50 dark:bg-slate-900">Admin</option>\n                  <option value="staff" className="bg-slate-50 dark:bg-slate-900">Staff</option>'
);

fs.writeFileSync(file, c);
