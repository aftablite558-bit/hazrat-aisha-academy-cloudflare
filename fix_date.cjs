const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/Reports.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/let itemDate = item\.createdAt \|\| \(item as Record<string, string>\)\.date \|\| \(item as Record<string, string>\)\.dueDate;/g, 
  "let itemDate = (item as Record<string, string>).createdAt || (item as Record<string, string>).date || (item as Record<string, string>).dueDate;");

c = c.replace(/const d = new Date\(itemDate\);/g, "const d = new Date(itemDate as string);");

fs.writeFileSync(file, c);
