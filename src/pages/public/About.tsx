import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { AboutSection } from '../../components/home/AboutSection';
import { Stats } from '../../components/home/Stats';
import { Features } from '../../components/home/Features';
import { Card } from '../../components/common/GlassCard';
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
          <Card variant="emerald" glow="emerald" gradientBorder className="p-8 h-full border-emerald-500/30">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 w-fit mb-4 shadow-md group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-extrabold mb-3 text-foreground tracking-tight">Academic Philosophy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We follow a rigorous NCERT/CBSE curriculum that emphasizes conceptual clarity, scientific inquiry, critical thinking, digital literacy, and fluent English communication skills.
            </p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <Card variant="gold" glow="gold" gradientBorder className="p-8 h-full border-amber-500/30">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 w-fit mb-4 shadow-md group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-extrabold mb-3 text-foreground tracking-tight">Islamic Character Building</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Daily Quranic recitation with proper Tajweed, Seerah studies, Islamic jurisprudence, etiquettes (Adab), and morning supplications form the core of daily campus life.
            </p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <Card variant="teal" glow="emerald" gradientBorder className="p-8 h-full border-teal-500/30">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-600 dark:text-teal-400 w-fit mb-4 shadow-md group-hover:scale-110 transition-transform">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-extrabold mb-3 text-foreground tracking-tight">Community & Location</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Situated in Dilawarbagh, Sharif Colony, Chak Rajopatti, Sitamarhi, Bihar (843302), serving families seeking standard education within an authentic Islamic environment.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>

    <Stats />
    <Features />
  </PublicLayout>
);

