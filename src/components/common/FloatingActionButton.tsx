import { motion, HTMLMotionProps } from 'motion/react';
import { Plus } from 'lucide-react';

import { cn } from '../../utils/index';

interface FABProps extends HTMLMotionProps<'button'> {
  icon?: React.ReactNode;
}

export const FloatingActionButton = ({ className, icon, ...props }: FABProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 text-white shadow-[0_10px_35px_rgba(0,0,0,0.12),0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.15),0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center border border-white/20 transition-all duration-300 group',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {icon || <Plus size={24} className="relative z-10" />}
    </motion.button>
  );
};
