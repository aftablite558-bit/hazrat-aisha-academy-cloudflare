import { useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { useMasterData } from '../../hooks/useMasterData';
import { GalleryAlbum } from '../../types/content';
import { Image as ImageIcon, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export const GalleryPage = () => {
  const { data: albums, loading } = useMasterData<GalleryAlbum>('gallery');

  const publishedAlbums = useMemo(() => {
    return albums.filter(a => a.isPublished).sort((a,b) => new Date(b.eventDate || 0).getTime() - new Date(a.eventDate || 0).getTime());
  }, [albums]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <PageHeader title="Photo Gallery" description="Memories and moments captured at Hazrat Aisha Academy." />
        
        <Section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-20">Loading gallery...</div>
            ) : publishedAlbums.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">No albums available.</div>
            ) : (
              publishedAlbums.map((a, idx) => (
                <motion.div key={a.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
                  <GlassCard className="overflow-hidden group h-full flex flex-col cursor-pointer hover:border-primary-500/50 transition-colors">
                    <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-800">
                      {a.images?.[0] ? (
                        <img src={a.images[0]} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ImageIcon size={48} className="opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 truncate">{a.title}</h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <Calendar size={14} />
                          {new Date(a.eventDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                        <ImageIcon size={12} /> {a.images?.length || 1} Photos
                      </div>
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
