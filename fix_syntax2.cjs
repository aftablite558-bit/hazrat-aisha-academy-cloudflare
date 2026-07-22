const fs = require('fs');

// Fix Users.tsx
let file = 'src/pages/dashboard/enterprise/Users.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/<\/GlassModal>/g, '</GlassModal>\n      )}');
// Actually, this will add )} to every </GlassModal>. 
// Wait, Users.tsx has multiple GlassModals (User and Password) so replacing all </GlassModal> with </GlassModal>\n)} might work if we have {showModal && ( and {showPasswordModal && ( before them.
// Let's check how many GlassModals are in Users.tsx
let match = c.match(/<\/GlassModal>/g);
if (match) console.log('Users.tsx has', match.length, 'GlassModals');

// But first, let me restore the file and do it manually.
