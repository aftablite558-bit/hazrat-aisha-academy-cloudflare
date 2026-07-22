import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Globe,
  Sparkles,
  School,
  Library,
  Trophy,
  Microscope
} from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '../../components/common/GlassComponents';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-32 pb-32 overflow-hidden bg-mesh">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassBadge color="emerald" className="px-6 py-2 text-sm border-emerald-500/30">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Admissions Open 2026-27
            </GlassBadge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            <span className="text-white">Hazrat</span> <br />
            <span className="text-gradient">Aisha</span> <br />
            <span className="font-amiri italic text-emerald-400 font-normal">Academy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 font-medium"
          >
            Cultivating character, knowledge, and faith through CBSE-aligned 
            modern academic excellence integrated with authentic Islamic values.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <GlassButton variant="primary" size="lg" className="group h-16 px-10 text-xl">
              Online Admission
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </GlassButton>
            <GlassButton variant="outline" size="lg" className="h-16 px-10 text-xl">
              Results Portal
            </GlassButton>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <GlassBadge color="blue">Our Philosophy</GlassBadge>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
            Nurturing the <br />
            <span className="text-emerald-400">Next Generation</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            At Hazrat Aisha Academy, we believe in a balanced education. Our curriculum 
            seamlessly blends rigorous modern sciences with profound Islamic ethical 
            frameworks, ensuring our students are prepared for both this world and the next.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 glass rounded-xl flex-shrink-0 flex items-center justify-center">
                <Globe className="text-emerald-400 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white">Global Vision</h4>
                <p className="text-sm text-slate-500">Preparing leaders for a globalized world.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 glass rounded-xl flex-shrink-0 flex items-center justify-center">
                <ShieldCheck className="text-blue-400 w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white">Strong Values</h4>
                <p className="text-sm text-slate-500">Deeply rooted in authentic Islamic tradition.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
          <GlassCard className="aspect-square relative z-10 p-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1544716124-05461158410d?q=80&w=2000&auto=format&fit=crop" 
              alt="Students learning" 
              className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-2xl font-amiri text-white italic">&quot;Read in the name of your Lord who created...&quot;</p>
            </div>
          </GlassCard>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <GlassBadge color="amber">Our Excellence</GlassBadge>
          <h2 className="text-5xl font-black text-white">Why Choose Us?</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Microscope, title: 'Science Labs', text: 'State-of-the-art facilities for modern experimentation.', color: 'emerald' },
            { icon: Library, title: 'Rich Library', text: 'Expansive collection of both academic and Islamic literature.', color: 'blue' },
            { icon: Trophy, title: 'Sports Center', text: 'Emphasis on physical health and teamwork through active sports.', color: 'amber' },
            { icon: School, title: 'Smart Classes', text: 'Technology-driven interactive learning environments.', color: 'rose' }
          ].map((item, i) => (
            <GlassCard key={i} className="group hover:border-emerald-500/40">
              <div className={`w-16 h-16 bg-${item.color}-500/10 rounded-2xl flex items-center justify-center border border-${item.color}-500/20 mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-8 h-8 text-${item.color}-400`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.text}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4">
        <GlassCard className="bg-emerald-950/20 border-emerald-500/20 p-16 overflow-hidden relative text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
            {[
              { label: 'Enrolled Students', value: '1200+' },
              { label: 'Qualified Teachers', value: '45+' },
              { label: 'Years of Excellence', value: '12+' },
              { label: 'Campus Area', value: '2.5 Acres' }
            ].map((stat, i) => (
              <div key={i} className="space-y-4">
                <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">{stat.value}</div>
                <div className="text-emerald-400 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4">
        <GlassCard className="py-24 px-8 text-center bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-white/10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Ready to <span className="text-gradient">Begin?</span></h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Join the Hazrat Aisha Academy family and give your child the gift of 
            knowledge and character. Admissions are now open for the 2026-27 academic session.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <GlassButton variant="primary" size="lg" className="h-16 px-12">
              Apply Now
            </GlassButton>
            <GlassButton variant="outline" size="lg" className="h-16 px-12">
              Contact Office
            </GlassButton>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

export default Home;
