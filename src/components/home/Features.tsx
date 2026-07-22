import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { motion } from 'motion/react';
import { 
  BookOpen, Users, ShieldCheck, Laptop, Heart, Award, 
  Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const whyChooseUsFeatures = [
  {
    icon: BookOpen,
    badge: 'Dual Curriculum',
    title: 'Integrated CBSE & Deeniyat',
    desc: 'NCERT aligned modern academics (Science, Math, English, Computer) seamlessly integrated with authentic Islamic studies, Tajweed, and Hadith.',
    benefits: ['NCERT/CBSE Standards', 'Tajweed & Quran Recitation', 'Arabic & Islamic Ethics'],
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    borderColor: 'hover:border-emerald-500/40'
  },
  {
    icon: Users,
    badge: 'Expert Faculty',
    title: 'Qualified & Caring Educators',
    desc: 'Passionate subject specialists and trained Islamic scholars dedicated to academic excellence, moral discipline, and compassionate mentoring.',
    benefits: ['Experienced Teachers', 'Continuous Mentorship', 'Moral Guidance'],
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    borderColor: 'hover:border-amber-500/40'
  },
  {
    icon: Laptop,
    badge: 'EdTech & ERP',
    title: 'Smart Digital Learning',
    desc: 'Audio-visual smart classrooms and a 100% digital ERP portal connecting parents directly with daily homework, marks, and attendance.',
    benefits: ['Smart Classrooms', 'Parent Mobile ERP Portal', 'Instant Notifications'],
    iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    borderColor: 'hover:border-teal-500/40'
  },
  {
    icon: Heart,
    badge: 'Holistic Growth',
    title: 'Character & Adab Focus',
    desc: 'Fostering humility, respect for elders, leadership, public speaking, and strong moral character through daily Islamic practical routines.',
    benefits: ['Daily Supplications (Duas)', 'Character Building', 'Leadership Mentoring'],
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    borderColor: 'hover:border-rose-500/40'
  },
  {
    icon: ShieldCheck,
    badge: 'Campus Safety',
    title: 'Safe & Hygienic Environment',
    desc: 'CCTV monitored safe campus with pure RO drinking water, clean sanitation facilities, and an encouraging, peaceful Islamic atmosphere.',
    benefits: ['CCTV Security', 'Purified RO Water', 'Hygiene & First Aid'],
    iconBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    borderColor: 'hover:border-sky-500/40'
  },
  {
    icon: Award,
    badge: 'Track Record',
    title: 'Proven Academic Distinction',
    desc: 'Over a decade of academic excellence in Sitamarhi, Bihar, with 100% board examination pass rates and top student competition ranks.',
    benefits: ['100% Board Pass Rate', 'Regular Term Exams', 'Student Awards & Medals'],
    iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    borderColor: 'hover:border-indigo-500/40'
  },
];

export const Features = () => (
  <section className="py-24 px-6 relative z-10 overflow-hidden bg-slate-900/40 dark:bg-slate-950/60 border-y border-slate-200/50 dark:border-slate-800/80">
    {/* Decorative Background Elements */}
    <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

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
          <span>The Academy Advantage</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Why Choose Hazrat Aisha Academy?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground font-normal">
          We combine modern academic rigor with Islamic moral values, providing your child with a complete foundation for success in this world and the Hereafter.
        </p>
      </motion.div>

      {/* Luxury Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {whyChooseUsFeatures.map((f, idx) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <GlassCard className={`p-8 h-full flex flex-col justify-between transition-all duration-300 ${f.borderColor} group hover:shadow-2xl hover:shadow-emerald-950/5`}>
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl ${f.iconBg} group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {f.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-normal">
                    {f.desc}
                  </p>
                </div>

                {/* Key Benefits List */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2">
                  {f.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-none" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Exploration CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <Link 
          to="/about" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all border border-emerald-500/20 hover:scale-105"
        >
          <span>Learn More About Our Philosophy & Vision</span>
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </section>
);
