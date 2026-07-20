import { useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassBadge } from '../../components/common/GlassBadge';
import { useMasterData } from '../../hooks/useMasterData';
import { Notice } from '../../types/content';
import { FileText, Download } from 'lucide-react';
import { motion } from 'motion/react';

export const NoticeBoard = () => {
  const { data: notices, loading } = useMasterData<Notice>('notices');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const publishedNotices = useMemo(() => {
    return notices
      .filter(n => n.isPublished)
      .sort((a,b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [notices]);

  const filteredNotices = useMemo(() => {
    if (activeCategory === 'All') return publishedNotices;
    return publishedNotices.filter(n => n.category === activeCategory);
  }, [publishedNotices, activeCategory]);

  const categories = ['All', ...Array.from(new Set(publishedNotices.map(n => n.category)))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
        <PageHeader title="Notice Board" description="Latest announcements and updates from the school." />
        
        <Section className="mt-8">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-white/10 text-foreground hover:bg-white/20 border border-white/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20">Loading notices...</div>
            ) : filteredNotices.length === 0 ? (
              <GlassCard className="p-12 text-center text-muted-foreground">No notices found.</GlassCard>
            ) : (
              filteredNotices.map((n, idx) => (
                <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row gap-6 border-l-4" style={{ borderLeftColor: n.priority === 'High' ? '#f43f5e' : '#3b82f6' }}>
                    <div className="flex-shrink-0 w-32 text-center md:text-left">
                      <div className="text-3xl font-bold text-primary-500">{new Date(n.publishDate).getDate()}</div>
                      <div className="text-sm font-semibold uppercase text-muted-foreground">{new Date(n.publishDate).toLocaleString('default', { month: 'short', year: 'numeric' })}</div>
                      <div className="mt-2"><GlassBadge variant={n.priority === 'High' ? 'danger' : 'default'}>{n.priority}</GlassBadge></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{n.title}</h3>
                        <GlassBadge variant="default" className="text-xs">{n.category}</GlassBadge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 whitespace-pre-wrap">{n.description}</p>
                      
                      {n.attachmentUrl && (
                        <a href={n.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-500 rounded-lg hover:bg-primary-500/20 transition-colors text-sm font-medium">
                          <FileText size={16} /> View Attachment <Download size={14} className="ml-2" />
                        </a>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};
