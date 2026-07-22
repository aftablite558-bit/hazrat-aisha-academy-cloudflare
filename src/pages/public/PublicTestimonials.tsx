import { useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { useMasterData } from '../../hooks/useMasterData';
import { Testimonial } from '../../types/content';
import { Star, User, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicTestimonials = () => {
  const { data: testimonials, loading } = useMasterData<Testimonial>('testimonials');

  const publishedTestimonials = useMemo(() => {
    return testimonials.filter(t => t.isPublished).sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [testimonials]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <PageHeader title="Testimonials" description="Hear what our students, parents, and alumni say about us." />
        
        <Section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">Loading testimonials...</div>
            ) : publishedTestimonials.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground">No testimonials available yet.</div>
            ) : (
              publishedTestimonials.map((t, idx) => (
                <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                  <GlassCard className="h-full flex flex-col p-8 relative">
                    <div className="absolute top-8 right-8 text-primary-500/10">
                      <Quote size={64} />
                    </div>
                    
                    <div className="flex gap-1 mb-6 text-amber-500 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < t.rating ? 'currentColor' : 'none'} className={i >= t.rating ? 'text-slate-300 dark:text-slate-700' : ''} />
                      ))}
                    </div>
                    
                    <p className="text-foreground/90 italic mb-8 flex-grow relative z-10 text-base leading-relaxed">
                      "{t.content}"
                    </p>
                    
                    <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-white/10">
                      {t.photoUrl ? (
                        <img src={t.photoUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover shadow-md" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                          <User size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                        <p className="text-xs text-primary-500 font-medium uppercase tracking-wider mt-0.5">{t.role}</p>
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
