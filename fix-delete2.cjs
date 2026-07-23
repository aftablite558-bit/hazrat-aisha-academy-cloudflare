const fs = require('fs');
let api = fs.readFileSync('functions/api/[[path]].ts', 'utf-8');
api = api.replace(
  `  const result = await c.env.DB.prepare(\`DELETE FROM \${name} WHERE id = ? OR id = CAST(? AS INTEGER) OR CAST(id AS TEXT) = ?\`)
    .bind(id, id, id)`,
  `  const result = await c.env.DB.prepare(\`DELETE FROM \${name} WHERE id = ? OR CAST(id AS TEXT) = ?\`)
    .bind(id, id)`
);
fs.writeFileSync('functions/api/[[path]].ts', api);
