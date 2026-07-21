const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/Admissions.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "import { useMasterData } from '../../../hooks/useMasterData';",
  "import { useMasterData } from '../../../hooks/useMasterData';\nimport { api } from '../../../services/apiClient';"
);

c = c.replace(
  `        try {
          await fetch('/api/collection/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
          });
        } catch (e) {`,
  `        try {
          await api.post('/collection/students', studentData);
        } catch (e) {`
);

fs.writeFileSync(file, c);
