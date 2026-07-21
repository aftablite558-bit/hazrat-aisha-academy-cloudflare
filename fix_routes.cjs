const fs = require('fs');
let file = 'src/routes/AppRoutes.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('PublicAttendance')) {
  c = c.replace(
    "const PublicHomework = lazy(() => import('../pages/public/PublicHomework').then(m => ({ default: m.PublicHomework })));",
    "const PublicHomework = lazy(() => import('../pages/public/PublicHomework').then(m => ({ default: m.PublicHomework })));\nconst PublicAttendance = lazy(() => import('../pages/public/PublicAttendance').then(m => ({ default: m.PublicAttendance })));\nconst PublicExamSchedule = lazy(() => import('../pages/public/PublicExamSchedule').then(m => ({ default: m.PublicExamSchedule })));"
  );
  
  c = c.replace(
    '<Route path="/homework" element={<PublicHomework />} />',
    '<Route path="/homework" element={<PublicHomework />} />\n        <Route path="/attendance" element={<PublicAttendance />} />\n        <Route path="/exam-schedule" element={<PublicExamSchedule />} />'
  );
  
  fs.writeFileSync(file, c);
}
