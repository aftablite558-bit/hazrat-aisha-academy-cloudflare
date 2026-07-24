const fs = require('fs');
const path = 'functions/api/[[path]].ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'await c.env.DB.prepare(`UPDATE ${name} SET ${setClause} WHERE id = ? OR id = CAST(? AS INTEGER) OR CAST(id AS TEXT) = ?`)',
  'await c.env.DB.prepare(`UPDATE ${name} SET ${setClause} WHERE id = ? OR id = CAST(? AS INTEGER) OR CAST(id AS TEXT) = ? OR rowid = CAST(? AS INTEGER)`)'
);

code = code.replace(
  '.bind(...Object.values(body).map(v => (typeof v === "object" && v !== null) ? JSON.stringify(v) : v), id, id, id)',
  '.bind(...Object.values(body).map(v => (typeof v === "object" && v !== null) ? JSON.stringify(v) : v), id, id, id, id)'
);

fs.writeFileSync(path, code);
console.log('patched update');
