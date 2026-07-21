import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { motion } from 'motion/react';
import { 
  GraduationCap, BookOpen, ShieldCheck, Heart, Sparkles, 
  CheckCircle2, ArrowRight, Award, Compass, Eye, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutSection = () => {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent">
      {/* Background Islamic Geometry Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Top Header Badge & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <Sparkles size={14} className="text-amber-400" />
            <span>Nurturing Faith & Knowledge</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            About Hazrat Aisha Academy
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            Established in Sitamarhi, Bihar to empower the next generation with CBSE-aligned academic brilliance and deep-rooted Islamic values.
          </p>
        </motion.div>

        {/* 2-Column Story & Vision Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Left Column: Academy Legacy & Dual Curriculum Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col"
          >
            <GlassCard className="p-8 sm:p-10 h-full flex flex-col justify-between border-emerald-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-bl-full pointer-events-none blur-2xl" />

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold">
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Our Heritage & Institution</span>
                    <h3 className="text-2xl font-black text-foreground">Excellence in Education, Integrity in Character</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                  <strong className="text-foreground font-bold">Hazrat Aisha Academy</strong> was founded in Dilawarbagh, Sharif Colony, Chak Rajopatti, Sitamarhi, Bihar to bridge the gap between high-standard modern academic education and authentic Islamic Tarbiyah (moral upbringing).
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                  Named after Sayyidatina Aisha Siddiqa (R.A.) — the beacon of knowledge, wisdom, and scholarship in Islam — our school strives to instill intellect, modesty, and leadership in every young scholar.
                </p>

                {/* Core Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-foreground">CBSE Curriculum</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">NCERT based Mathematics, Science, English & Computer Studies.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-foreground">Authentic Deeniyat</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Tajweed, Quran memorization, Seerah & daily Islamic etiquette.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Chak Rajopatti, Sitamarhi • Bihar 843302</span>
                <Link to="/about" className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                  Read Full History <ArrowRight size={14} />
                </Link>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right Column: Vision & Mission Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Vision Card */}
            <GlassCard className="p-8 border-amber-500/20 hover:border-amber-500/40 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                  <Eye size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Our Vision</span>
                  <h3 className="text-lg font-bold text-foreground">Future-Ready Islamic Leaders</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To evolve as a benchmark Islamic educational academy in Bihar, producing confident, intellectually competent graduates who lead with faith, compassion, and academic distinction.
              </p>
            </GlassCard>

            {/* Mission Card */}
            <GlassCard className="p-8 border-teal-500/20 hover:border-teal-500/40 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
                  <Target size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-500">Our Mission</span>
                  <h3 className="text-lg font-bold text-foreground">Comprehensive Development</h3>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-none" />
                  <span>Deliver rigorous CBSE-aligned English medium education.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-none" />
                  <span>Inculcate high moral character (Akhlaq) and reverence for Islamic values.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-none" />
                  <span>Provide digital literacy, critical thinking, and smart classroom learning.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-none" />
                  <span>Maintain a transparent, technology-driven ERP for parent partnership.</span>
                </li>
              </ul>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
