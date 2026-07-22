import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  School, 
  Users, 
  ClipboardList, 
  Calendar, 
  Image, 
  MessageSquare, 
  Bell, 
  Menu, 
  X,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Admissions', path: '/admissions' },
  { icon: ClipboardList, label: 'Results', path: '/results' },
  { icon: Bell, label: 'Notices', path: '/notices' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Image, label: 'Gallery', path: '/gallery' },
  { icon: MessageSquare, label: 'Communication', path: '/communication' },
  { icon: Users, label: 'Staff', path: '/staff' },
];

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-emerald-800 p-2 rounded-xl border border-emerald-700">
                <School className="h-8 w-8 text-emerald-200" />
              </div>
              <div>
                <span className="text-xl font-bold block tracking-tight">HAZRAT AISHA</span>
                <span className="text-xs text-emerald-300 font-medium tracking-widest uppercase">Academy ERP</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-emerald-800 text-white shadow-inner'
                      : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-emerald-800 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-emerald-900 border-t border-emerald-800 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium ${
                      location.pathname === item.path
                        ? 'bg-emerald-800 text-white shadow-inner'
                        : 'text-emerald-100 hover:bg-emerald-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-emerald-900 font-bold text-lg mb-4">Hazrat Aisha Academy</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Cultivating character, knowledge, and faith through modern academic excellence 
                integrated with authentic Islamic values.
              </p>
            </div>
            <div>
              <h4 className="text-neutral-900 font-semibold mb-4 text-sm uppercase tracking-wider">Location</h4>
              <p className="text-neutral-500 text-sm">
                Chak Rajopatti, Sitamarhi<br />
                Bihar, India
              </p>
            </div>
            <div>
              <h4 className="text-neutral-900 font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <p className="text-neutral-500 text-sm">
                Email: info@hazrataisha.edu<br />
                Portal: HA-ERP v1.0
              </p>
            </div>
          </div>
          <div className="border-t border-neutral-100 mt-12 pt-8 text-center text-neutral-400 text-xs">
            &copy; {new Date().getFullYear()} Hazrat Aisha Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
