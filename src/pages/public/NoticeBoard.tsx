import { useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassBadge } from '../../components/common/GlassBadge';
import { GlassModal } from '../../components/common/GlassModal';
import { useMasterData } from '../../hooks/useMasterData';
import { Notice } from '../../types/content';
import { FileText, Download, Calendar, Tag, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const NoticeBoard = () => {
  const { data: notices, loading } = useMasterData<Notice>('notices');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const publishedNotices = useMemo(() => {
    return notices
      .filter(n => n.isPublished)
      .sort((a,b) => new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime());
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
              <div className="text-center py-20 text-muted-foreground">Loading notices...</div>
            ) : filteredNotices.length === 0 ? (
              <GlassCard className="p-12 text-center text-muted-foreground">No notices found.</GlassCard>
            ) : (
              filteredNotices.map((n, idx) => (
                <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <GlassCard 
                    className="p-6 md:p-8 flex flex-col md:flex-row gap-6 border-l-4 cursor-pointer hover:bg-white/5 transition-colors" 
                    style={{ borderLeftColor: n.priority === 'High' ? '#f43f5e' : '#3b82f6' }}
                    onClick={() => setSelectedNotice(n)}
                  >
                    <div className="flex-shrink-0 w-32 text-center md:text-left">
                      <div className="text-3xl font-bold text-primary-500">{new Date(n.publishDate).getDate()}</div>
                      <div className="text-sm font-semibold uppercase text-muted-foreground">{new Date(n.publishDate).toLocaleString('default', { month: 'short', year: 'numeric' })}</div>
                      <div className="mt-2"><GlassBadge variant={n.priority === 'High' ? 'danger' : 'default'}>{n.priority}</GlassBadge></div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-foreground">{n.title}</h3>
                        <GlassBadge variant="default" className="text-xs">{n.category}</GlassBadge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{n.description}</p>
                      
                      {n.attachmentUrl && (
                        <div className="inline-flex items-center gap-2 text-primary-500 text-sm font-medium">
                          <FileText size={16} /> Contains Attachment
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </Section>
      </main>
      
      <GlassModal 
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        title="Notice Details"
        size="lg"
      >
        {selectedNotice && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{selectedNotice.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-white/10 pb-4">
                <div className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(selectedNotice.publishDate).toLocaleDateString()}</div>
                <div className="flex items-center gap-1.5"><Tag size={16} /> {selectedNotice.category}</div>
                <div className="flex items-center gap-1.5"><AlertCircle size={16} /> Priority: {selectedNotice.priority}</div>
              </div>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                {selectedNotice.description}
              </p>
            </div>
            
            {selectedNotice.attachmentUrl && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <a 
                  href={selectedNotice.attachmentUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium shadow-lg shadow-primary-500/30"
                >
                  <FileText size={18} /> View / Download Attachment <Download size={16} className="ml-1" />
                </a>
              </div>
            )}
          </div>
        )}
      </GlassModal>

      <Footer />
    </div>
  );
};
