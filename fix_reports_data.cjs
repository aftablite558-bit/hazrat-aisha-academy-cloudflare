const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/Reports.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/let data: Record<string, unknown>\[\] = \[\];/g, "let data: unknown[] = [];");
c = c.replace(/data = students;/g, "data = students as unknown[];");
c = c.replace(/data = attendances;/g, "data = attendances as unknown[];");
c = c.replace(/data = results;/g, "data = results as unknown[];");
c = c.replace(/data = fees;/g, "data = fees as unknown[];");
c = c.replace(/data = admissions;/g, "data = admissions as unknown[];");
c = c.replace(/return data.filter\(\(item: Record<string, unknown>\) => \{/g, "return data.filter((item: unknown) => {");
c = c.replace(/const getTableRows = \(data: Record<string, unknown>\[\]\) => \{/g, "const getTableRows = (data: unknown[]) => {");
c = c.replace(/\(c as Record<string, string>\)\.name/g, "((c as unknown) as Record<string, string>).name");

fs.writeFileSync(file, c);
