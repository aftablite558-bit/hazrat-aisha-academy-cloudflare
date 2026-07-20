import { Bell, Search, Sun, Moon, User, LogOut, Settings, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { GlassButton } from '../common/GlassButton';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const GlassHeader = ({ onMenuClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();

  return (
    <header className="fixed top-0 left-0 lg:left-[280px] right-0 h-20 glass border-t-0 border-x-0 border-b-white/30 dark:border-b-white/10 shadow-sm flex items-center justify-between px-4 lg:px-8 z-40">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-full glass hover:bg-white/10" onClick={onMenuClick}>
          <Menu />
        </button>
        <div className="hidden md:flex items-center gap-4 glass rounded-full px-6 py-2.5 w-64 lg:w-96">
          <Search size={20} className="text-muted-foreground" />
          <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-full text-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        <GlassButton variant="ghost" className="p-2 rounded-full glass hover:bg-white/10" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-secondary-foreground" />}
        </GlassButton>
        <GlassButton variant="ghost" className="p-2"><Bell size={20} /></GlassButton>
        <div className="flex items-center gap-3 pl-4 border-l border-white/20">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">{profile?.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground capitalize">{profile?.role || '...'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                {profile?.displayName?.charAt(0) || 'U'}
            </div>
        </div>
      </div>
    </header>
  );
};
