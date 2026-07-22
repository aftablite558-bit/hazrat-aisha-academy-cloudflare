import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const GlassModal = ({ isOpen, onClose, title, children, className = '' }: GlassModalProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 pb-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 sm:bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (isMobile && info.offset.y > 100) onClose();
            }}
            initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0, y: 20 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0, y: 20 }}
            transition={isMobile ? { type: 'tween', duration: 0.3, ease: 'easeOut' } : { type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative z-10 w-[94vw] sm:w-full max-h-[88vh] flex flex-col mb-[3vh] sm:mb-0 ${className || 'max-w-lg'}`}
          >
            <GlassCard 
              className="p-0 flex flex-col max-h-[88vh] overflow-hidden rounded-[24px] sm:rounded-[32px] w-full"
            >
              {isMobile && (
                <div className="w-full flex justify-center pt-3 pb-1 shrink-0 absolute top-0 left-0 right-0 z-20 pointer-events-none">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>
              )}
              <div className={`flex shrink-0 items-center justify-between p-5 sm:p-6 border-b border-white/10 relative z-10 bg-inherit ${isMobile ? 'pt-8' : ''}`}>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-secondary-foreground shrink-0 relative z-30"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mobile-modal-content relative z-10 p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-inherit">
                {children}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
