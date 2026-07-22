const fs = require('fs');
let file = 'src/routes/AppRoutes.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/allowedRoles=\{\['admin', 'super_admin', 'principal', 'owner'\]\}/g, "allowedRoles={['admin', 'super_admin', 'principal', 'owner', 'staff']}");

fs.writeFileSync(file, c);
