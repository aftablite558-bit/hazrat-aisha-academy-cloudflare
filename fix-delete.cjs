const fs = require('fs');

let api = fs.readFileSync('functions/api/[[path]].ts', 'utf-8');

api = api.replace(
  `  await c.env.DB.prepare(\`DELETE FROM \${name} WHERE id = ? OR id = CAST(? AS INTEGER) OR CAST(id AS TEXT) = ?\`)
    .bind(id, id, id)
    .run();
    
  return c.json({ success: true });`,
  `  const result = await c.env.DB.prepare(\`DELETE FROM \${name} WHERE id = ? OR id = CAST(? AS INTEGER) OR CAST(id AS TEXT) = ?\`)
    .bind(id, id, id)
    .run();
    
  if (result.meta && result.meta.changes === 0) {
    return c.json({ success: false, error: 'Record not found or already deleted' }, 404);
  }
    
  return c.json({ success: true, changes: result.meta ? result.meta.changes : undefined });`
);

fs.writeFileSync('functions/api/[[path]].ts', api);
