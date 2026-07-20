import { ReactNode, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/index';

export const GlassCard = ({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={style} className={cn(
        'glass rounded-[32px] p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),inset_0_6px_16px_rgba(255,255,255,0.2)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_6px_16px_rgba(255,255,255,0.1)] relative overflow-hidden group',
        className
      )}
    >
      {/* Animated Light Reflection */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden rounded-[32px]">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 -left-[100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>
      
      {/* Cursor Follow Glow (Desktop) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition duration-300 group-hover:opacity-100 hidden md:block z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.15), transparent 40%)`,
        }}
      />
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
