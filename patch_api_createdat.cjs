const fs = require('fs');
const path = 'functions/api/[[path]].ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'if (!body.id) body.id = crypto.randomUUID();',
  'if (!body.id) body.id = crypto.randomUUID();\n  if (!body.createdAt) body.createdAt = new Date().toISOString();'
);

code = code.replace(
  'const setClause = Object.keys(body).map(key => `"${key}" = ?`).join(\', \');',
  'body.updatedAt = new Date().toISOString();\n  const setClause = Object.keys(body).map(key => `"${key}" = ?`).join(\', \');'
);

fs.writeFileSync(path, code);
console.log('patched createdat');
