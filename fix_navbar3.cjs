const fs = require('fs');
let file = 'src/components/layout/Navbar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "import { Menu, X, ChevronDown, User, LogOut, Settings, Bell, LayoutDashboard } from 'lucide-react';",
  "import { Menu, X, ChevronDown, User, LogOut, Settings, Bell, LayoutDashboard, GraduationCap } from 'lucide-react';"
);

fs.writeFileSync(file, c);
