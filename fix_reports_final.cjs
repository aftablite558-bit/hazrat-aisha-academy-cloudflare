const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/Reports.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/BaseEntity\[\]/g, 'Record<string, unknown>[]');
c = c.replace(/\(item: BaseEntity\)/g, '(item: Record<string, unknown>)');
c = c.replace(/item\.classId/g, '(item as Record<string, string>).classId');
c = c.replace(/item\.classApplied/g, '(item as Record<string, string>).classApplied');
c = c.replace(/item\.status/g, '(item as Record<string, string>).status');
c = c.replace(/item\.date/g, '(item as Record<string, string>).date');
c = c.replace(/item\.dueDate/g, '(item as Record<string, string>).dueDate');

c = c.replace(/c\.name/g, '(c as Record<string, string>).name');

const fields = [
  'admissionNo', 'rollNo', 'fullName', 'gender', 'phone',
  'studentId', 'examName', 'totalObtainedMarks', 'grade',
  'admissionNumber', 'studentName', 'parentPhone',
  'receiptNumber', 'amount'
];

for (const field of fields) {
  c = c.replace(new RegExp(`item\\.${field}`, 'g'), `(item as Record<string, any>).${field}`); 
  // wait, I can't use any!
  c = c.replace(new RegExp(`\\(item as Record<string, any>\\)\\.${field}`, 'g'), `(item as Record<string, unknown>).${field} as string`);
  c = c.replace(new RegExp(`item\\.${field}`, 'g'), `(item as Record<string, unknown>).${field} as string`);
}

fs.writeFileSync(file, c);
