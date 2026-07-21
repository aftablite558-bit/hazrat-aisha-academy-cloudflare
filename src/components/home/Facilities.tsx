import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, Microscope, BookOpen, ShieldCheck, Trophy, 
  Droplet, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const campusFacilities = [
  {
    id: 'smart-classrooms',
    icon: Monitor,
    title: 'Smart Audio-Visual Classrooms',
    category: 'Digital Infrastructure',
    desc: 'Spacious, well-ventilated classrooms equipped with digital projectors, audio-visual learning tools, and ergonomic seating for comfortable interactive learning.',
    highlights: ['Interactive Projectors', 'Ergonomic Student Desks', 'Audio-Visual Lessons', 'Digital Attendance Readers'],
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'labs',
    icon: Microscope,
    title: 'Modern Science & Computer Labs',
    category: 'Academic Practical Labs',
    desc: 'Dedicated state-of-the-art computer and science laboratories where students gain hands-on practical experience in physics, chemistry, biology, and computer programming.',
    highlights: ['High-speed Internet', 'Modern Lab Apparatus', 'Individual Workstations', 'Supervised Experiments'],
    gradient: 'from-teal-500/20 to-cyan-500/20',
    iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
  },
  {
    id: 'library',
    icon: BookOpen,
    title: 'Islamic & CBSE Resource Library',
    category: 'Knowledge Hub',
    desc: 'A quiet, well-organized library stocked with NCERT textbooks, reference encyclopedias, Islamic jurisprudence books, Seerah literature, and children Islamic storybooks.',
    highlights: ['Over 3,000+ Books', 'Seerah & Islamic Reference', 'Quiet Reading Study Zone', 'Weekly Library Hours'],
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  },
  {
    id: 'safety',
    icon: ShieldCheck,
    title: 'Safe Campus & CCTV Security',
    category: 'Student Safety',
    desc: '24/7 CCTV surveillance covering all corridors and common campus areas, along with trained security staff and strict visitor entry protocols for total peace of mind.',
    highlights: ['24/7 CCTV Monitoring', 'Secured Campus Perimeter', 'Strict Visitor Logs', 'First Aid Station'],
    gradient: 'from-rose-500/20 to-pink-500/20',
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
  },
  {
    id: 'sports',
    icon: Trophy,
    title: 'Sports & Activity Playground',
    category: 'Physical Fitness',
    desc: 'Open playground space facilitating organized sports matches, cricket, badminton, athletics, and physical fitness sessions promoting healthy bodily development.',
    highlights: ['Badminton & Volleyball', 'Annual Sports Day', 'Supervised Physical Training', 'Team Spirit Building'],
    gradient: 'from-indigo-500/20 to-purple-500/20',
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
  },
  {
    id: 'hygiene',
    icon: Droplet,
    title: 'Purified RO Water & Clean Sanitation',
    category: 'Health & Hygiene',
    desc: 'Multi-stage RO water filtration systems providing cold, purified drinking water across campus, paired with regularly sanitized, separate washroom facilities.',
    highlights: ['Multi-Stage RO Purifiers', 'Separate Restrooms', 'Daily Sanitation Routine', 'Clean Wash Stations'],
    gradient: 'from-sky-500/20 to-blue-500/20',
    iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
  },
];

export const Facilities = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles size={14} className="text-amber-400" />
            <span>Campus Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            World-Class School Facilities
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            Designed to nurture physical, intellectual, and spiritual growth in a secure, hygienic, and modern Islamic academic environment in Sitamarhi.
          </p>
        </motion.div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campusFacilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <motion.div
                key={fac.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <GlassCard className="p-8 h-full flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-emerald-950/5 relative overflow-hidden">
                  {/* Decorative Subtle Corner Accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${fac.gradient} rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity`} />

                  <div>
                    {/* Header Icon & Category Tag */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className={`p-3.5 rounded-2xl ${fac.iconBg} group-hover:scale-110 transition-transform shadow-inner`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        {fac.category}
                      </span>
                    </div>

                    {/* Facility Title & Description */}
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors relative z-10">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-normal relative z-10">
                      {fac.desc}
                    </p>
                  </div>

                  {/* Highlights Bullet Checklist */}
                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2 relative z-10">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Key Highlights</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {fac.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          <CheckCircle2 size={13} className="text-emerald-500 flex-none" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* View Full Facilities Page Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link 
            to="/facilities" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all border border-emerald-500/20 hover:scale-105"
          >
            <span>Explore All Campus Facilities & Infrastructure</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
