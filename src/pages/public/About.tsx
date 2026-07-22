import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { AboutSection } from '../../components/home/AboutSection';
import { Stats } from '../../components/home/Stats';
import { Features } from '../../components/home/Features';
import { GlassCard } from '../../components/common/GlassCard';
import { motion } from 'motion/react';
import { 
  GraduationCap, ShieldCheck, Heart, Award, Sparkles, 
  BookOpen, Users, CheckCircle2, Building2, MapPin
} from 'lucide-react';

export const About = () => (
  <PublicLayout>
    <PageHeader 
      title="About Hazrat Aisha Academy" 
      description="Cultivating Character, Knowledge, and Faith through CBSE-Aligned Modern Academic Excellence Integrated with Authentic Islamic Values in Sitamarhi, Bihar." 
    />
    
    <AboutSection />

    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <GlassCard className="p-8 h-full border-emerald-500/30">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Academic Philosophy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We follow a rigorous NCERT/CBSE curriculum that emphasizes conceptual clarity, scientific inquiry, critical thinking, and fluent English communication skills.
            </p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-8 h-full border-amber-500/30">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Islamic Character Building</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Daily Quranic recitation with proper Tajweed, Seerah studies, Islamic jurisprudence, etiquettes (Adab), and morning supplications form the core of daily campus life.
            </p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-8 h-full border-teal-500/30">
            <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 w-fit mb-4">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Community & Location</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Situated in Dilawarbagh, Sharif Colony, Chak Rajopatti, Sitamarhi, Bihar (843302), serving families seeking standard education within an authentic Islamic environment.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>

    <Stats />
    <Features />
  </PublicLayout>
);
