import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Award, Sparkles, Calendar, CheckCircle2 } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { GlassCard } from '../common/GlassCard';
import { useMasterData } from '../../hooks/useMasterData';
import { Achievement } from '../../types/content';
import { motion } from 'motion/react';

export const AchievementsPreview = () => {
  const { data: achievements, loading } = useMasterData<Achievement>('achievements');
  
  const publishedAchievements = achievements
    .filter(a => a.isPublished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // top 3

  if (!loading && publishedAchievements.length === 0) return null;

  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              <Trophy size={14} className="text-amber-400" />
              <span>Honors & Awards</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Student & Faculty Achievements
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-normal">
              Celebrating the academic victories, Islamic competition awards, and honors achieved by our academy family.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/achievements">
              <GlassButton variant="outline" className="px-6 py-3 text-xs font-bold rounded-2xl flex items-center gap-2 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10">
                <span>View All Achievements</span>
                <ArrowRight size={16} />
              </GlassButton>
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center p-16">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedAchievements.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="p-0 overflow-hidden h-full flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-amber-950/10">
                  {/* Image / Icon Banner */}
                  {achievement.imageUrl ? (
                    <div className="aspect-video relative overflow-hidden bg-slate-900">
                      <img 
                        src={achievement.imageUrl} 
                        alt={achievement.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-amber-500/90 text-slate-950 font-black rounded-full text-[10px] uppercase tracking-wider backdrop-blur-md shadow-md">
                          {achievement.category || 'Award'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-emerald-500/10 flex items-center justify-center text-amber-500 relative overflow-hidden">
                      <Trophy size={56} className="group-hover:scale-110 transition-transform duration-500 text-amber-400 opacity-90" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-amber-500/90 text-slate-950 font-black rounded-full text-[10px] uppercase tracking-wider shadow-md">
                          {achievement.category || 'Award'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
                        <Calendar size={13} className="text-amber-500" />
                        <span>{new Date(achievement.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-normal">
                        {achievement.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Award size={14} /> Official Academy Distinction
                      </span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
