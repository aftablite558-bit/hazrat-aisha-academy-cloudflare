import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { useMasterData } from '../../hooks/useMasterData';
import { GalleryAlbum } from '../../types/content';

export const GalleryPreview = () => {
  const { data: albums, loading } = useMasterData<GalleryAlbum>('gallery');
  
  const publishedAlbums = albums
    .filter(a => a.isPublished && a.images && a.images.length > 0)
    .slice(0, 3); // Top 3 albums

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-primary-500/5 dark:bg-primary-900/10 skew-y-3 -z-10"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 mb-4">Life at Hazrat Aisha</h2>
            <p className="text-muted-foreground text-lg">Glimpses of our vibrant campus, events, and academic activities.</p>
          </div>
          <Link to="/gallery">
            <GlassButton variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              View Full Gallery <ArrowRight size={18} />
            </GlassButton>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : publishedAlbums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedAlbums.map((album) => (
              <div key={album.id} className="group relative rounded-3xl overflow-hidden aspect-[4/3] glass">
                <img 
                  src={album.images[0]} 
                  alt={album.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end opacity-90 transition-opacity">
                  <h3 className="text-xl font-bold text-white mb-2">{album.title}</h3>
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                     <span className="flex items-center gap-1"><ImageIcon size={14} /> {album.images.length} Photos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center p-12 glass rounded-3xl">
             <p className="text-muted-foreground">Gallery is currently being updated.</p>
           </div>
        )}
      </div>
    </section>
  );
};
