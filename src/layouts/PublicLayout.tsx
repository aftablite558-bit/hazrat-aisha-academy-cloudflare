import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GlassButton } from '../components/common/GlassComponents';
import { Menu, X, GraduationCap } from 'lucide-react';

const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <GraduationCap className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-none">HAZRAT AISHA</h1>
                <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest mt-1">Academy Sitamarhi</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
              <Link to="/academics" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Academics</Link>
              <Link to="/admissions" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Admissions</Link>
              <Link to="/gallery" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Gallery</Link>
              <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Contact</Link>
              <Link to="/login">
                <GlassButton variant="primary" size="sm">ERP Login</GlassButton>
              </Link>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      <footer className="bg-slate-950 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2026 Hazrat Aisha Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
