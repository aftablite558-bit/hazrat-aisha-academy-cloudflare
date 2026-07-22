import { useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { useMasterData } from '../../hooks/useMasterData';
import { Facility } from '../../types/content';
import { motion } from 'motion/react';

export const FacilitiesPage = () => {
  const { data: facilities, loading } = useMasterData<Facility>('facilities');

  const publishedFacilities = useMemo(() => {
    return facilities.filter(f => f.isPublished).sort((a,b) => (a.displayOrder||0) - (b.displayOrder||0));
  }, [facilities]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <PageHeader title="Our Facilities" description="World-class infrastructure designed to foster learning, creativity, and growth." />
        
        <Section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {loading ? (
              <div className="col-span-full text-center py-20">Loading facilities...</div>
            ) : publishedFacilities.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">No facilities to display.</div>
            ) : (
              publishedFacilities.map((f, idx) => (
                <motion.div key={f.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <GlassCard className="overflow-hidden group h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden bg-slate-200 dark:bg-slate-800">
                      {f.images?.[0] ? (
                        <img src={f.images[0]} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Image Available</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-bold text-white">{f.title}</h3>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 flex-grow">
                      <p className="text-muted-foreground leading-relaxed">{f.description}</p>
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
