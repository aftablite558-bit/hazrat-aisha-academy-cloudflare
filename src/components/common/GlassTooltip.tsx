import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GlassTooltipProps {
  children: ReactNode;
  content: string;
}

export const GlassTooltip = ({ children, content }: GlassTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: -5, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 px-4 py-2 glass text-sm text-foreground whitespace-nowrap pointer-events-none z-50 !rounded-xl"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
