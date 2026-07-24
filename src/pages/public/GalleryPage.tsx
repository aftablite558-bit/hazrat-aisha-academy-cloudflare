import { useMemo, useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassModal } from '../../components/common/GlassModal';
import { useMasterData } from '../../hooks/useMasterData';
import { GalleryAlbum } from '../../types/content';
import { Image as ImageIcon, Calendar, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const GalleryPage = () => {
  const { data: albums, loading } = useMasterData<GalleryAlbum>('gallery');
  
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const publishedAlbums = useMemo(() => {
    return albums.filter(a => a.isPublished).sort((a,b) => new Date(b.eventDate || 0).getTime() - new Date(a.eventDate || 0).getTime());
  }, [albums]);

  useEffect(() => {
    const handleNext = () => {
      if (selectedAlbum && lightboxIndex !== null && selectedAlbum.images) {
        setLightboxIndex((lightboxIndex + 1) % selectedAlbum.images.length);
      }
    };

    const handlePrev = () => {
      if (selectedAlbum && lightboxIndex !== null && selectedAlbum.images) {
        setLightboxIndex((lightboxIndex - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, selectedAlbum]);

  const handleNextBtn = () => {
    if (selectedAlbum && lightboxIndex !== null && selectedAlbum.images) {
      setLightboxIndex((lightboxIndex + 1) % selectedAlbum.images.length);
    }
  };

  const handlePrevBtn = () => {
    if (selectedAlbum && lightboxIndex !== null && selectedAlbum.images) {
      setLightboxIndex((lightboxIndex - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <PageHeader title="Photo Gallery" description="Memories and moments captured at Hazrat Aisha Academy." />
        
        <Section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">Loading gallery...</div>
            ) : publishedAlbums.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">No albums available.</div>
            ) : (
              publishedAlbums.map((a, idx) => (
                <motion.div key={a.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
                  <div className="glass rounded-2xl overflow-hidden group h-full flex flex-col cursor-pointer hover:border-primary-500/50 transition-colors" onClick={() => setSelectedAlbum(a)}>
                    <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-800">
                      {a.images && a.images.length > 0 && a.images[0] ? (
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
                        <ImageIcon size={12} /> {a.images?.length || 0} Photos
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Section>
      </main>

      <GlassModal 
        isOpen={!!selectedAlbum && lightboxIndex === null} 
        onClose={() => setSelectedAlbum(null)} 
        title={selectedAlbum?.title || ''}
        
      >
        {selectedAlbum && (
          <div className="space-y-6">
            <p className="text-muted-foreground">{selectedAlbum.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedAlbum.images?.map((img, idx) => (
                <div 
                  key={idx} 
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative bg-slate-100 dark:bg-slate-800"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img src={img} alt={`${selectedAlbum.title} ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              {(!selectedAlbum.images || selectedAlbum.images.length === 0) && (
                <div className="col-span-full py-12 text-center text-muted-foreground">No images in this album.</div>
              )}
            </div>
          </div>
        )}
      </GlassModal>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && selectedAlbum?.images && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center touch-none"
          >
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors z-50"
            >
              <X size={24} />
            </button>
            
            <button 
              onClick={handlePrevBtn}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-white/10 rounded-full transition-colors z-50"
            >
              <ChevronLeft size={32} />
            </button>

            <button 
              onClick={handleNextBtn}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-white/10 rounded-full transition-colors z-50"
            >
              <ChevronRight size={32} />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-full z-50">
              {lightboxIndex + 1} / {selectedAlbum.images.length}
            </div>

            <motion.div 
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full p-4 md:p-12 flex items-center justify-center max-w-6xl mx-auto"
            >
              <img 
                src={selectedAlbum.images[lightboxIndex]} 
                alt="" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};
