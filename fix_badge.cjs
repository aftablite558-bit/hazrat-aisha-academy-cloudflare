const fs = require('fs');
let file = 'src/pages/dashboard/content/CareerRequests.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<GlassBadge variant="primary">Accepted<\/GlassBadge>/, '<GlassBadge variant="success">Accepted</GlassBadge>');
c = c.replace(/<GlassBadge variant="ghost">Rejected<\/GlassBadge>/, '<GlassBadge variant="danger">Rejected</GlassBadge>');
c = c.replace(/<GlassBadge variant="primary">Shortlisted<\/GlassBadge>/, '<GlassBadge variant="primary">Shortlisted</GlassBadge>');

fs.writeFileSync(file, c);
