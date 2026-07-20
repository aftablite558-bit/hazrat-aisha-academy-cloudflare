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
          <span className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-full glass text-sm font-semibold text-primary-600 dark:text-primary-400">
            <span className="text-xl">رَبِّ زِدْنِي عِلْمًا</span>
            <span className="text-xs opacity-90">Rabbi Zidni Ilma</span>
            <span className="text-[10px] opacity-70">"My Lord, increase me in knowledge." (Qur'an 20:114)</span>
          </span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight text-foreground">
          Hazrat Aisha Academy <br />
          <span className="text-3xl md:text-4xl block font-semibold mt-4 text-primary-600 dark:text-primary-400">حضرت عائشہ اکیڈمی</span>
        </h1>
        <p className="text-xl md:text-2xl text-secondary-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          Providing quality English Medium and Islamic education to nurture knowledgeable, disciplined, and morally responsible future generations.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
        </div>
      </motion.div>
    </div>
  </section>
);
