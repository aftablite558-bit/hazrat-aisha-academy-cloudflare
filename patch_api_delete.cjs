const fs = require('fs');
const path = 'functions/api/[[path]].ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'const result = await c.env.DB.prepare(`DELETE FROM ${name} WHERE id = ? OR CAST(id AS TEXT) = ?`)',
  'const result = await c.env.DB.prepare(`DELETE FROM ${name} WHERE id = ? OR CAST(id AS TEXT) = ? OR rowid = CAST(? AS INTEGER)`)'
);

code = code.replace(
  '.bind(id, id)',
  '.bind(id, id, id)'
);

fs.writeFileSync(path, code);
console.log('patched delete');
