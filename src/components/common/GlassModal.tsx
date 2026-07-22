import { ReactNode, useEffect } from 'react';
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative z-10 w-[95%] sm:w-full max-h-[85vh] flex flex-col ${className || 'max-w-lg'}`}
          >
            <GlassCard hoverable={false} className="p-0 flex flex-col max-h-[85vh] overflow-hidden border border-emerald-500/30 dark:border-amber-500/20 shadow-2xl">
              <div className="flex shrink-0 items-center justify-between p-5 sm:p-6 border-b border-white/10 relative z-10 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md">
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-2 rounded-full hover:bg-emerald-500/10 dark:hover:bg-white/10 transition-colors text-secondary-foreground shrink-0"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative z-10 p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
                {children}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const PremiumModal = GlassModal;
export const Modal = GlassModal;
