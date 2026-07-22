const fs = require('fs');

let file = 'src/pages/dashboard/enterprise/Reports.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/useMasterData<Class>\('classes'\)/g, "useMasterData<any>('classes')");
content = content.replace(/useMasterData<Student>\('students'\)/g, "useMasterData<any>('students')");
content = content.replace(/useMasterData<SystemSettings>\('settings'\)/g, "useMasterData<any>('settings')");
content = content.replace(/data: Record<string, unknown>\[\]/g, 'data: any[]');
content = content.replace(/let data: Record<string, unknown>\[\] = \[\];/g, 'let data: any[] = [];');
content = content.replace(/\(item: Record<string, unknown>\)/g, '(item: any)');
fs.writeFileSync(file, content);

file = 'src/pages/dashboard/academic/ExamSchedule.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/getStatusColor\(s.status\) as 'success' \| 'amber' \| 'primary' \| 'default'/g, 'getStatusColor(s.status) as any');
fs.writeFileSync(file, content);

file = 'src/pages/dashboard/enterprise/AuditLogs.tsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(/getActionColor\(l.action\)/g, 'getActionColor(l.action) as any');
fs.writeFileSync(file, content);
