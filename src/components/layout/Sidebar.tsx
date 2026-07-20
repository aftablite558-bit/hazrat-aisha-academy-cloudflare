import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, Bell, Calendar, GraduationCap, ClipboardList, BookMarked, Wallet, Image, FileText, UserCircle, X, Shield, Contact, Download, Home, Book, FileBarChart, PenTool } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { motion, AnimatePresence } from 'motion/react';
import { logout } from '../../firebase/authService';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const GlassSidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getMenuItems = () => {
    if (profile?.role === 'teacher') {
      return [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher' },
        { icon: ClipboardList, label: 'Attendance', path: '/teacher/attendance' },
        { icon: Book, label: 'Homework', path: '/teacher/homework' },
        { icon: PenTool, label: 'Exam Marks', path: '/teacher/exam-marks' },
        { icon: BookMarked, label: 'Results', path: '/teacher/results' },
      ];
    }
    
    return [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Students', path: '/dashboard/students' },
      { icon: UserCircle, label: 'Teachers', path: '/dashboard/teachers' },
      { icon: Shield, label: 'Staff', path: '/dashboard/staff' },
      { icon: Home, label: 'Classes', path: '/dashboard/classes' },
      { icon: BookOpen, label: 'Subjects', path: '/dashboard/subjects' },
      { icon: ClipboardList, label: 'Attendance', path: '/dashboard/attendance' },
      { icon: Book, label: 'Homework', path: '/dashboard/homework' },
      { icon: PenTool, label: 'Exam Marks', path: '/dashboard/exam-marks' },
      { icon: BookMarked, label: 'Results', path: '/dashboard/results' },
      { icon: Contact, label: 'Admissions', path: '/dashboard/admissions' },
      { icon: Wallet, label: 'Fees', path: '/dashboard/fees' },
      { icon: Image, label: 'Gallery', path: '/dashboard/gallery' },
      { icon: FileText, label: 'Notice Board', path: '/dashboard/notices' },
      { icon: Download, label: 'Downloads', path: '/dashboard/downloads' },
      { icon: Calendar, label: 'Academic Calendar', path: '/dashboard/calendar' },
      { icon: Shield, label: 'Facilities', path: '/dashboard/facilities' },
      { icon: Contact, label: 'Careers', path: '/dashboard/careers' },
      { icon: Users, label: 'Alumni', path: '/dashboard/alumni' },
      { icon: Contact, label: 'Contact', path: '/dashboard/contact' },
      { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
      { icon: FileBarChart, label: 'Reports', path: '/dashboard/reports' },
      { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
      { icon: Shield, label: 'User Management', path: '/dashboard/users' },
      { icon: Shield, label: 'Audit Logs', path: '/dashboard/audit-logs' },
    ];
  };

  const menuItems = getMenuItems();

  const sidebarContent = (
    <>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center gap-2">
          <GraduationCap className="text-primary-500" /> Hazrat Aisha
        </h1>
        {onClose && (
          <button className="lg:hidden p-3 rounded-full glass hover:bg-white/10 transition-colors" onClick={onClose}>
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
              `flex items-center gap-4 px-4 py-3.5 rounded-full transition-all relative overflow-hidden ${
                isActive
                  ? 'text-white bg-[rgba(6,182,212,0.4)] backdrop-blur-xl border border-[rgba(6,182,212,0.5)] shadow-[0_0_20px_rgba(6,182,212,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] font-bold'
                  : 'text-secondary-foreground font-medium hover:bg-white/20 dark:hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="relative z-10 mt-4 border-t border-white/20 pt-4">
        <GlassButton variant="glass" className="w-full" onClick={handleLogout}>Logout</GlassButton>
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
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden w-[280px] max-w-[80vw] bg-[rgba(255,255,255,0.20)] dark:bg-[rgba(30,41,59,0.25)] backdrop-blur-[32px] border border-[rgba(255,255,255,0.25)] dark:border-[rgba(255,255,255,0.1)] border-l-0 rounded-none rounded-r-[32px] p-6 flex flex-col overflow-hidden shadow-[12px_0_40px_rgba(0,0,0,0.12),inset_4px_4px_12px_rgba(255,255,255,0.18)] dark:shadow-[12px_0_40px_rgba(0,0,0,0.3)]"
            >
              {/* Liquid Glass Highlights & Animation */}
              <div className="absolute inset-0 pointer-events-none -z-10 rounded-none rounded-r-[32px] overflow-hidden">
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
