import React from 'react';
import { Card } from '../common/GlassCard';
import { motion } from 'motion/react';
import { 
  GraduationCap, BookOpen, ShieldCheck, Heart, Sparkles, 
  CheckCircle2, ArrowRight, Award, Compass, Eye, Target, MapPin, Building2, Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutSection = () => {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-amber-500/5 to-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Subtle Islamic Geometry Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Top Header Badge & Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-widest shadow-md shadow-emerald-950/10">
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>Nurturing Faith, Knowledge & Character</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400">Hazrat Aisha Academy</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            Established in Sitamarhi, Bihar to empower the next generation with CBSE-aligned academic brilliance integrated seamlessly with authentic Islamic values and modern technology.
          </p>
        </motion.div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Left Column: Academy Legacy & Heritage (Luxury Hero Card) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col"
          >
            <Card variant="luxury" glow="emerald" gradientBorder className="p-8 sm:p-10 h-full flex flex-col justify-between border-emerald-500/30">
              <div>
                {/* Header Row with Animated Icon */}
                <div className="flex items-start sm:items-center gap-4 mb-6">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <GraduationCap size={30} />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                      <Award size={12} />
                      Our Heritage & Institution
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-0.5">
                      Excellence in Education, Integrity in Character
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-normal">
                  <strong className="text-foreground font-bold">Hazrat Aisha Academy</strong> was established in Dilawarbagh, Sharif Colony, Chak Rajopatti, Sitamarhi, Bihar (843302) to bridge the gap between high-standard modern academic education and authentic Islamic Tarbiyah (moral upbringing).
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                  Named in honor of Sayyidatina Aisha Siddiqa (R.A.) — the paragon of wisdom, intellect, and scholarship in Islam — our school strives to instill intellect, modesty, critical thinking, and leadership in every scholar.
                </p>

                {/* Core Curriculum Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="p-4 rounded-2xl bg-emerald-950/20 dark:bg-slate-900/60 border border-emerald-500/20 dark:border-emerald-500/30 flex items-start gap-3 hover:border-emerald-500/40 transition-colors group/item">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 group-hover/item:scale-110 transition-transform">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-foreground tracking-wide">CBSE Modern Curriculum</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">NCERT Mathematics, Science, English Fluency & STEM Education.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-950/20 dark:bg-slate-900/60 border border-amber-500/20 dark:border-amber-500/30 flex items-start gap-3 hover:border-amber-500/40 transition-colors group/item">
                    <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 group-hover/item:scale-110 transition-transform">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-foreground tracking-wide">Authentic Deeniyat & Hifz</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">Tajweed Quran recitation, Seerah, Duas & Islamic etiquette.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Bar */}
              <div className="pt-6 border-t border-emerald-500/20 dark:border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <MapPin size={14} className="text-amber-500" />
                  Chak Rajopatti, Sitamarhi • Bihar 843302
                </span>
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/30 transition-all hover:gap-2.5"
                >
                  Read Full History <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
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
            <Card variant="gold" glow="gold" gradientBorder className="p-8 border-amber-500/30 hover:border-amber-500/50 transition-all group">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-500 group-hover:scale-110 transition-transform shadow-md">
                  <Eye size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500 dark:text-amber-400">Our Vision</span>
                  <h3 className="text-xl font-extrabold text-foreground tracking-tight">Future-Ready Islamic Leaders</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                To evolve as a benchmark Islamic educational institution in Bihar, producing confident, intellectually competent graduates who lead with faith, compassion, integrity, and academic distinction.
              </p>
            </Card>

            {/* Mission Card */}
            <Card variant="emerald" glow="emerald" gradientBorder className="p-8 border-teal-500/30 hover:border-teal-500/50 transition-all group">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform shadow-md">
                  <Target size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-500 dark:text-teal-400">Our Mission</span>
                  <h3 className="text-xl font-extrabold text-foreground tracking-tight">Comprehensive Development</h3>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Deliver rigorous CBSE-aligned English medium academic education.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Inculcate high moral character (Akhlaq) and reverence for Islamic values.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Provide digital literacy, critical thinking, and smart classroom learning.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <span>Maintain a transparent, technology-driven ERP for parent partnership.</span>
                </li>
              </ul>
            </Card>
          </motion.div>

        </div>

        {/* 4 Luxury Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Card variant="emerald" glow="emerald" className="p-6 h-full flex flex-col justify-between border-emerald-500/20 hover:border-emerald-500/40 transition-all">
              <div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 w-fit mb-4">
                  <BookOpen size={22} />
                </div>
                <h4 className="text-base font-extrabold text-foreground mb-1">Academic Rigor</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  CBSE NCERT standards with a focus on Mathematics, Science, and fluent English communication.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Card variant="gold" glow="gold" className="p-6 h-full flex flex-col justify-between border-amber-500/20 hover:border-amber-500/40 transition-all">
              <div>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 w-fit mb-4">
                  <ShieldCheck size={22} />
                </div>
                <h4 className="text-base font-extrabold text-foreground mb-1">Authentic Deeniyat</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tajweed, Quranic memorization, daily Masnoon duas, and comprehensive Seerah studies.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Card variant="teal" glow="emerald" className="p-6 h-full flex flex-col justify-between border-teal-500/20 hover:border-teal-500/40 transition-all">
              <div>
                <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-500 w-fit mb-4">
                  <Cpu size={22} />
                </div>
                <h4 className="text-base font-extrabold text-foreground mb-1">Digital Classrooms</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Smart interactive boards, modern computer laboratories, and technology-enabled learning.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <Card variant="luxury" glow="amber" className="p-6 h-full flex flex-col justify-between border-amber-500/20 hover:border-amber-500/40 transition-all">
              <div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-400 w-fit mb-4">
                  <Heart size={22} />
                </div>
                <h4 className="text-base font-extrabold text-foreground mb-1">Moral Care & Safety</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Safe, CCTV-monitored campus environment centered on empathy, modesty, and student wellbeing.
                </p>
              </div>
            </Card>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

