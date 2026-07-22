import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'danger';

interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  onClose: (id: string) => void;
}

export const GlassToast = ({ id, message, type = 'info', onClose }: ToastProps) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-rose-500" size={20} />,
    danger: <AlertCircle className="text-rose-500" size={20} />,
    warning: <AlertCircle className="text-amber-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="glass !rounded-2xl p-4 flex items-center gap-4 w-full max-w-sm mb-4"
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
      <button 
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors text-muted-foreground"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
