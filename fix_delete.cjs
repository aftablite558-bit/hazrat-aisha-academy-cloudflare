const fs = require('fs');
let file = 'functions/api/[[path]].ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/await c\.env\.DB\.prepare\(\`DELETE FROM \$\{name\} WHERE id = \?\`\)/g, "await ensureTableAndColumns(c.env.DB, name, []);\n  await c.env.DB.prepare(`DELETE FROM ${name} WHERE id = ?`)");

fs.writeFileSync(file, c);
