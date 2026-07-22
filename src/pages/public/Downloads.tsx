import { useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { useMasterData } from '../../hooks/useMasterData';
import { Document } from '../../types/content';
import { FileDown, Search } from 'lucide-react';
import { motion } from 'motion/react';

export const Downloads = () => {
  const { data: docs, loading } = useMasterData<Document>('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const publishedDocs = useMemo(() => {
    return docs.filter(d => d.isPublished).sort((a,b) => a.title.localeCompare(b.title));
  }, [docs]);

  const filteredDocs = useMemo(() => {
    return publishedDocs.filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || d.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [publishedDocs, searchTerm, activeCategory]);

  const categories = ['All', ...Array.from(new Set(publishedDocs.map(d => d.category)))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
        <PageHeader title="Downloads" description="Access important forms, syllabus, and circulars." />
        
        <Section className="mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex flex-wrap gap-2 justify-center">
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
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <GlassInput placeholder="Search documents..." className="pl-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20">Loading documents...</div>
            ) : filteredDocs.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">No documents found.</div>
            ) : (
              filteredDocs.map((d, idx) => (
                <motion.div key={d.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                  <GlassCard className="p-6 flex flex-col h-full hover:border-primary-500/50 transition-colors">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
                        <FileDown size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground leading-tight">{d.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{d.category}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4">
                      <a href={d.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-2.5 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-lg font-medium transition-colors text-sm">
                        Download PDF
                      </a>
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
