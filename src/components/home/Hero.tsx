import { motion } from 'motion/react';
import { GlassButton } from '../common/GlassButton';
import { Link } from 'react-router-dom';

export const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
    <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
        <motion.div 
          animate={{ y: [-5, 5, -5] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass text-sm font-semibold text-primary-600 dark:text-primary-400">
            ✨ Admissions Open for 2026-27
          </span>
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight tracking-tight text-foreground">
          Hazrat Aisha <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 drop-shadow-sm">
            Academy
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-secondary-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Cultivating character, knowledge, and faith through CBSE-aligned modern academic excellence integrated with authentic Islamic values.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <GlassButton variant="primary" className="text-lg px-10 py-5">Apply Now</GlassButton>
          <Link to="/dashboard">
            <GlassButton variant="glass" className="text-lg px-10 py-5 w-full">Student Portal</GlassButton>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);
