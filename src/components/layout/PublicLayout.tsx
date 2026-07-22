import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { School, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PremiumNavbar } from '../common/PremiumNavbar';
import { PremiumButton } from '../common/PremiumButton';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Admissions', path: '/apply' },
    { label: 'Results', path: '/results' },
    { label: 'Notice Board', path: '/notices' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Gallery', path: '/gallery' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PremiumNavbar
        sticky
        leftContent={
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-emerald-700 p-2.5 rounded-2xl shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform duration-500">
              <School className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-black text-neutral-900 tracking-tighter block leading-none">HAZRAT AISHA</span>
              <span className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase leading-none">Academy Academy</span>
            </div>
          </Link>
        }
        centerContent={
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        }
        rightContent={
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="hidden sm:block">
              <PremiumButton variant="outline" size="sm">
                ERP Portal
              </PremiumButton>
            </Link>
            <Link to="/apply">
              <PremiumButton size="sm">
                Apply Now
              </PremiumButton>
            </Link>
            <button 
              className="lg:hidden p-2.5 bg-neutral-50 rounded-2xl text-neutral-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        }
      />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden flex flex-col"
            >
              <div className="p-8 border-b border-neutral-50 flex items-center justify-between">
                <span className="font-black text-neutral-900">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-neutral-50 rounded-xl">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 p-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                      location.pathname === item.path
                        ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/10'
                        : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="p-8 border-t border-neutral-50 space-y-3">
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block">
                  <PremiumButton variant="outline" className="w-full">ERP Portal</PremiumButton>
                </Link>
                <Link to="/apply" onClick={() => setIsMenuOpen(false)} className="block">
                  <PremiumButton className="w-full">Apply Now</PremiumButton>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-neutral-900 text-white pt-24 pb-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-600 p-2 rounded-xl">
                  <School className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter">HAZRAT AISHA</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                Empowering the next generation with authentic Islamic values and modern academic excellence.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-emerald-500 uppercase tracking-widest text-[10px]">Quick Links</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li><Link to="/apply" className="hover:text-white transition-colors">Admissions</Link></li>
                <li><Link to="/results" className="hover:text-white transition-colors">Results Portal</Link></li>
                <li><Link to="/notices" className="hover:text-white transition-colors">Notice Board</Link></li>
                <li><Link to="/calendar" className="hover:text-white transition-colors">Academic Calendar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-emerald-500 uppercase tracking-widest text-[10px]">Contact Us</h4>
              <ul className="space-y-4 text-sm text-neutral-400">
                <li>Chak Rajopatti, Sitamarhi</li>
                <li>Bihar, India</li>
                <li>info@hazrataisha.edu</li>
                <li>+91 98765 43210</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-emerald-500 uppercase tracking-widest text-[10px]">Newsletter</h4>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">Subscribe to get the latest updates and announcements.</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button className="bg-emerald-600 p-2 rounded-xl hover:bg-emerald-700 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-neutral-500">&copy; {new Date().getFullYear()} Hazrat Aisha Academy. All rights reserved.</p>
            <div className="flex space-x-8 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </footer>
    </div>
  );
};
