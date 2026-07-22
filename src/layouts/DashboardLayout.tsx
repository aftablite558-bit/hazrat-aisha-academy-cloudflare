import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  Search
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { GlassCard, cn } from '../components/common/GlassComponents';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Students', path: '/dashboard/master/students' },
    { icon: GraduationCap, label: 'Teachers', path: '/dashboard/master/teachers' },
    { icon: BookOpen, label: 'Academic', path: '/dashboard/academic' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/content/calendar' },
    { icon: Bell, label: 'Notices', path: '/dashboard/content/notices' },
    { icon: Settings, label: 'Settings', path: '/dashboard/enterprise/settings' },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen z-50 transition-all duration-500 p-4",
        isCollapsed ? "w-24" : "w-72"
      )}
    >
      <GlassCard className="h-full flex flex-col bg-slate-900/60 border-white/10 p-4">
        <div className="flex items-center justify-between mb-10 px-2">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                <GraduationCap className="text-emerald-400 w-6 h-6" />
              </div>
              <span className="font-black text-white tracking-tight">HAA ERP</span>
            </div>
          )}
          {isCollapsed && (
             <div className="w-10 h-10 mx-auto bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                <GraduationCap className="text-emerald-400 w-6 h-6" />
              </div>
          )}
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "text-emerald-400")} />
                {!isCollapsed && <span className="font-bold">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
          >
            <LogOut className="w-6 h-6" />
            {!isCollapsed && <span className="font-bold">Logout</span>}
          </button>
        </div>
      </GlassCard>
    </aside>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar isCollapsed={isCollapsed} />
      
      <main className={cn(
        "flex-grow transition-all duration-500 p-8 pt-6",
        isCollapsed ? "ml-24" : "ml-72"
      )}>
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-3 glass rounded-2xl hover:bg-white/10 text-white transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Marhaba, <span className="text-emerald-400 font-amiri text-4xl">{user?.name}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:border-emerald-500/50 outline-none transition-all w-64"
              />
            </div>
            <div className="flex items-center gap-3 glass-card p-2 pr-6 rounded-2xl cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center font-bold text-slate-900">
                {user?.name?.[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
