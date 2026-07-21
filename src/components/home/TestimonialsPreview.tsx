import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote, ChevronLeft, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import { GlassButton } from '../common/GlassButton';
import { GlassCard } from '../common/GlassCard';
import { useMasterData } from '../../hooks/useMasterData';
import { Testimonial } from '../../types/content';
import { motion, AnimatePresence } from 'motion/react';

export const TestimonialsPreview = () => {
  const { data: testimonials, loading } = useMasterData<Testimonial>('testimonials');
  const [activeSlide, setActiveSlide] = useState(0);

  const publishedTestimonials = testimonials.filter(t => t.isPublished);

  if (!loading && publishedTestimonials.length === 0) return null;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % publishedTestimonials.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + publishedTestimonials.length) % publishedTestimonials.length);
  };

  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden bg-slate-900/30 dark:bg-slate-950/60 border-y border-slate-200/50 dark:border-slate-800/80">
      {/* Background Decorative Mesh Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-teal-500/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-extrabold uppercase tracking-widest">
              <MessageSquare size={14} className="text-teal-400" />
              <span>Parent Voices & Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              What Our Community Says
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-normal">
              Heartfelt experiences shared by parents, alumni, and guardians of Hazrat Aisha Academy.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/testimonials">
              <GlassButton variant="outline" className="px-6 py-3 text-xs font-bold rounded-2xl flex items-center gap-2 border-teal-500/20 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10">
                <span>Read All Parent Reviews</span>
                <ArrowRight size={16} />
              </GlassButton>
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center p-16">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedTestimonials.slice(0, 3).map((testimonial, idx) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard className="p-8 rounded-3xl h-full flex flex-col justify-between relative group hover:border-teal-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-950/10">
                  <Quote className="absolute top-6 right-6 text-teal-500/10 group-hover:text-teal-500/20 transition-colors w-16 h-16 pointer-events-none" />

                  <div>
                    {/* Star Rating */}
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < (testimonial.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"} 
                        />
                      ))}
                    </div>

                    {/* Quote Content */}
                    <p className="text-xs sm:text-sm text-foreground/90 font-medium italic leading-relaxed mb-6 line-clamp-5 relative z-10">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Parent Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                    {testimonial.photoUrl ? (
                      <img 
                        src={testimonial.photoUrl} 
                        alt={testimonial.name} 
                        className="w-11 h-11 rounded-full object-cover border-2 border-teal-500/30" 
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center font-black text-sm border-2 border-teal-500/30">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        {testimonial.role || 'Parent / Guardian'}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
