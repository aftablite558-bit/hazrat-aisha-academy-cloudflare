const fs = require('fs');
const path = 'functions/api/[[path]].ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'const result = await c.env.DB.prepare(`SELECT * FROM ${name} WHERE id = ? OR id = CAST(? AS INTEGER) OR CAST(id AS TEXT) = ?`).bind(id, id, id).first();',
  'const result = await c.env.DB.prepare(`SELECT rowid as _rowid, * FROM ${name} WHERE id = ? OR id = CAST(? AS INTEGER) OR CAST(id AS TEXT) = ? OR rowid = CAST(? AS INTEGER)`).bind(id, id, id, id).first();\n  if (result) {\n    if (!result.id) result.id = String(result._rowid);\n    delete result._rowid;\n  }'
);

fs.writeFileSync(path, code);
console.log('patched get by id');
