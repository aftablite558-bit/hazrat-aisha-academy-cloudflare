import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, Sparkles, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { GlassCard } from '../common/GlassCard';
import { useMasterData } from '../../hooks/useMasterData';
import { GalleryAlbum } from '../../types/content';
import { motion, AnimatePresence } from 'motion/react';

export const GalleryPreview = () => {
  const { data: albums, loading } = useMasterData<GalleryAlbum>('gallery');
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  
  const publishedAlbums = albums
    .filter(a => a.isPublished && a.images && a.images.length > 0)
    .slice(0, 6); // Top 6 published albums for grid

  const openLightbox = (album: GalleryAlbum, index: number = 0) => {
    setSelectedAlbum(album);
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setActiveImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedAlbum) return;
    setActiveImageIndex((prev) => (prev + 1) % selectedAlbum.images.length);
  };

  const prevImage = () => {
    if (!selectedAlbum) return;
    setActiveImageIndex((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
  };

  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden bg-slate-900/30 dark:bg-slate-950/50">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
              <Sparkles size={14} className="text-amber-400" />
              <span>Campus Life & Events</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Life at Hazrat Aisha Academy
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-normal">
              Glimpses of academic celebrations, sports, Islamic competitions, and vibrant daily activities.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/gallery">
              <GlassButton variant="outline" className="px-6 py-3 text-xs font-bold rounded-2xl flex items-center gap-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10">
                <span>View Full Photo Gallery</span>
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
        ) : publishedAlbums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedAlbums.map((album, idx) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <GlassCard 
                  onClick={() => openLightbox(album, 0)}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-950/20"
                >
                  <img 
                    src={album.images[0]} 
                    alt={album.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-6 flex flex-col justify-end transition-opacity">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                        <ImageIcon size={12} /> {album.images.length} Photos
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-bold backdrop-blur-md">
                        {album.category || 'Event'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-amber-300 transition-colors">
                      {album.title}
                    </h3>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Click to view photos</span>
                      <Eye size={14} />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <GlassCard className="text-center p-12">
            <p className="text-sm text-muted-foreground font-medium">Gallery is currently being updated with new school event photos.</p>
          </GlassCard>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full z-10">
              <div>
                <h3 className="text-base sm:text-xl font-bold">{selectedAlbum.title}</h3>
                <p className="text-xs text-emerald-400">
                  Image {activeImageIndex + 1} of {selectedAlbum.images.length}
                </p>
              </div>
              <button 
                onClick={closeLightbox}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close photo preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Lightbox Display Image */}
            <div className="relative max-w-5xl mx-auto w-full flex-1 flex items-center justify-center my-4">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={selectedAlbum.images[activeImageIndex]}
                alt={selectedAlbum.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              {/* Prev / Next Controls */}
              {selectedAlbum.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 p-3 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white transition-all backdrop-blur-md shadow-lg"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 p-3 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white transition-all backdrop-blur-md shadow-lg"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Row */}
            {selectedAlbum.images.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto max-w-4xl mx-auto w-full py-2">
                {selectedAlbum.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-none ${
                      idx === activeImageIndex ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
