const fs = require('fs');

let file = 'src/pages/dashboard/enterprise/AuditLogs.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/variant=\{getActionColor\(l\.action\) as any\}/g, "variant={getActionColor(l.action)}");
fs.writeFileSync(file, c);

file = 'src/pages/dashboard/academic/ExamSchedule.tsx';
c = fs.readFileSync(file, 'utf8');
c = c.replace(/variant=\{getStatusColor\(s\.status\) as any\}/g, "variant={getStatusColor(s.status)}");
fs.writeFileSync(file, c);

file = 'src/pages/dashboard/enterprise/Reports.tsx';
c = fs.readFileSync(file, 'utf8');
c = c.replace(/useMasterData<any>\('classes'\)/g, "useMasterData<Class>('classes')");
c = c.replace(/useMasterData<any>\('students'\)/g, "useMasterData<Student>('students')");
c = c.replace(/useMasterData<any>\('settings'\)/g, "useMasterData<SystemSettings>('settings')");
c = c.replace(/let data: any\[\] = \[\];/g, "let data: BaseEntity[] = [];");
c = c.replace(/\(item: any\)/g, "(item: BaseEntity)");
c = c.replace(/const getTableRows = \(data: any\[\]\) => \{/g, "const getTableRows = (data: BaseEntity[]) => {");
if (!c.includes('import { Class, Student }')) {
  c = c.replace(/import \{ BaseEntity \} from '\.\.\/\.\.\/\.\.\/types\/master';/, "import { BaseEntity, Class, Student } from '../../../types/master';");
  c = c.replace(/import \{ SystemSettings \} from '\.\.\/\.\.\/\.\.\/types';/, "import { SystemSettings } from '../../../types';\nimport { Class } from '../../../types/master';\nimport { Student } from '../../../types/master';");
}
fs.writeFileSync(file, c);

file = 'src/services/masterDataService.ts';
c = fs.readFileSync(file, 'utf8');
c = c.replace(/params\?: Record<string, any>/g, "params?: Record<string, string | number>");
c = c.replace(/dbCreateDocument<any>/g, "dbCreateDocument<T>");
c = c.replace(/dbUpdateDocument<any>/g, "dbUpdateDocument<T>");
fs.writeFileSync(file, c);

file = 'src/hooks/useMasterData.ts';
c = fs.readFileSync(file, 'utf8');
c = c.replace(/\(dataToSave as any\)\.sessionId/g, "(dataToSave as Partial<T> & { sessionId?: string }).sessionId");
fs.writeFileSync(file, c);
