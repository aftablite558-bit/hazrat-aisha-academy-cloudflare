import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, MapPin, Mail, MessageCircle, ExternalLink, GraduationCap, 
  Sparkles, ShieldCheck, Heart, ArrowUpRight
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative mt-24 bg-slate-950 text-slate-300 transition-colors border-t border-emerald-900/30 overflow-hidden">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Multi-Column Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: School Info & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-950/50">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="text-emerald-400" size={22} />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-black text-white leading-tight">Hazrat Aisha Academy</h2>
                <p className="text-xs font-arabic text-amber-300">حضرت عائشہ اکیڈمی</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Cultivating academic excellence aligned with CBSE standards alongside authentic Islamic values, moral character, and modern digital literacy in Sitamarhi, Bihar.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-emerald-400 flex-none mt-0.5" />
                <span>Dilawarbagh, Sharif Colony, Chak Rajopatti, Sitamarhi, Bihar – 843302</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-amber-400 flex-none" />
                <a href="tel:+919470818538" className="hover:text-amber-300 transition-colors font-mono">+91 9470818538</a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" /> Quick Links
            </h3>
            <ul className="text-xs space-y-2.5 font-medium">
              <li><Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Home</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> About Us & Philosophy</Link></li>
              <li><Link to="/academics" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Academics & CBSE</Link></li>
              <li><Link to="/admissions" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Online Admissions 2026-27</Link></li>
              <li><Link to="/notices" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Official Notice Board</Link></li>
              <li><Link to="/gallery" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Photo Gallery</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Portals & Information */}
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <ShieldCheck size={14} className="text-teal-400" /> Portals & Info
            </h3>
            <ul className="text-xs space-y-2.5 font-medium">
              <li><Link to="/results" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Exam Results Portal</Link></li>
              <li><Link to="/attendance" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Student Attendance Portal</Link></li>
              <li><Link to="/homework" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Daily Homework Assignments</Link></li>
              <li><Link to="/calendar" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Academic Calendar</Link></li>
              <li><Link to="/facilities" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Campus Facilities</Link></li>
              <li><Link to="/careers" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Careers & Teacher Hiring</Link></li>
              <li><Link to="/feedback" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"><ArrowUpRight size={12} className="opacity-40" /> Parent Feedback</Link></li>
            </ul>
          </div>

          {/* Column 4: Location Map & Direct Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <MapPin size={14} className="text-emerald-400" /> Campus Location
            </h3>

            {/* Google Map Card Placeholder */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
              <div className="h-32 bg-slate-800 relative flex items-center justify-center p-4 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="text-center z-10">
                  <div className="w-8 h-8 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                    <MapPin size={18} />
                  </div>
                  <p className="text-[11px] font-bold text-white mt-1">Sitamarhi, Bihar</p>
                  <p className="text-[10px] text-slate-400">Chak Rajopatti • 843302</p>
                </div>
              </div>
              <div className="p-3 bg-slate-900 flex items-center justify-between border-t border-slate-800">
                <span className="text-[10px] text-slate-400 font-medium">Google Maps Location</span>
                <a 
                  href="https://maps.google.com/?q=Chak+Rajopatti,+Sitamarhi,+Bihar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  Directions <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Direct Social / Connect Button */}
            <div className="pt-2">
              <a 
                href="https://wa.me/919470818538" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle size={16} className="text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Hazrat Aisha Academy. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Built with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500 inline" />
            <span>for Educational Excellence in Sitamarhi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
