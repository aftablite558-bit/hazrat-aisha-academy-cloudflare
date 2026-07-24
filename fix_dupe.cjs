const fs = require('fs');
const path = 'functions/api/[[path]].ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  '    for (const key in result) {\n      if (typeof result[key] === "string" && (result[key].startsWith("[") || result[key].startsWith("{"))) {\n        try { result[key] = JSON.parse(result[key]); } catch (e) {}\n      }\n    }\n    for (const key in result) {\n      if (typeof result[key] === "string" && (result[key].startsWith("[") || result[key].startsWith("{"))) {\n        try { result[key] = JSON.parse(result[key]); } catch (e) {}\n      }\n    }',
  '    for (const key in result) {\n      if (typeof result[key] === "string" && (result[key].startsWith("[") || result[key].startsWith("{"))) {\n        try { result[key] = JSON.parse(result[key]); } catch (e) {}\n      }\n    }'
);

fs.writeFileSync(path, code);
