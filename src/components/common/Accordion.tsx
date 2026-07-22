import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../../utils/index';

export const Accordion = ({ items }: { items: { q: string; a: string }[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <GlassCard key={index} className="p-0 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-6 flex justify-between items-center text-left"
          >
            <span className="font-bold">{item.q}</span>
            <ChevronDown className={cn("transition-transform", openIndex === index ? "rotate-180" : "")} />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-6 pb-6 text-muted-foreground">
                {item.a}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      ))}
    </div>
  );
};
