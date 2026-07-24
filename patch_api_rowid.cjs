const fs = require('fs');
const path = 'functions/api/[[path]].ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'let query = `SELECT * FROM ${name}`;',
  'let query = `SELECT rowid as _rowid, * FROM ${name}`;'
);

code = code.replace(
  'const { results } = await c.env.DB.prepare(query)\n    .bind(...params)\n    .all();',
  'const { results } = await c.env.DB.prepare(query)\n    .bind(...params)\n    .all();\n  results.forEach((r: any) => {\n    if (!r.id) r.id = String(r._rowid);\n    delete r._rowid;\n  });'
);

fs.writeFileSync(path, code);
console.log('patched');
