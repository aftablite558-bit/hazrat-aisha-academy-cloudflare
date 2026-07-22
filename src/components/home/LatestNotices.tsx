import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Download, Calendar, Bell, Sparkles } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { GlassCard } from '../common/GlassCard';
import { useMasterData } from '../../hooks/useMasterData';
import { Notice } from '../../types/content';
import { motion } from 'motion/react';

export const LatestNotices = () => {
  const { data: notices, loading } = useMasterData<Notice>('notices');
  
  const publishedNotices = notices
    .filter(n => n.isPublished)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);

  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
              <Bell size={14} className="text-amber-400 animate-bounce" />
              <span>Official Circulars</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Latest Notices & Announcements
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-normal">
              Stay connected with exam dates, holiday notifications, academic schedules, and official school circulars.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/notices">
              <GlassButton variant="outline" className="px-6 py-3 text-xs font-bold rounded-2xl flex items-center gap-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10">
                <span>View All Circulars</span>
                <ArrowRight size={16} />
              </GlassButton>
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center p-16">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : publishedNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedNotices.map((notice, idx) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 h-full flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-2xl hover:shadow-emerald-950/10 relative overflow-hidden">
                  <div>
                    {/* Top Date & Category Pills */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-inner">
                        <FileText size={22} />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                        {notice.category || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                      <Calendar size={13} />
                      <span>{new Date(notice.publishDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>

                    {/* Notice Title & Description */}
                    <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-normal mb-6">
                      {notice.description}
                    </p>
                  </div>

                  {/* Attachment Download Action */}
                  <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
                    {notice.attachmentUrl ? (
                      <a href={notice.attachmentUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <GlassButton variant="glass" className="w-full py-2.5 px-4 text-xs font-bold rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2 border border-emerald-500/20">
                          <Download size={14} /> Download PDF Circular
                        </GlassButton>
                      </a>
                    ) : (
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>Official Notice</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <GlassCard className="text-center p-12">
            <p className="text-sm text-muted-foreground font-medium">No recent circulars available at this moment.</p>
          </GlassCard>
        )}
      </div>
    </section>
  );
};
