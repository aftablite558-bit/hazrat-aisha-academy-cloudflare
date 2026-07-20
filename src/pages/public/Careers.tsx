import { useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassBadge } from '../../components/common/GlassBadge';
import { useMasterData } from '../../hooks/useMasterData';
import { CareerVacancy } from '../../types/content';
import { Briefcase, Calendar, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export const Careers = () => {
  const { data: careers, loading } = useMasterData<CareerVacancy>('careers');

  const activeCareers = useMemo(() => {
    return careers.filter(c => c.status === 'Active');
  }, [careers]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Join Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Team</span>
          </h1>
          <p className="text-lg text-muted-foreground">Shape the future with us. Explore current openings at Hazrat Aisha Academy.</p>
        </motion.div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20">Loading vacancies...</div>
          ) : activeCareers.length === 0 ? (
            <GlassCard className="p-12 text-center text-muted-foreground">No open vacancies at the moment. Please check back later.</GlassCard>
          ) : (
            activeCareers.map((c, idx) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <GlassCard className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{c.jobTitle}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Briefcase size={16} /> {c.department}</span>
                        <span className="flex items-center gap-1.5"><GraduationCap size={16} /> {c.qualification}</span>
                        {c.lastDate && <span className="flex items-center gap-1.5 text-rose-500"><Calendar size={16} /> Last date: {c.lastDate}</span>}
                      </div>
                    </div>
                    <GlassBadge variant="success" className="w-fit">Active</GlassBadge>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none mb-6">
                    <p>{c.description}</p>
                    <p className="text-sm font-semibold mt-4">Required Experience: {c.experience}</p>
                  </div>
                  
                  <a href="/contact" className="inline-flex items-center justify-center h-10 px-6 rounded-full font-medium transition-colors bg-primary-500 text-white hover:bg-primary-600">
                    Apply Now
                  </a>
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
