import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative mt-20 transition-colors">
      <div className="glass rounded-t-[32px] border-b-0 border-x-0 shadow-none border-t border-white/30 dark:border-white/10 relative z-10 py-12 px-6 overflow-hidden">
        {/* Liquid Glass Highlights & Animation */}
        <div className="absolute inset-0 pointer-events-none -z-10 rounded-t-[32px] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-primary-500 mb-4">Hazrat Aisha Academy</h2>
            <p className="text-sm text-muted-foreground">Dilawarbagh, Sharif Colony,<br />Chak Rajopatti, Sitamarhi, Bihar – 843302</p>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Quick Links</h3>
            <ul className="text-sm text-muted-foreground space-y-2 font-medium">
              <li><Link to="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-primary-500 transition-colors">Academics</Link></li>
              <li><Link to="/admissions" className="hover:text-primary-500 transition-colors">Admissions</Link></li>
              <li><Link to="/gallery" className="hover:text-primary-500 transition-colors">Photo Gallery</Link></li>
              <li><Link to="/notices" className="hover:text-primary-500 transition-colors">Notice Board</Link></li>
              <li><Link to="/contact" className="hover:text-primary-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Portals & Info</h3>
            <ul className="text-sm text-muted-foreground space-y-2 font-medium">
              <li><Link to="/results" className="hover:text-primary-500 transition-colors">Exam Results</Link></li>
              <li><Link to="/attendance" className="hover:text-primary-500 transition-colors">Attendance Portal</Link></li>
              <li><Link to="/homework" className="hover:text-primary-500 transition-colors">Daily Homework</Link></li>
              <li><Link to="/careers" className="hover:text-primary-500 transition-colors">Careers & Openings</Link></li>
              <li><Link to="/feedback" className="hover:text-primary-500 transition-colors">Parent Feedback</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-foreground">Contact & Connect</h3>
            <p className="text-sm text-muted-foreground font-mono">Phone: +91 9470818538</p>
            <p className="text-sm text-muted-foreground mt-1">Location: Sitamarhi, Bihar</p>
            <div className="flex gap-4 mt-4">
              <a href="https://wa.me/919470818538" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Contact on WhatsApp">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center mt-12 pt-6 border-t border-slate-200/50 dark:border-white/10 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Hazrat Aisha Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
