import { useMemo, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassModal } from '../../components/common/GlassModal';
import { GlassBadge } from '../../components/common/GlassBadge';
import { useMasterData } from '../../hooks/useMasterData';
import { Achievement } from '../../types/content';
import { Trophy, Calendar, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicAchievements = () => {
  const { data: achievements, loading } = useMasterData<Achievement>('achievements');
  
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const publishedAchievements = useMemo(() => {
    return achievements.filter(a => a.isPublished).sort((a,b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [achievements]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <PageHeader title="Our Achievements" description="Celebrating excellence and outstanding accomplishments." />
        
        <Section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">Loading achievements...</div>
            ) : publishedAchievements.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">No achievements available yet.</div>
            ) : (
              publishedAchievements.map((a, idx) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <div className="glass rounded-2xl h-full flex flex-col cursor-pointer hover:-translate-y-1 transition-transform duration-300" onClick={() => setSelectedAchievement(a)}>
                    {a.imageUrl && (
                      <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-t-xl">
                        <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4">
                          <GlassBadge variant="default" className="backdrop-blur-md bg-white/80 dark:bg-black/50 text-foreground">{a.category}</GlassBadge>
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col">
                      {!a.imageUrl && (
                        <div className="mb-4">
                          <GlassBadge variant="default">{a.category}</GlassBadge>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-foreground mb-3">{a.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-grow">
                        {a.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary-500 mt-auto pt-4 border-t border-white/10">
                        <Calendar size={14} />
                        {new Date(a.date).toLocaleDateString('default', { month: 'long', year: 'numeric', day: 'numeric' })}
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
        isOpen={!!selectedAchievement} 
        onClose={() => setSelectedAchievement(null)} 
        title="Achievement Details"
        
      >
        {selectedAchievement && (
          <div className="space-y-6">
            {selectedAchievement.imageUrl && (
              <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={selectedAchievement.imageUrl} alt={selectedAchievement.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{selectedAchievement.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-white/10 pb-4">
                <div className="flex items-center gap-1.5 text-primary-500 font-medium">
                  <Award size={16} /> {selectedAchievement.category}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} /> {new Date(selectedAchievement.date).toLocaleDateString('default', { month: 'long', year: 'numeric', day: 'numeric' })}
                </div>
              </div>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed text-base">
                {selectedAchievement.description}
              </p>
            </div>
          </div>
        )}
      </GlassModal>
      
      <Footer />
    </div>
  );
};
