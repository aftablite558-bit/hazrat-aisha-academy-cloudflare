import React, { useEffect, useState, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { motion, useInView } from 'motion/react';
import { Users, GraduationCap, Award, ShieldCheck, BookOpen, Smartphone } from 'lucide-react';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * (end - start) + start);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const statsData = [
  {
    numericValue: 1200,
    suffix: '+',
    title: 'Enrolled Scholars',
    subtitle: 'Nursery to Secondary Grades',
    desc: 'Bright young minds receiving integrated academic & moral education.',
    icon: GraduationCap,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    borderColor: 'hover:border-emerald-500/40'
  },
  {
    numericValue: 50,
    suffix: '+',
    title: 'Qualified Teachers',
    subtitle: 'Subject Experts & Hafiz-e-Quran',
    desc: 'Compassionate educators dedicated to student excellence & mentoring.',
    icon: Users,
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-500 dark:text-amber-400',
    borderColor: 'hover:border-amber-500/40'
  },
  {
    numericValue: 10,
    suffix: '+ Yrs',
    title: 'Legacy of Trust',
    subtitle: 'Serving Sitamarhi & Bihar',
    desc: 'Over a decade of educational leadership and community trust.',
    icon: Award,
    gradient: 'from-teal-500/20 to-cyan-500/20',
    iconColor: 'text-teal-500 dark:text-teal-400',
    borderColor: 'hover:border-teal-500/40'
  },
  {
    numericValue: 100,
    suffix: '%',
    title: 'CBSE Pass Rate',
    subtitle: 'Consistent Board Performance',
    desc: 'Outstanding academic achievements and board exam success.',
    icon: BookOpen,
    gradient: 'from-indigo-500/20 to-purple-500/20',
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    borderColor: 'hover:border-indigo-500/40'
  },
  {
    numericValue: 15,
    suffix: ':1',
    title: 'Student-Teacher Ratio',
    subtitle: 'Personalized Attention',
    desc: 'Small class sizes ensuring every child receives direct guidance.',
    icon: ShieldCheck,
    gradient: 'from-emerald-500/20 to-emerald-700/20',
    iconColor: 'text-emerald-600 dark:text-emerald-300',
    borderColor: 'hover:border-emerald-500/40'
  },
  {
    numericValue: 100,
    suffix: '%',
    title: 'Digital ERP Portal',
    subtitle: 'Real-time Parent Connectivity',
    desc: 'Instant online access to attendance, marks, homework & notices.',
    icon: Smartphone,
    gradient: 'from-sky-500/20 to-blue-500/20',
    iconColor: 'text-sky-500 dark:text-sky-400',
    borderColor: 'hover:border-sky-500/40'
  },
];

export const Stats = () => {
  return (
    <section className="py-20 px-6 relative z-10 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />

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
            <span>By The Numbers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Our Educational Impact & Achievements
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            Measuring our dedication to academic excellence, moral character, and digital innovation at Hazrat Aisha Academy.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <GlassCard className={`p-8 h-full relative overflow-hidden transition-all duration-300 ${stat.borderColor} group hover:shadow-xl hover:shadow-emerald-950/5`}>
                  {/* Subtle Top Gradient Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />

                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className={`p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 ${stat.iconColor} group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon size={26} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-full">
                      {stat.subtitle}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-4xl sm:text-5xl font-black tracking-tight text-foreground flex items-baseline gap-1">
                      <AnimatedNumber value={stat.numericValue} suffix={stat.suffix} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {stat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {stat.desc}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
