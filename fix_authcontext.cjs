const fs = require('fs');
let file = 'src/contexts/AuthContext.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "role: (parsed.role?.toLowerCase() as UserRole) || 'user',",
  "role: (parsed.role?.toLowerCase() as UserRole) || 'user',\n          status: parsed.status || 'active',"
);

c = c.replace(
  "role: (userData.role?.toLowerCase() as UserRole) || 'user',",
  "role: (userData.role?.toLowerCase() as UserRole) || 'user',\n      status: (userData.status as any) || 'active',"
);

fs.writeFileSync(file, c);
