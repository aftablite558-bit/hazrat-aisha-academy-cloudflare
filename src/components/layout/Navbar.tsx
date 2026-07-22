import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, GraduationCap, ChevronDown, 
  Sparkles, Calendar, BookOpen, UserCheck, Award, 
  Users, MessageSquare, Briefcase, FileText, ArrowRight, ShieldCheck, MapPin, Phone
} from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Scroll listener for sticky behavior & auto hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > 120) {
        if (currentScrollY > prevScrollY && currentScrollY - prevScrollY > 10) {
          setVisible(false); // scrolling down
        } else if (prevScrollY - currentScrollY > 10) {
          setVisible(true); // scrolling up
        }
      } else {
        setVisible(true);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

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

  // Primary top links
  const primaryNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'Admissions', path: '/admissions' },
    { label: 'Notice Board', path: '/notices' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  // Portals & Quick Tools Dropdown items
  const portalItems = [
    { label: 'Exam Results Portal', path: '/results', icon: Award, desc: 'View student marks & report cards' },
    { label: 'Attendance Portal', path: '/attendance', icon: UserCheck, desc: 'Daily attendance & register' },
    { label: 'Daily Homework', path: '/homework', icon: BookOpen, desc: 'Classwise subject assignments' },
    { label: 'Academic Calendar', path: '/calendar', icon: Calendar, desc: 'Holidays & exam schedules' },
    { label: 'Facilities & Campus', path: '/facilities', icon: ShieldCheck, desc: 'Infrastructure & smart labs' },
    { label: 'Student Achievements', path: '/achievements', icon: Sparkles, desc: 'Rankings & awards' },
    { label: 'Alumni Network', path: '/alumni', icon: Users, desc: 'Former students community' },
    { label: 'Careers & Hiring', path: '/careers', icon: Briefcase, desc: 'Teacher recruitment openings' },
    { label: 'Parent Feedback', path: '/feedback', icon: MessageSquare, desc: 'Share suggestions & reviews' },
  ];

  // Mobile drawer category groups
  const mobileNavGroups = [
    {
      title: 'MAIN NAVIGATION',
      links: [
        { label: 'Home Page', path: '/' },
        { label: 'About Academy', path: '/about' },
        { label: 'Academics & CBSE', path: '/academics' },
        { label: 'Online Admissions', path: '/admissions' },
        { label: 'Notice Board', path: '/notices' },
        { label: 'Photo Gallery', path: '/gallery' },
        { label: 'Contact Us', path: '/contact' },
      ]
    },
    {
      title: 'ACADEMIC PORTALS',
      links: [
        { label: 'Check Exam Results', path: '/results' },
        { label: 'Attendance Register', path: '/attendance' },
        { label: 'Daily Homework', path: '/homework' },
        { label: 'Academic Calendar', path: '/calendar' },
      ]
    },
    {
      title: 'CAMPUS & COMMUNITY',
      links: [
        { label: 'School Facilities', path: '/facilities' },
        { label: 'Achievements', path: '/achievements' },
        { label: 'Alumni Network', path: '/alumni' },
        { label: 'Testimonials', path: '/testimonials' },
        { label: 'Careers', path: '/careers' },
        { label: 'Parent Feedback', path: '/feedback' },
      ]
    }
  ];

  return (
    <>
      {/* Top Emergency/Announcement Ribbon */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-[11px] font-semibold py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-300">
              <Sparkles size={12} className="animate-pulse" /> Admissions Open 2026-27
            </span>
            <span className="opacity-40">|</span>
            <span className="opacity-90">Chak Rajopatti, Sitamarhi, Bihar</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100">
            <a href="tel:+919470818538" className="hover:text-amber-300 transition-colors flex items-center gap-1">
              <Phone size={11} /> +91 9470818538
            </a>
            <span className="opacity-40">|</span>
            <span className="font-arabic text-amber-200">رَبِّ زِدْنِي عِلْمًا</span>
          </div>
        </div>
      </div>

      {/* Primary Sticky Header */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 sm:top-7 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-emerald-500/10 dark:border-white/10 shadow-lg shadow-emerald-950/5' 
            : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/20 dark:border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <GraduationCap className="text-emerald-600 dark:text-emerald-400" size={24} />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {schoolName}
                </h1>
              </div>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase flex items-center gap-1">
                Sitamarhi, Bihar • English Medium & Islamic Values
              </p>
            </div>
          </NavLink>

          {/* Desktop Nav Items */}
          <div className="hidden xl:flex items-center gap-1">
            {primaryNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'text-emerald-700 dark:text-emerald-300' 
                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/15 rounded-xl border border-emerald-500/20 dark:border-emerald-400/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </NavLink>
              );
            })}

            {/* Portals & Quick Tools Dropdown */}
            <div className="relative ml-1" onMouseLeave={() => setPortalsOpen(false)}>
              <button
                onClick={() => setPortalsOpen(!portalsOpen)}
                onMouseEnter={() => setPortalsOpen(true)}
                aria-expanded={portalsOpen}
                aria-label="Portals & Tools menu"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  portalsOpen
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5'
                }`}
              >
                <span>Portals & Tools</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${portalsOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              <AnimatePresence>
                {portalsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 z-50 grid grid-cols-1 gap-1"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Quick Academic Access</p>
                    </div>
                    {portalItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setPortalsOpen(false)}
                          className={`p-2 rounded-xl transition-all flex items-start gap-3 group/item ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'hover:bg-emerald-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover/item:scale-110 transition-transform">
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400">{item.label}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                        </NavLink>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <GlassButton
              variant="ghost"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 transition-colors ml-1"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </GlassButton>

            {/* Login CTA */}
            <NavLink to="/login" className="ml-2">
              <GlassButton variant="primary" className="px-5 py-2.5 text-xs font-extrabold shadow-md shadow-emerald-600/20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
                Portal Login
              </GlassButton>
            </NavLink>
          </div>

          {/* Mobile Actions */}
          <div className="flex xl:hidden items-center gap-2">
            <GlassButton variant="ghost" className="p-2 rounded-xl" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </GlassButton>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              aria-label="Open mobile navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 xl:hidden bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 xl:hidden w-[88vw] max-w-md bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col h-[100dvh] overflow-hidden shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex-none p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-900/10 to-teal-900/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">{schoolName}</h3>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Sitamarhi • Bihar</p>
                  </div>
                </div>
                <button 
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Close mobile navigation menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {mobileNavGroups.map((group) => (
                  <div key={group.title} className="space-y-1.5">
                    <h4 className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase px-2">{group.title}</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {group.links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                            }`}
                          >
                            <span>{link.label}</span>
                            <ArrowRight size={14} className={isActive ? 'text-white' : 'opacity-30'} />
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Footer Actions */}
              <div className="flex-none p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <NavLink to="/login" onClick={() => setIsOpen(false)}>
                  <GlassButton variant="primary" className="w-full py-3 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center gap-2">
                    <GraduationCap size={16} /> Portal Login
                  </GlassButton>
                </NavLink>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Switch Theme</span>
                  <GlassButton variant="ghost" className="p-2 rounded-xl" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
                  </GlassButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
