const fs = require('fs');
let file = 'functions/api/[[path]].ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const body = await c\.req\.json\(\);\s+if \(name === 'users' && body\.password\)/, `const body = await c.req.json();\n  if (!body.id) body.id = crypto.randomUUID();\n  \n  if (name === 'users' && body.password)`);

fs.writeFileSync(file, c);
