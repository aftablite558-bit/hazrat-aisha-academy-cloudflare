import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Sun, Moon, GraduationCap, ChevronDown } from 'lucide-react';
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
  const [portalsOpen, setPortalsOpen] = useState(false);
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

  const primaryNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Notice Board', path: '/notices' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  const secondaryPortalLinks = [
    { label: 'Attendance Portal', path: '/attendance' },
    { label: 'Daily Homework', path: '/homework' },
    { label: 'Exam Schedule', path: '/exam-schedule' },
    { label: 'Exam Results', path: '/results' },
    { label: 'Academic Calendar', path: '/calendar' },
    { label: 'School Facilities', path: '/facilities' },
    { label: 'Student Achievements', path: '/achievements' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Alumni Network', path: '/alumni' },
    { label: 'Careers', path: '/careers' },
    { label: 'Feedback', path: '/feedback' },
  ];

  const navGroups = [
    {
      title: 'MAIN',
      links: [
        { label: 'Home', path: '/' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
      ]
    },
    {
      title: 'ACADEMICS & PORTALS',
      links: [
        { label: 'Admissions', path: '/admissions' },
        { label: 'Attendance', path: '/attendance' },
        { label: 'Homework', path: '/homework' },
        { label: 'Exam Schedule', path: '/exam-schedule' },
        { label: 'Results', path: '/results' },
      ]
    },
    {
      title: 'SCHOOL LIFE',
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
      title: 'CONNECT',
      links: [
        { label: 'Feedback', path: '/feedback' },
        { label: 'Careers', path: '/careers' },
      ]
    }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-t-0 border-x-0 border-b border-white/30 dark:border-white/10 rounded-none shadow-sm">
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5">
            {logoUrl ? <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" /> : <GraduationCap size={28} className="text-primary-500" />}
            <h1 className="text-lg md:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 tracking-tight">
              {schoolName}
            </h1>
          </NavLink>
          
          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-5">
            {primaryNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-bold transition-colors ${
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Portals & More Dropdown */}
            <div className="relative" onMouseLeave={() => setPortalsOpen(false)}>
              <button
                onClick={() => setPortalsOpen(!portalsOpen)}
                onMouseEnter={() => setPortalsOpen(true)}
                className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 py-2 transition-colors"
              >
                Portals & Info <ChevronDown size={14} className={`transition-transform duration-200 ${portalsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {portalsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-60 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 grid grid-cols-1 gap-0.5"
                  >
                    {secondaryPortalLinks.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setPortalsOpen(false)}
                        className={({ isActive }) =>
                          `px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                            isActive
                              ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <GlassButton variant="ghost" className="p-2.5 rounded-xl" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </GlassButton>

            <NavLink to="/login">
              <GlassButton variant="primary" className="px-5 font-bold shadow-md">
                Portal Login
              </GlassButton>
            </NavLink>
          </div>

          {/* Mobile Toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <GlassButton variant="ghost" className="p-2 rounded-xl" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </GlassButton>
            <GlassButton variant="ghost" className="p-2.5 rounded-xl" onClick={() => setIsOpen(true)} aria-label="Open navigation menu">
              <Menu size={22} className="text-slate-800 dark:text-slate-200" />
            </GlassButton>
          </div>
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
              className="fixed inset-0 z-40 xl:hidden bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 xl:hidden w-[85vw] max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col h-[100dvh] overflow-hidden shadow-2xl"
            >
              <div className="flex-none flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-900">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Navigation Menu</span>
                <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors" onClick={() => setIsOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
                {navGroups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-1.5">
                    <h2 className="text-[11px] font-bold text-slate-400 tracking-wider px-2 uppercase">{group.title}</h2>
                    {group.links.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            isActive 
                              ? 'bg-primary-600 text-white shadow'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex-none p-6 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-4">
                <GlassButton variant="ghost" className="p-2.5 rounded-xl" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-700" />}
                </GlassButton>
                <NavLink to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                  <GlassButton variant="primary" className="w-full font-bold">
                    Portal Login
                  </GlassButton>
                </NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
