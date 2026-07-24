const fs = require('fs');
const path = 'functions/api/[[path]].ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  'results.forEach((r: any) => {\n    if (!r.id) r.id = String(r._rowid);\n    delete r._rowid;\n  });',
  'results.forEach((r: any) => {\n    if (!r.id) r.id = String(r._rowid);\n    delete r._rowid;\n    for (const key in r) {\n      if (typeof r[key] === "string" && (r[key].startsWith("[") || r[key].startsWith("{"))) {\n        try { r[key] = JSON.parse(r[key]); } catch (e) {}\n      }\n    }\n  });'
);

code = code.replace(
  'if (!result.id) result.id = String(result._rowid);\n    delete result._rowid;',
  'if (!result.id) result.id = String(result._rowid);\n    delete result._rowid;\n    for (const key in result) {\n      if (typeof result[key] === "string" && (result[key].startsWith("[") || result[key].startsWith("{"))) {\n        try { result[key] = JSON.parse(result[key]); } catch (e) {}\n      }\n    }'
);

fs.writeFileSync(path, code);
console.log('patched parse');
