import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/index';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const GlassModal = ({ isOpen, onClose, title, children, className = '' }: GlassModalProps) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  
  const dragControls = useDragControls();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-end sm:justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0 cursor-pointer"
          />
          
          {/* Modal Container */}
          <motion.div
            drag={isMobile ? "y" : false}
            dragListener={false} // Disable dragging on the whole container
            dragControls={dragControls} // Pass drag controls to enable dragging only on header
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (isMobile && info.offset.y > 100) onClose();
            }}
            initial={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: 20 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.95, opacity: 0, y: 20 }}
            transition={isMobile ? { type: 'tween', duration: 0.3, ease: 'easeOut' } : { type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "relative z-10 w-full sm:w-auto mt-auto sm:mt-0 flex flex-col max-h-[90vh]",
              isMobile ? "p-0 pb-0" : "p-4",
              className || "max-w-lg"
            )}
          >
            <div 
              className={cn(
                "flex flex-col max-h-[90vh] overflow-hidden w-full relative z-20",
                "bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800",
                isMobile ? "rounded-t-[32px] rounded-b-none border-b-0" : "rounded-[32px]"
              )}
            >
              {isMobile && (
                <div 
                  className="w-full flex justify-center pt-4 pb-2 shrink-0 relative z-30 touch-none cursor-grab active:cursor-grabbing"
                  onPointerDown={(e) => dragControls.start(e)}
                  style={{ touchAction: 'none' }}
                >
                  <div className="w-12 h-1.5 bg-black/20 dark:bg-white/20 rounded-full pointer-events-none" />
                </div>
              )}
              
              <div 
                className={cn(
                  "flex shrink-0 items-center justify-between px-6 pb-4 border-b border-black/5 dark:border-white/10 relative z-30", 
                  isMobile ? "pt-2 touch-none cursor-grab active:cursor-grabbing" : "pt-6"
                )}
                onPointerDown={(e) => {
                  if (isMobile) dragControls.start(e);
                }}
                style={isMobile ? { touchAction: 'none' } : {}}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-foreground pointer-events-none">{title}</h2>
                <button
                  onClick={onClose}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-secondary-foreground shrink-0 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative z-20 p-6 overflow-y-auto custom-scrollbar flex-1 mobile-modal-content">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
