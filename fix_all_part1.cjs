const fs = require('fs');

// Fix ActionColor variants
let file = 'src/pages/dashboard/enterprise/AuditLogs.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/'amber'/g, "'warning'");
fs.writeFileSync(file, c);

file = 'src/pages/dashboard/academic/ExamSchedule.tsx';
c = fs.readFileSync(file, 'utf8');
c = c.replace(/'amber'/g, "'warning'");
fs.writeFileSync(file, c);

// Fix FloatingActionButton & GlassButton
file = 'src/components/common/FloatingActionButton.tsx';
c = fs.readFileSync(file, 'utf8');
c = c.replace(/import \{ ButtonHTMLAttributes \} from 'react';/g, '');
c = c.replace(/import \{ motion \} from 'motion\/react';/g, "import { motion, HTMLMotionProps } from 'motion/react';");
c = c.replace(/interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement>/g, "interface FABProps extends HTMLMotionProps<'button'>");
c = c.replace(/\{\.\.\.\(props as any\)\}/g, "{...props}");
fs.writeFileSync(file, c);

file = 'src/components/common/GlassButton.tsx';
c = fs.readFileSync(file, 'utf8');
c = c.replace(/import \{ ButtonHTMLAttributes, ReactNode \} from 'react';/g, "import { ReactNode } from 'react';");
c = c.replace(/import \{ motion \} from 'motion\/react';/g, "import { motion, HTMLMotionProps } from 'motion/react';");
c = c.replace(/interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>/g, "interface ButtonProps extends HTMLMotionProps<'button'>");
c = c.replace(/\{\.\.\.\(props as any\)\}/g, "{...props}");
fs.writeFileSync(file, c);

// Fix any catches
const glob = require('child_process').execSync('find src -type f -name "*.ts" -o -name "*.tsx"').toString().split('\n').filter(Boolean);
for (const f of glob) {
  let cc = fs.readFileSync(f, 'utf8');
  if (cc.includes('catch (error: any)') || cc.includes('catch (err: any)')) {
    cc = cc.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
    cc = cc.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
    cc = cc.replace(/error\.message/g, '(error instanceof Error ? error.message : String(error))');
    cc = cc.replace(/err\.message/g, '(err instanceof Error ? err.message : String(err))');
    fs.writeFileSync(f, cc);
  }
}
