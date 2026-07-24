import { Bell, Search, Sun, Moon, User, LogOut, Settings, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { GlassButton } from '../common/GlassButton';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const GlassHeader = ({ onMenuClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { profile, logoutUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load notifications periodically or on mount
    const loadNotifs = () => {
      const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
      // Filter for admin if the role matches
      if (['owner', 'super_admin', 'admin', 'principal'].includes(profile?.role || '')) {
        setNotifications(stored.filter((n: any) => n.role === 'admin' || !n.role).reverse());
      } else {
        setNotifications(stored.filter((n: any) => n.role === profile?.role).reverse());
      }
    };
    loadNotifs();
    const interval = setInterval(loadNotifs, 5000);
    return () => clearInterval(interval);
  }, [profile]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = stored.map((n: any) => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updated));
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 glass border-t-0 border-x-0 border-b-white/30 dark:border-b-white/10 shadow-sm flex items-center justify-between px-4 lg:px-8 z-40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-full glass hover:bg-white/10" onClick={onMenuClick}>
          <Menu />
        </button>
        <div className="hidden md:flex items-center gap-4 glass rounded-full px-6 py-2.5 w-64 lg:w-96 shadow-inner bg-white/5 dark:bg-black/5">
          <Search size={20} className="text-muted-foreground" />
          <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-full text-foreground placeholder-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <GlassButton variant="ghost" className="p-2 rounded-full glass hover:bg-white/10 transition-colors" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-secondary-foreground" />}
        </GlassButton>
        
        <div className="relative" ref={notifRef}>
          <GlassButton variant="ghost" className="p-2 relative rounded-full glass hover:bg-white/10 transition-colors" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-background"></span>
            )}
          </GlassButton>
          
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-80 glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 dark:bg-black/10">
                <h4 className="font-bold flex items-center gap-2">Notifications {unreadCount > 0 && <span className="bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>}</h4>
                {unreadCount > 0 && <button className="text-xs text-primary-500 hover:underline" onClick={markAllRead}>Mark all as read</button>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-primary-500/5' : ''}`}>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                      <p className="text-xs text-primary-500 mt-2">{new Date(n.date).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 pl-4 border-l border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowDropdown(!showDropdown)}
          >
              <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-foreground">{profile?.displayName || 'User'}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile?.role || '...'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {profile?.photoUrl ? (
                    <img src={profile.photoUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile?.displayName?.charAt(0) || 'U'
                  )}
              </div>
          </div>
          
          {showDropdown && (
            <div className="absolute right-0 mt-4 w-56 glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-white/10 bg-white/5 dark:bg-black/10">
                <p className="font-bold truncate">{profile?.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.email || ''}</p>
              </div>
              <div className="p-2">
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 rounded-xl flex items-center gap-3 transition-colors"
                  onClick={() => { setShowDropdown(false); navigate('/dashboard/profile'); }}
                >
                  <User size={16} /> Profile Settings
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 rounded-xl flex items-center gap-3 transition-colors text-danger-500"
                  onClick={logoutUser}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
