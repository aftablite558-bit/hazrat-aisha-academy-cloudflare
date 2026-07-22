import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, Bell, Calendar, GraduationCap, ClipboardList, BookMarked, Wallet, Image, FileText, UserCircle, X, Shield, Contact, Download, Home, Book, FileBarChart, PenTool, Database, Award, MessageCircle , Briefcase } from 'lucide-react';
import { PremiumButton } from '../common/PremiumComponents';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useMasterData } from '../../hooks/useMasterData';
import { SystemSettings } from '../../types';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const GlassSidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const { data: settings } = useMasterData<SystemSettings>('settings');
  const schoolName = settings?.[0]?.schoolName || 'Hazrat Aisha';
  const logoUrl = settings?.[0]?.logoUrl;
  const navigate = useNavigate();
  const { profile, logoutUser } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getMenuItems = () => {
    if (profile?.role === 'teacher') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher' },
        { icon: Users, label: 'My Classes', path: '/teacher/classes' },
        { icon: ClipboardList, label: 'Attendance', path: '/teacher/attendance' },
        { icon: Book, label: 'Homework', path: '/teacher/homework' },
        { icon: BookMarked, label: 'Result Entry', path: '/teacher/results' },
        { icon: Calendar, label: 'Timetable', path: '/teacher/timetable' },
        { icon: FileText, label: 'Leave Management', path: '/teacher/leave' },
        { icon: Bell, label: 'Notifications', path: '/teacher/notifications' },
        { icon: UserCircle, label: 'My Profile', path: '/teacher/profile' },
      ];
    }
    
    
    const baseItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Students', path: '/dashboard/students' },
      { icon: UserCircle, label: 'Teachers', path: '/dashboard/teachers' },
      { icon: Shield, label: 'Staff', path: '/dashboard/staff' },
      { icon: Home, label: 'Classes', path: '/dashboard/classes' },
      { icon: BookOpen, label: 'Subjects', path: '/dashboard/subjects' },
      { icon: ClipboardList, label: 'Attendance', path: '/dashboard/attendance' },
      { icon: Book, label: 'Homework', path: '/dashboard/homework' },
      { icon: PenTool, label: 'Exam Marks', path: '/dashboard/exam-marks' },
      { icon: Calendar, label: 'Exam Schedule', path: '/dashboard/exam-schedule' },
      { icon: BookMarked, label: 'Results', path: '/dashboard/results' },
    ];
    
    if (['owner', 'super_admin', 'admin', 'principal'].includes(profile?.role || '')) {
      baseItems.push({ icon: Contact, label: 'Admission Requests', path: '/dashboard/admissions' }, { icon: MessageCircle, label: 'Public Feedback', path: '/dashboard/feedback' });
    }
    
    baseItems.push(
      { icon: Wallet, label: 'Fees', path: '/dashboard/fees' },
      { icon: Image, label: 'Gallery', path: '/dashboard/gallery' },
      { icon: Award, label: 'Achievements', path: '/dashboard/achievements' },
      { icon: MessageCircle, label: 'Testimonials', path: '/dashboard/testimonials' },
      { icon: FileText, label: 'Notice Board', path: '/dashboard/notices' },
      { icon: Download, label: 'Downloads', path: '/dashboard/downloads' },
      { icon: Calendar, label: 'Academic Calendar', path: '/dashboard/calendar' },
      { icon: Shield, label: 'Facilities', path: '/dashboard/facilities' },
      { icon: Briefcase, label: 'Careers', path: '/dashboard/careers' },
      { icon: FileText, label: 'Career Requests', path: '/dashboard/career-requests' },
      { icon: Users, label: 'Alumni', path: '/dashboard/alumni' },
      { icon: Contact, label: 'Contact', path: '/dashboard/contact' },
      { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
      { icon: FileBarChart, label: 'Reports', path: '/dashboard/reports' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
      { icon: Shield, label: 'User Management', path: '/dashboard/users' },
      { icon: Shield, label: 'Audit Logs', path: '/dashboard/audit-logs' },
      { icon: Database, label: 'Backup & Restore', path: '/dashboard/backup' }
    );
    
    return baseItems;
  };


  const menuItems = getMenuItems();

  const sidebarContent = (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-300 flex items-center gap-2 truncate">
          {logoUrl ? <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" /> : <GraduationCap className="text-emerald-400 shrink-0" />} 
          <span className="truncate">{schoolName.replace(' Academy', '')}</span>
        </h1>
        {onClose && (
          <button className="lg:hidden p-3 rounded-full glass hover:bg-white/10 transition-colors" onClick={onClose} aria-label="Close sidebar">
            <X size={20} className="text-secondary-foreground" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard' || item.path === '/teacher'}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative overflow-hidden ${
                isActive
                  ? 'text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 backdrop-blur-xl border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.35),inset_0_2px_4px_rgba(255,255,255,0.3)] font-bold'
                  : 'text-secondary-foreground font-medium hover:bg-emerald-500/10 hover:text-emerald-400 dark:hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="relative z-10 mt-4 border-t border-slate-800 pt-4">
        <PremiumButton variant="glass" className="w-full" onClick={handleLogout}>Logout</PremiumButton>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-[280px] h-screen glass rounded-r-[32px] p-6 flex-col fixed left-0 top-0 z-50 hidden lg:flex overflow-hidden">
        {/* Liquid Glass Highlights & Animation */}
        <div className="absolute inset-0 pointer-events-none -z-10 rounded-r-[32px] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-white/40 to-transparent" />
          <div className="absolute top-0 -left-[100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 animate-shimmer" />
        </div>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && onClose && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 lg:hidden w-[280px] max-w-[80vw] bg-[rgba(255,255,255,0.20)] dark:bg-[rgba(30,41,59,0.25)] backdrop-blur-[32px] border border-[rgba(255,255,255,0.25)] dark:border-[rgba(255,255,255,0.1)] border-r-0 rounded-none rounded-l-[32px] p-6 flex flex-col overflow-hidden shadow-[12px_0_40px_rgba(0,0,0,0.12),inset_4px_4px_12px_rgba(255,255,255,0.18)] dark:shadow-[12px_0_40px_rgba(0,0,0,0.3)]"
            >
              {/* Liquid Glass Highlights & Animation */}
              <div className="absolute inset-0 pointer-events-none -z-10 rounded-none rounded-l-[32px] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-white/40 to-transparent" />
                <div className="absolute top-0 -left-[100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 animate-shimmer" />
              </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const Sidebar = GlassSidebar;
export const PremiumSidebar = GlassSidebar;
