const fs = require('fs');
let file = 'src/components/layout/Sidebar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import \{ useAuth \} from '\.\.\/\.\.\/contexts\/AuthContext';/, "import { useAuth } from '../../contexts/AuthContext';\nimport { useMasterData } from '../../hooks/useMasterData';\nimport { SystemSettings } from '../../types';");

c = c.replace(/export const GlassSidebar = \(\{ isOpen = true, onClose \}: SidebarProps\) => \{/, `export const GlassSidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const { data: settings } = useMasterData<SystemSettings>('settings');
  const schoolName = settings?.[0]?.schoolName || 'Hazrat Aisha';
  const logoUrl = settings?.[0]?.logoUrl;`);

c = c.replace(/<h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center gap-2">\s+<GraduationCap className="text-primary-500" \/> Hazrat Aisha\s+<\/h1>/, `<h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center gap-2 truncate">
          {logoUrl ? <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" /> : <GraduationCap className="text-primary-500 shrink-0" />} 
          <span className="truncate">{schoolName.replace(' Academy', '')}</span>
        </h1>`);

fs.writeFileSync(file, c);
