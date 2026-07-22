import { useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { useMasterData } from '../../hooks/useMasterData';
import { AlumniProfile } from '../../types/content';
import { GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export const Alumni = () => {
  const { data: alumni, loading } = useMasterData<AlumniProfile>('alumni');

  const publishedAlumni = useMemo(() => {
    return alumni.filter(a => a.isPublished);
  }, [alumni]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Alumni</span>
          </h1>
          <p className="text-lg text-muted-foreground">Discover the inspiring journeys of our graduates making a difference worldwide.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20">Loading alumni profiles...</div>
          ) : publishedAlumni.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground">No alumni profiles available at the moment.</div>
          ) : (
            publishedAlumni.map((a, idx) => (
              <motion.div key={a.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
                <GlassCard className="h-full flex flex-col items-center text-center p-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-primary-500/20 bg-slate-100 flex items-center justify-center">
                    {a.photoUrl ? (
                      <img src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap size={40} className="text-slate-400" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{a.name}</h3>
                  <div className="text-primary-500 font-semibold mb-4">Batch of {a.batch}</div>
                  
                  <div className="mb-6 space-y-1">
                    <div className="font-medium">{a.profession}</div>
                    <div className="text-sm text-muted-foreground">{a.company}</div>
                  </div>
                  
                  {a.achievement && (
                    <div className="mt-auto pt-6 border-t border-white/10 text-sm italic text-muted-foreground">
                      "{a.achievement}"
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
