import { 
  Plus, 
  Search, 
  Filter,
  Maximize2,
  Calendar
} from 'lucide-react';
import { PremiumButton } from '../components/common/PremiumButton';
import { PremiumCard } from '../components/common/PremiumCard';
import { PremiumInput } from '../components/common/PremiumInput';
import { PremiumSelect } from '../components/common/PremiumSelect';

const Gallery = () => {
  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-tight">School Gallery</h1>
          <p className="text-neutral-500 mt-3 text-lg leading-relaxed">Capturing moments of learning, faith, and academic excellence.</p>
        </div>
        <PremiumButton size="lg" className="shadow-2xl">
          <Plus className="h-5 w-5 mr-2" />
          <span>Upload Media</span>
        </PremiumButton>
      </header>

      {/* Toolbar */}
      <PremiumCard padding="sm" className="mx-4">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <PremiumInput 
              label="Search Gallery"
              placeholder="Search albums, events, or categories..."
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          <div className="flex flex-col md:flex-row items-end gap-4">
            <PremiumSelect 
              label="Category"
              options={[
                { label: 'All Albums', value: 'all' },
                { label: 'Academic', value: 'academic' },
                { label: 'Events', value: 'events' },
                { label: 'Islamic Studies', value: 'islamic' },
                { label: 'Infrastructure', value: 'infrastructure' },
              ]}
              className="min-w-[200px]"
            />
            <PremiumButton variant="outline" className="h-[52px] px-8">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </PremiumButton>
          </div>
        </div>
      </PremiumCard>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
        {[
          { title: 'Annual Day 2023', items: 42, date: 'Oct 12, 2023', category: 'Events', img: 'https://images.unsplash.com/photo-1577891772247-46efcd193d94?auto=format&fit=crop&q=80&w=800' },
          { title: 'Hajj Simulation', items: 15, date: 'Sep 20, 2023', category: 'Islamic', img: 'https://images.unsplash.com/photo-1565039566136-13d8065342a3?auto=format&fit=crop&q=80&w=800' },
          { title: 'Science Exhibition', items: 28, date: 'Aug 15, 2023', category: 'Academic', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800' },
          { title: 'New Library Wing', items: 12, date: 'Jul 30, 2023', category: 'Infrastructure', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
          { title: 'Eid Celebrations', items: 35, date: 'Jun 28, 2023', category: 'Events', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800' },
          { title: 'Quran Recitation', items: 18, date: 'May 15, 2023', category: 'Islamic', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800' },
          { title: 'Football Finals', items: 22, date: 'Apr 20, 2023', category: 'Sports', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800' },
          { title: 'Campus Tour', items: 10, date: 'Mar 10, 2023', category: 'Infrastructure', img: 'https://images.unsplash.com/photo-1541339907198-e08759df9a13?auto=format&fit=crop&q=80&w=800' },
        ].map((album, i) => (
          <PremiumCard key={i} padding="none" className="group overflow-hidden">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img 
                src={album.img} 
                alt={album.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button className="bg-white/10 hover:bg-white/20 p-4 rounded-3xl border border-white/20 transition-all">
                  <Maximize2 className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="absolute top-6 right-6 bg-white shadow-xl px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-800 border border-emerald-50">
                {album.items} Photos
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-emerald-100">
                  {album.category}
                </span>
              </div>
              <h3 className="text-xl font-black text-neutral-900 group-hover:text-emerald-700 transition-colors leading-tight">
                {album.title}
              </h3>
              <div className="flex items-center mt-4 text-xs text-neutral-400 font-bold uppercase tracking-widest">
                <Calendar className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                {album.date}
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
