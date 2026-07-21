const fs = require('fs');
let file = 'src/contexts/AuthContext.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/userData: Record<string, unknown> & \{ id: string, email: string, username\?: string, role\?: string \}/g, `userData: Record<string, unknown> & { id: string, email: string, username?: string, role?: string, displayName?: string, photoUrl?: string, phone?: string }`);
c = c.replace(/user: \(Record<string, unknown> & \{ id: string, email: string, username\?: string, role\?: string, displayName\?: string \}\) \| null;/g, `user: (Record<string, unknown> & { id: string, email: string, username?: string, role?: string, displayName?: string, photoUrl?: string, phone?: string }) | null;`);
c = c.replace(/useState<\(Record<string, unknown> & \{ id: string, email: string, username\?: string, role\?: string, displayName\?: string \}\) \| null>/g, `useState<(Record<string, unknown> & { id: string, email: string, username?: string, role?: string, displayName?: string, photoUrl?: string, phone?: string }) | null>`);

// Also fix in Users.tsx
let usersFile = 'src/pages/dashboard/enterprise/Users.tsx';
let u = fs.readFileSync(usersFile, 'utf8');
u = u.replace(/currentUser\?\.displayName/g, `(currentUser as any)?.displayName`);
fs.writeFileSync(usersFile, u);

fs.writeFileSync(file, c);
