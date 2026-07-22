const fs = require('fs');
let file = 'src/routes/AppRoutes.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const Careers = lazy\(\(\) => import\('\.\.\/pages\/dashboard\/content\/Careers'\)\.then\(m => \(\{ default: m\.Careers \}\)\)\);/, "const Careers = lazy(() => import('../pages/dashboard/content/Careers').then(m => ({ default: m.Careers })));\nconst CareerRequests = lazy(() => import('../pages/dashboard/content/CareerRequests').then(m => ({ default: m.CareerRequests })));");

c = c.replace(/<Route path="careers" element=\{<Careers \/>\} \/>/, "<Route path=\"careers\" element={<Careers />} />\n          <Route path=\"career-requests\" element={<CareerRequests />} />");

fs.writeFileSync(file, c);
