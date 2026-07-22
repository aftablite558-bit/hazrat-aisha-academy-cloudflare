const fs = require('fs');

let file = 'src/pages/dashboard/enterprise/Users.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<\/form>\n      <\/GlassModal>\n      \)}/g, '</form>\n      </GlassModal>'); // remove any bad ones
c = c.replace(/<\/form>\n      <\/GlassModal>(?!\n\s*\)})/g, '</form>\n      </GlassModal>\n      )}');

// Wait, the second one in Users didn't get replaced properly. Let's just restore it using git checkout and do it again.
