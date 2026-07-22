import React from 'react';
import { motion } from 'motion/react';
import { GlassButton } from '../common/GlassButton';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, ShieldCheck, Award, GraduationCap, 
  BookOpen, Compass, ChevronDown, CheckCircle2, PhoneCall
} from 'lucide-react';

export const Hero = () => {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-white pt-8 pb-16">
      
      {/* Background Mesh Glows & Gold Orbits */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Main Emerald Backlight */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-emerald-600/30 via-teal-600/20 to-amber-500/20 blur-[140px]" 
        />

        {/* Ambient Gold Halo */}
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/4 -right-20 w-[550px] h-[550px] rounded-full bg-amber-500/15 blur-[130px]" 
        />

        {/* Deep Teal Flare */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }} 
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-emerald-600/20 blur-[120px]" 
        />

        {/* Fine Arabesque Radial Dot Grid */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Rotating Geometric Islamic Rub el Hizb (8-Pointed Gold Star) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-12 left-[6%] text-amber-400/15 pointer-events-none hidden md:block"
        >
          <svg width="180" height="180" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(0 50 50)" />
            <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="22" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="32" />
          </svg>
        </motion.div>

        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 140, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-[6%] text-emerald-400/15 pointer-events-none hidden md:block"
        >
          <svg width="220" height="220" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
            <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(0 50 50)" />
            <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="24" />
            <circle cx="50" cy="50" r="38" strokeDasharray="4 4" />
          </svg>
        </motion.div>
      </div>

      {/* Main Hero Body Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex-1 flex flex-col justify-center items-center text-center my-auto">
        
        {/* Quranic Verse Top Badge Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="inline-flex flex-col items-center gap-1.5 px-6 py-2.5 rounded-3xl bg-slate-900/80 border border-amber-500/30 shadow-2xl shadow-emerald-950/60 backdrop-blur-2xl group hover:border-amber-400/60 transition-all duration-300">
            <div className="flex items-center gap-2 text-amber-300 font-arabic text-xl sm:text-2xl tracking-wide">
              <span>رَبِّ زِدْنِي عِلْمًا</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-emerald-300 tracking-wider uppercase">
              <span>"O My Lord, Increase Me In Knowledge"</span>
              <span className="text-amber-400/60">•</span>
              <span className="text-amber-300/80 font-mono text-[10px]">Qur'an 20:114</span>
            </div>
          </div>
        </motion.div>

        {/* Main Title Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-4">
            <Sparkles size={13} className="text-amber-400 animate-spin" />
            Sitamarhi, Bihar • CBSE Aligned Education
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Hazrat Aisha Academy
            <span className="block text-2xl sm:text-4xl md:text-5xl font-arabic font-normal mt-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300 drop-shadow-md">
              حضرت عائشہ اکیڈمی
            </span>
          </h1>
        </motion.div>

        {/* Subtitle Description */}
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-base sm:text-lg md:text-xl text-slate-200 mt-6 mb-8 max-w-3xl leading-relaxed font-normal"
        >
          Cultivating character, knowledge, and faith through CBSE-aligned modern academic excellence integrated with authentic Islamic values, moral discipline, and digital innovation in Chak Rajopatti, Sitamarhi.
        </motion.p>

        {/* Primary CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link to="/admissions" className="w-full sm:w-auto">
            <GlassButton 
              variant="primary" 
              className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 border border-amber-300/40"
            >
              <Sparkles size={18} className="text-slate-950" />
              <span>Apply for Admission 2026-27</span>
              <ArrowRight size={16} />
            </GlassButton>
          </Link>

          <Link to="/about" className="w-full sm:w-auto">
            <GlassButton 
              variant="glass" 
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-2xl bg-slate-900/80 text-slate-100 hover:text-white border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-950/40 transition-all flex items-center justify-center gap-2"
            >
              <Compass size={18} className="text-emerald-400" />
              <span>Explore Academy</span>
            </GlassButton>
          </Link>

          <a href="https://wa.me/919470818538" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <GlassButton 
              variant="ghost" 
              className="w-full sm:w-auto px-6 py-4 text-sm font-semibold rounded-2xl text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-2 border border-emerald-500/20"
            >
              <PhoneCall size={16} />
              <span>+91 9470818538</span>
            </GlassButton>
          </a>
        </motion.div>

        {/* Feature Highlights Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 flex flex-wrap justify-center items-center gap-3 text-xs font-semibold text-slate-300"
        >
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 backdrop-blur-md">
            <CheckCircle2 size={14} className="text-emerald-400" /> CBSE Aligned Curriculum
          </span>
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 backdrop-blur-md">
            <CheckCircle2 size={14} className="text-amber-400" /> Deeniyat & Quran Tajweed
          </span>
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 backdrop-blur-md">
            <CheckCircle2 size={14} className="text-teal-400" /> Digital ERP Parent Portal
          </span>
        </motion.div>
      </div>

      {/* Integrated Statistics Bar */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/20 backdrop-blur-2xl shadow-2xl shadow-slate-950/80"
        >
          <div className="p-3 sm:p-4 text-center border-r border-slate-800/80 last:border-r-0">
            <div className="flex justify-center mb-1 text-emerald-400">
              <GraduationCap size={22} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-display">1,200+</div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Enrolled Students</div>
          </div>

          <div className="p-3 sm:p-4 text-center border-r border-slate-800/80 last:border-r-0">
            <div className="flex justify-center mb-1 text-amber-400">
              <BookOpen size={22} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-display">50+</div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Qualified Educators</div>
          </div>

          <div className="p-3 sm:p-4 text-center border-r border-slate-800/80 last:border-r-0">
            <div className="flex justify-center mb-1 text-teal-400">
              <Award size={22} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-display">10+ Yrs</div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Academic Legacy</div>
          </div>

          <div className="p-3 sm:p-4 text-center">
            <div className="flex justify-center mb-1 text-emerald-400">
              <ShieldCheck size={22} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-display">100%</div>
            <div className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Board Pass Rate</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-10 flex justify-center mt-6">
        <button 
          onClick={scrollToNext} 
          className="p-2 rounded-full text-slate-400 hover:text-amber-400 transition-colors group flex flex-col items-center gap-1"
          aria-label="Scroll to content"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100">Scroll Down</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={20} />
          </motion.div>
        </button>
      </div>
    </section>
  );
};

