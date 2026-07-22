import React from 'react';
import { Card } from '../common/GlassCard';
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
    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    variant: 'emerald' as const,
    glow: 'emerald' as const,
  },
  {
    icon: Users,
    badge: 'Expert Faculty',
    title: 'Qualified & Caring Educators',
    desc: 'Passionate subject specialists and trained Islamic scholars dedicated to academic excellence, moral discipline, and compassionate mentoring.',
    benefits: ['Experienced Teachers', 'Continuous Mentorship', 'Moral Guidance'],
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    variant: 'gold' as const,
    glow: 'gold' as const,
  },
  {
    icon: Laptop,
    badge: 'EdTech & ERP',
    title: 'Smart Digital Learning',
    desc: 'Audio-visual smart classrooms and a 100% digital ERP portal connecting parents directly with daily homework, marks, and attendance.',
    benefits: ['Smart Classrooms', 'Parent Mobile ERP Portal', 'Instant Notifications'],
    iconBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30',
    variant: 'teal' as const,
    glow: 'emerald' as const,
  },
  {
    icon: Heart,
    badge: 'Holistic Growth',
    title: 'Character & Adab Focus',
    desc: 'Fostering humility, respect for elders, leadership, public speaking, and strong moral character through daily Islamic practical routines.',
    benefits: ['Daily Supplications (Duas)', 'Character Building', 'Leadership Mentoring'],
    iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
    variant: 'luxury' as const,
    glow: 'amber' as const,
  },
  {
    icon: ShieldCheck,
    badge: 'Campus Safety',
    title: 'Safe & Hygienic Environment',
    desc: 'CCTV monitored safe campus with pure RO drinking water, clean sanitation facilities, and an encouraging, peaceful Islamic atmosphere.',
    benefits: ['CCTV Security', 'Purified RO Water', 'Hygiene & First Aid'],
    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    variant: 'emerald' as const,
    glow: 'emerald' as const,
  },
  {
    icon: Award,
    badge: 'Track Record',
    title: 'Proven Academic Distinction',
    desc: 'Over a decade of academic excellence in Sitamarhi, Bihar, with 100% board examination pass rates and top student competition ranks.',
    benefits: ['100% Board Pass Rate', 'Regular Term Exams', 'Student Awards & Medals'],
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    variant: 'gold' as const,
    glow: 'gold' as const,
  },
];

export const Features = () => (
  <section className="py-24 px-6 relative z-10 overflow-hidden bg-gradient-to-b from-slate-950/80 via-emerald-950/20 to-slate-950/80 border-y border-emerald-500/10">
    {/* Decorative Background Elements */}
    <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-7xl mx-auto relative">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16 space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-widest shadow-md">
          <Sparkles size={14} className="text-amber-400 animate-pulse" />
          <span>The Academy Advantage</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Hazrat Aisha Academy</span>?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl mx-auto">
          We combine modern academic rigor with authentic Islamic moral values, providing your child with a complete foundation for success in this world and the Hereafter.
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
              <Card 
                variant={f.variant} 
                glow={f.glow} 
                gradientBorder 
                className="p-8 h-full flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300"
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl ${f.iconBg} group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 dark:bg-white/5 text-amber-400 border border-white/15">
                      {f.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-foreground mb-3 group-hover:text-emerald-400 transition-colors tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-normal">
                    {f.desc}
                  </p>
                </div>

                {/* Key Benefits List */}
                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  {f.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2.5 text-xs font-semibold text-foreground/90">
                      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 size={13} />
                      </div>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </Card>
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
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-xl shadow-emerald-950/40 border border-emerald-400/30 transition-all hover:scale-105"
        >
          <span>Learn More About Our Philosophy & Vision</span>
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  </section>
);

