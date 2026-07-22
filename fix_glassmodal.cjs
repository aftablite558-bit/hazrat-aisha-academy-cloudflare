const fs = require('fs');
let file = 'src/components/common/GlassModal.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldImport = "import { ReactNode } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';";
const newImport = "import { ReactNode, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';";
c = c.replace(oldImport, newImport);

const oldComponentStart = "export const GlassModal = ({ isOpen, onClose, title, children, className = '' }: GlassModalProps) => {\n  return (";
const newComponentStart = `export const GlassModal = ({ isOpen, onClose, title, children, className = '' }: GlassModalProps) => {
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

  return (`;
if (!c.includes('useEffect(() => {') && c.includes(oldComponentStart)) {
  c = c.replace(oldComponentStart, newComponentStart);
}

const oldModalContent = `        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={\`relative z-10 w-full \${className || 'max-w-lg'}\`}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-secondary-foreground"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative z-10">{children}</div>
            </GlassCard>
          </motion.div>
        </div>`;
const newModalContent = `        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
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
            className={\`relative z-10 w-[95%] sm:w-full max-h-[85vh] flex flex-col \${className || 'max-w-lg'}\`}
          >
            <GlassCard className="p-0 flex flex-col max-h-[85vh] overflow-hidden">
              <div className="flex shrink-0 items-center justify-between p-5 sm:p-6 border-b border-white/10 relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-secondary-foreground shrink-0"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="relative z-10 p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
                {children}
              </div>
            </GlassCard>
          </motion.div>
        </div>`;
c = c.replace(oldModalContent, newModalContent);
fs.writeFileSync(file, c);
