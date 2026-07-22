import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton } from '../../components/common/GlassComponents';
import { ArrowRight, BookOpen, Users, Award, ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide"
          >
            <ShieldCheck className="w-4 h-4" />
            ADMISSIONS OPEN 2026-27
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]"
          >
            Cultivating <span className="text-gradient">Character</span> & <br />
            Knowledge through <span className="font-amiri italic text-emerald-400">Faith</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            A premier Islamic school in Sitamarhi, Bihar, blending CBSE-aligned modern academic 
            excellence with authentic Islamic values.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <GlassButton variant="primary" size="lg" className="group">
              Apply for Admission
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </GlassButton>
            <GlassButton variant="secondary" size="lg">
              Explore Our Campus
            </GlassButton>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <GlassCard className="p-8 space-y-4 group hover:-translate-y-2 transition-all duration-500">
          <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
            <BookOpen className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Modern Academics</h3>
          <p className="text-slate-400 leading-relaxed">
            Full CBSE-aligned curriculum with emphasis on Science, Mathematics, and Technology.
          </p>
        </GlassCard>

        <GlassCard className="p-8 space-y-4 group hover:-translate-y-2 transition-all duration-500">
          <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <Users className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Islamic Environment</h3>
          <p className="text-slate-400 leading-relaxed">
            Nurturing faith and character through authentic teachings and daily spiritual practices.
          </p>
        </GlassCard>

        <GlassCard className="p-8 space-y-4 group hover:-translate-y-2 transition-all duration-500">
          <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <Award className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-white">Excellence Guaranteed</h3>
          <p className="text-slate-400 leading-relaxed">
            Consistent results and holistic development for every student in our care.
          </p>
        </GlassCard>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4">
        <GlassCard className="bg-emerald-500/5 border-emerald-500/10 p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-white">1000+</div>
              <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Students</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-white">50+</div>
              <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Expert Staff</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-white">100%</div>
              <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Results</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-black text-white">15+</div>
              <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Labs & Studios</div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

export default Home;
