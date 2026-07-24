import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, GraduationCap } from 'lucide-react';
import { useMasterData } from '../../hooks/useMasterData';
import { SystemSettings } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { GlassButton } from '../common/GlassButton';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { data: settings } = useMasterData<SystemSettings>('settings');
  const schoolName = settings?.[0]?.schoolName || 'Hazrat Aisha Academy';
  const logoUrl = settings?.[0]?.logoUrl;
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Attendance', path: '/attendance' },
    { label: 'Homework', path: '/homework' },
    { label: 'Exam Schedule', path: '/exam-schedule' },
    { label: 'Results', path: '/results' },
    { label: 'Notice Board', path: '/notices' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Achievements', path: '/achievements' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Alumni', path: '/alumni' },
    { label: 'Feedback', path: '/feedback' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ];

  const navGroups = [
    {
      title: 'MAIN',
      links: [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
      ]
    },
    {
      title: 'ACADEMICS',
      links: [
        { label: 'Admissions', path: '/admissions' },
        { label: 'Attendance', path: '/attendance' },
        { label: 'Homework', path: '/homework' },
        { label: 'Exam Schedule', path: '/exam-schedule' },
        { label: 'Results', path: '/results' },
      ]
    },
    {
      title: 'SCHOOL',
      links: [
        { label: 'Academics', path: '/academics' },
        { label: 'Facilities', path: '/facilities' },
        { label: 'Notice Board', path: '/notices' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'Achievements', path: '/achievements' },
        { label: 'Testimonials', path: '/testimonials' },
        { label: 'Alumni', path: '/alumni' },
      ]
    },
    {
      title: 'SUPPORT',
      links: [
        { label: 'Feedback', path: '/feedback' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' },
      ]
    }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border-t-0 border-x-0 border-b border-white/30 dark:border-white/10 rounded-none shadow-sm">
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 min-h-[5rem] py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" /> : <GraduationCap size={28} className="text-primary-500" />}
            <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 truncate max-w-[200px] sm:max-w-none">{schoolName}</h1>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 flex-1 min-w-0">
            {navGroups.map((group) => {
              if (group.title === 'MAIN') {
                return group.links.map((link) => (
                  <NavLink key={link.path} to={link.path} className="text-sm font-semibold text-secondary-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap shrink-0">
                    {link.label}
                  </NavLink>
                ));
              }
              return (
                <div key={group.title} className="relative group/nav">
                  <button className="flex items-center gap-1 text-sm font-semibold text-secondary-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap py-4 shrink-0">
                    {group.title}
                    <ChevronDown size={14} className="group-hover/nav:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                    <div className="w-56 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-xl flex flex-col gap-1">
                      {group.links.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          className={({ isActive }) =>
                            "px-4 py-2 text-sm rounded-xl transition-colors " + (
                              isActive
                                ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400'
                            )
                          }
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <GlassButton variant="ghost" className="p-2 shrink-0" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-secondary-foreground" />}
            </GlassButton>
            <NavLink to="/login" className="shrink-0">
              <GlassButton variant="primary">Login</GlassButton>
            </NavLink>
          </div>

          {/* Mobile Toggle */}
          <GlassButton variant="ghost" className="lg:hidden p-2 flex-shrink-0" onClick={() => setIsOpen(true)}>
            <Menu className="text-secondary-foreground" />
          </GlassButton>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 lg:hidden bg-[rgba(0,0,0,0.18)] backdrop-blur-none"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 lg:hidden w-[82vw] bg-[rgba(255,255,255,0.20)] dark:bg-[rgba(30,41,59,0.25)] backdrop-blur-[32px] border border-[rgba(255,255,255,0.25)] dark:border-[rgba(255,255,255,0.1)] border-r-0 rounded-none rounded-l-[32px] flex flex-col h-[100dvh] overflow-hidden shadow-[-12px_0_40px_rgba(0,0,0,0.12),inset_4px_4px_12px_rgba(255,255,255,0.18)] dark:shadow-[-12px_0_40px_rgba(0,0,0,0.3)]"
            >
              {/* Liquid Glass Highlights & Animation */}
              <div className="absolute inset-0 pointer-events-none -z-10 rounded-none rounded-l-[32px] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-white/40 to-transparent" />
                <div className="absolute top-0 -left-[100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 animate-shimmer" />
              </div>

              <div className="flex-none flex justify-end px-6 pt-6 pb-2 relative z-10">
                <button className="p-3 rounded-full glass hover:bg-white/10 transition-colors" onClick={() => setIsOpen(false)}>
                  <X size={24} className="text-secondary-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4 relative z-10 flex flex-col gap-6">
                {navGroups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-2">
                    <h2 className="text-xs font-semibold text-muted-foreground tracking-wider px-6">{group.title}</h2>
                    {group.links.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `px-6 py-3 rounded-2xl text-lg font-medium transition-all relative overflow-hidden ${
                            isActive 
                              ? 'text-white bg-[rgba(6,182,212,0.4)] backdrop-blur-xl border border-[rgba(6,182,212,0.5)] shadow-[0_0_20px_rgba(6,182,212,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)]'
                              : 'text-secondary-foreground hover:bg-white/20 dark:hover:bg-white/5'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex-none px-6 pb-6 pt-2 border-t border-white/20 dark:border-white/10 flex items-center justify-between relative z-10">
                <button className="p-3 rounded-full glass hover:bg-white/10 transition-colors" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-secondary-foreground" />}
                </button>
                <NavLink to="/login" onClick={() => setIsOpen(false)}>
                  <GlassButton variant="primary">Login</GlassButton>
                </NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
