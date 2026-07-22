import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Calendar, Download } from 'lucide-react';
import { PremiumButton, PremiumNoticeCard, PremiumCard } from '../common/PremiumComponents';
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
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-widest shadow-md">
              <Bell size={14} className="text-amber-400 animate-bounce" />
              <span>Official Circulars</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Latest Notices & Announcements
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Stay connected with exam dates, holiday notifications, academic schedules, and official school circulars.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/notices">
              <PremiumButton variant="outline" size="sm">
                <span>View All Circulars</span>
                <ArrowRight size={16} />
              </PremiumButton>
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
                <PremiumNoticeCard
                  title={notice.title}
                  category={notice.category || 'General'}
                  date={new Date(notice.publishDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  description={notice.description}
                  isImportant={notice.isImportant}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <PremiumCard variant="luxury" className="text-center p-12">
            <p className="text-sm text-muted-foreground font-medium">No recent circulars available at this moment.</p>
          </PremiumCard>
        )}
      </div>
    </section>
  );
};

