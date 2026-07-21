const fs = require('fs');
let file = 'src/components/layout/Navbar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import \{ Menu, X, Sun, Moon \} from 'lucide-react';/, "import { Menu, X, Sun, Moon, GraduationCap } from 'lucide-react';\nimport { useMasterData } from '../../hooks/useMasterData';\nimport { SystemSettings } from '../../types';");

fs.writeFileSync(file, c);
