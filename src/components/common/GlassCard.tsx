import React, { ReactNode, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../utils/index';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hoverable?: boolean;
  variant?: 'default' | 'emerald' | 'gold' | 'luxury' | 'teal';
  gradientBorder?: boolean;
  glow?: boolean | 'emerald' | 'gold' | 'amber';
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard = ({
  children,
  className,
  style,
  hoverable = true,
  variant = 'default',
  gradientBorder = false,
  glow = false,
  onClick
}: GlassCardProps) => {
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

  const getVariantStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900/40 to-slate-950/60 dark:from-emerald-950/30 dark:to-slate-900/80';
      case 'gold':
        return 'border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/40 to-slate-950/60 dark:from-amber-950/30 dark:to-slate-900/80';
      case 'teal':
        return 'border-teal-500/30 bg-gradient-to-br from-teal-950/20 via-slate-900/40 to-slate-950/60 dark:from-teal-950/30 dark:to-slate-900/80';
      case 'luxury':
        return 'border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-emerald-950/20 to-slate-900/95 dark:from-slate-950/90 dark:via-emerald-950/40 dark:to-slate-900/95 shadow-2xl shadow-emerald-950/20';
      default:
        return 'glass';
    }
  };

  const getGlowColor = () => {
    if (glow === 'gold' || glow === 'amber') return 'rgba(245, 158, 11, 0.15)';
    if (glow === 'emerald' || glow === true) return 'rgba(16, 185, 129, 0.18)';
    return 'rgba(255, 255, 255, 0.12)';
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={hoverable ? { y: -6, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={style}
      className={cn(
        'rounded-[32px] p-6 transition-all duration-300 relative overflow-hidden group',
        getVariantStyles(),
        gradientBorder && 'p-[1px] bg-gradient-to-r from-emerald-500/40 via-amber-500/40 to-emerald-500/40',
        hoverable && 'hover:shadow-[0_24px_60px_rgba(16,185,129,0.18)] dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Background Ambient Glow */}
      {glow && (
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 opacity-60 group-hover:opacity-100"
          style={{ background: getGlowColor() }}
        />
      )}

      {/* Animated Light Reflection */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden rounded-[32px]">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 -left-[100%] w-[200%] h-full bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -rotate-45 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      {/* Cursor Follow Radial Glow (Desktop) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition duration-300 group-hover:opacity-100 hidden md:block z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${getGlowColor()}, transparent 40%)`,
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// Reusable Card alias export for consistency across design components
export const Card = GlassCard;
export const PremiumCard = GlassCard;

