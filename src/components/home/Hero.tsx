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
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-slate-950 text-white pt-10 pb-16">
      {/* Dynamic Background Glows & Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }} 
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-600/30 blur-[130px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }} 
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-teal-600/25 blur-[140px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }} 
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-20 left-1/3 w-[550px] h-[550px] rounded-full bg-amber-500/20 blur-[120px]" 
        />

        {/* Subtle SVG Grid & Arabesque Geometry Overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Floating Rub el Hizb (8-Pointed Islamic Stars) */}
        <motion.div 
          animate={{ y: [-15, 15, -15], rotate: [0, 90, 180, 270, 360] }}
          transition={{ y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 40, repeat: Infinity, ease: 'linear' } }}
          className="absolute top-16 left-[8%] text-amber-400/20 pointer-events-none"
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(0 50 50)" />
            <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="18" />
          </svg>
        </motion.div>

        <motion.div 
          animate={{ y: [15, -15, 15], rotate: [360, 270, 180, 90, 0] }}
          transition={{ y: { duration: 7, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 50, repeat: Infinity, ease: 'linear' } }}
          className="absolute bottom-24 right-[8%] text-emerald-400/20 pointer-events-none"
        >
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(0 50 50)" />
            <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="22" />
          </svg>
        </motion.div>
      </div>

      {/* Main Hero Body */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex-1 flex flex-col justify-center items-center text-center my-auto">
        {/* Quranic Verse Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="inline-flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-xl shadow-emerald-950/40 backdrop-blur-xl group hover:border-amber-500/40 transition-colors">
            <div className="flex items-center gap-2 text-amber-300 font-arabic text-xl tracking-wide">
              <span>رَبِّ زِدْنِي عِلْمًا</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-300">
              <span>"My Lord, increase me in knowledge."</span>
              <span className="opacity-40">•</span>
              <span className="text-amber-300/80 font-mono text-[10px]">Qur'an 20:114</span>
            </div>
          </div>
        </motion.div>

        {/* Main Typography Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-white">
            Hazrat Aisha Academy
            <span className="block text-2xl sm:text-4xl md:text-5xl font-arabic font-normal mt-3 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">
              حضرت عائشہ اکیڈمی
            </span>
          </h1>
        </motion.div>

        {/* Description Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
          className="text-base sm:text-lg md:text-xl text-slate-300 mt-6 mb-8 max-w-3xl leading-relaxed font-normal"
        >
          A premier educational institution in Sitamarhi, Bihar — blending CBSE-aligned modern academic excellence with authentic Islamic values, moral discipline, and digital innovation.
        </motion.p>

        {/* Interactive CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link to="/admissions" className="w-full sm:w-auto">
            <GlassButton 
              variant="primary" 
              className="w-full sm:w-auto px-8 py-4 text-sm font-extrabold rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} className="text-amber-300 animate-pulse" />
              <span>Apply for Admission 2026-27</span>
              <ArrowRight size={16} />
            </GlassButton>
          </Link>

          <Link to="/about" className="w-full sm:w-auto">
            <GlassButton 
              variant="glass" 
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-2xl bg-white/10 dark:bg-slate-900/80 text-slate-200 hover:text-white border border-white/15 hover:border-emerald-500/40 hover:bg-white/15 transition-all flex items-center justify-center gap-2"
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
          className="mt-10 flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-slate-300"
        >
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/20 text-emerald-300">
            <CheckCircle2 size={14} className="text-emerald-400" /> CBSE Curriculum
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/20 text-amber-300">
            <CheckCircle2 size={14} className="text-amber-400" /> Islamic Studies & Deeniyat
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/20 text-emerald-300">
            <CheckCircle2 size={14} className="text-emerald-400" /> Digital ERP & Online Portals
          </span>
        </motion.div>
      </div>

      {/* Integrated Statistics Bar */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl bg-slate-900/90 border border-emerald-500/20 backdrop-blur-2xl shadow-2xl shadow-emerald-950/50"
        >
          <div className="p-4 text-center border-r border-slate-800 last:border-r-0">
            <div className="flex justify-center mb-1 text-emerald-400">
              <GraduationCap size={22} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">1,200+</div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Enrolled Students</div>
          </div>

          <div className="p-4 text-center border-r border-slate-800 last:border-r-0">
            <div className="flex justify-center mb-1 text-amber-400">
              <BookOpen size={22} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">50+</div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Qualified Educators</div>
          </div>

          <div className="p-4 text-center border-r border-slate-800 last:border-r-0">
            <div className="flex justify-center mb-1 text-teal-400">
              <Award size={22} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">10+ Yrs</div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Academic Excellence</div>
          </div>

          <div className="p-4 text-center">
            <div className="flex justify-center mb-1 text-emerald-400">
              <ShieldCheck size={22} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">Pass Percentage</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-10 flex justify-center mt-8">
        <button 
          onClick={scrollToNext} 
          className="p-2 rounded-full text-slate-400 hover:text-emerald-400 transition-colors group flex flex-col items-center gap-1"
          aria-label="Scroll to content"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={20} />
          </motion.div>
        </button>
      </div>
    </section>
  );
};
