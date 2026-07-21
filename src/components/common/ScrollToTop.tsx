import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Track scroll position for button visibility and circle fill
  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrolled > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (totalHeight > 0) {
        const progress = Math.min(Math.max((scrolled / totalHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-40 print:hidden"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900/90 dark:bg-slate-800/90 text-emerald-400 border border-emerald-500/30 shadow-2xl backdrop-blur-xl hover:scale-110 active:scale-95 transition-all duration-300"
          >
            {/* SVG Progress Circle Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
              <circle
                cx="20"
                cy="20"
                r="17"
                className="stroke-slate-700/50 fill-none"
                strokeWidth="2.5"
              />
              <circle
                cx="20"
                cy="20"
                r="17"
                className="stroke-emerald-400 fill-none transition-all duration-150"
                strokeWidth="2.5"
                strokeDasharray="106.8"
                strokeDashoffset={106.8 - (106.8 * scrollProgress) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Icon */}
            <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
