import { motion } from 'motion/react';
import { 
  ArrowRight, 
  BookOpen, 
  Heart, 
  ShieldCheck,
  Zap,
  Globe,
  PlayCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PremiumButton } from '../components/common/PremiumButton';
import { PremiumCard } from '../components/common/PremiumCard';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-52 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100/50 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Admissions Open 2024-25</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black text-neutral-900 tracking-tighter leading-[1.05] mb-8">
                Cultivating <span className="text-emerald-700">Faith</span> & Academic Excellence.
              </h1>
              <p className="text-lg text-neutral-500 leading-relaxed max-w-xl mb-12">
                Hazrat Aisha Academy integrates modern CBSE-aligned education with authentic Islamic values to nurture confident, knowledgeable, and compassionate future leaders.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/apply">
                  <PremiumButton size="lg" className="w-full sm:w-auto px-10">
                    Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                  </PremiumButton>
                </Link>
                <button className="flex items-center space-x-3 text-neutral-600 font-bold hover:text-neutral-900 transition-colors group">
                  <div className="bg-neutral-50 p-4 rounded-2xl group-hover:bg-neutral-100 transition-colors shadow-sm">
                    <PlayCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <span>Watch Campus Tour</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative"
            >
              <div className="relative z-10 rounded-[48px] overflow-hidden shadow-2xl shadow-emerald-900/10 border-[12px] border-white">
                <img 
                  src="https://images.unsplash.com/photo-1544717297-fa95b3ee9643?auto=format&fit=crop&q=80&w=1200" 
                  alt="School Campus"
                  className="w-full aspect-[4/5] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating Cards */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -left-12 top-1/4 z-20"
              >
                <PremiumCard padding="sm" className="w-48 shadow-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Zap className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Students</p>
                      <p className="text-lg font-black text-neutral-900">1,200+</p>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="absolute -right-8 bottom-1/4 z-20"
              >
                <PremiumCard padding="sm" className="w-56 shadow-2xl bg-emerald-700 text-white border-none">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Affiliation</p>
                      <p className="text-lg font-black">CBSE Aligned</p>
                    </div>
                  </div>
                </PremiumCard>
              </motion.div>
              
              {/* Background Shapes */}
              <div className="absolute -top-10 -right-10 h-64 w-64 bg-emerald-50 rounded-full -z-10 blur-3xl opacity-60" />
              <div className="absolute -bottom-20 -left-20 h-96 w-96 bg-blue-50 rounded-full -z-10 blur-3xl opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-6">Our Core Pillars</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tighter leading-tight">
              A holistic approach to education and spiritual growth.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: BookOpen, 
                title: 'Modern Academics', 
                desc: 'CBSE-aligned curriculum focused on critical thinking, STEM, and literacy.',
                color: 'bg-emerald-50 text-emerald-600'
              },
              { 
                icon: Heart, 
                title: 'Islamic Values', 
                desc: 'Deeply rooted in the Quran and Sunnah, fostering character (Akhlaq) and faith.',
                color: 'bg-rose-50 text-rose-600'
              },
              { 
                icon: Globe, 
                title: 'Global Citizen', 
                desc: 'Preparing students to be ethical leaders in a multicultural, digital world.',
                color: 'bg-blue-50 text-blue-600'
              }
            ].map((feature, i) => (
              <PremiumCard key={i} className="group cursor-default">
                <div className={`${feature.color} w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h4 className="text-2xl font-black text-neutral-900 mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">{feature.desc}</p>
                <div className="h-1 w-12 bg-neutral-100 rounded-full group-hover:w-full group-hover:bg-emerald-500 transition-all duration-500" />
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
            {[
              { label: 'Founded', value: '2015' },
              { label: 'Staff Members', value: '48+' },
              { label: 'Success Rate', value: '99%' },
              { label: 'Awards', value: '12' },
            ].map((stat, i) => (
              <div key={i} className="text-center lg:border-r border-neutral-100 last:border-0">
                <p className="text-5xl font-black text-neutral-900 tracking-tighter mb-2">{stat.value}</p>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="bg-emerald-900 rounded-[48px] p-12 lg:p-24 text-center relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto relative z-10"
            >
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-8">
                Ready to begin your journey of <span className="text-emerald-400 italic">excellence?</span>
              </h2>
              <p className="text-emerald-100/70 text-lg mb-12 max-w-xl mx-auto">
                Join our community of learners and believers. Limited seats available for the upcoming academic year.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/apply" className="w-full sm:w-auto">
                  <PremiumButton variant="secondary" size="lg" className="w-full sm:w-auto px-12 bg-white text-emerald-900 hover:bg-emerald-50">
                    Apply Online
                  </PremiumButton>
                </Link>
                <button className="text-white font-bold hover:text-emerald-400 transition-colors px-6 py-4 flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Secure Admission Process</span>
                </button>
              </div>
            </motion.div>
            
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 h-96 w-96 bg-emerald-950/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
