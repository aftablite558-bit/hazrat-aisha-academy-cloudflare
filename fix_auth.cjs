const fs = require('fs');
let file = 'src/contexts/AuthContext.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/displayName: parsed\.username \|\| parsed\.email,/, `displayName: parsed.displayName || parsed.username || parsed.email,
          photoUrl: parsed.photoUrl,
          phone: parsed.phone,`);

c = c.replace(/displayName: userData\.username \|\| userData\.email,/, `displayName: userData.displayName || userData.username || userData.email,
      photoUrl: userData.photoUrl,
      phone: userData.phone,`);

fs.writeFileSync(file, c);
