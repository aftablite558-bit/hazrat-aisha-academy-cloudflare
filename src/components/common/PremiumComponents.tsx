import React, { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../../utils/index';
import { 
  GlassCard, GlassCardProps 
} from './GlassCard';
import { GlassButton } from './GlassButton';
import { GlassInput } from './GlassInput';
import { GlassSelect } from './GlassSelect';
import { GlassTextarea } from './GlassTextarea';
import { GlassModal } from './GlassModal';
import { GlassTable } from './GlassTable';
import { Navbar } from '../layout/Navbar';
import { GlassSidebar } from '../layout/Sidebar';
import { Sparkles, ArrowRight, TrendingUp, Calendar, Tag, User, Eye, Download, CheckCircle2, FileText, Bell, ChevronRight } from 'lucide-react';

// 1. PremiumButton
export interface PremiumButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'gold' | 'glass' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const PremiumButton = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className,
  ...props
}: PremiumButtonProps) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-6 py-3 text-sm font-extrabold rounded-2xl gap-2',
    lg: 'px-8 py-4 text-base font-black rounded-2xl gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40 hover:shadow-emerald-500/25',
    gold: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40 border border-amber-300/50 hover:shadow-amber-500/30',
    glass: 'bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-xl border border-white/10 text-foreground hover:bg-slate-800/80 hover:border-emerald-500/40 shadow-md',
    outline: 'border border-emerald-500/30 dark:border-amber-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-foreground hover:border-emerald-500/60',
    ghost: 'hover:bg-white/10 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-950/40 border border-rose-400/30 hover:shadow-rose-500/25',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative inline-flex items-center justify-center transition-all duration-300 overflow-hidden group select-none cursor-pointer',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Light sheen animation effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0 transition-transform group-hover:translate-x-1">{icon}</span>}
    </motion.button>
  );
};

// 2. PremiumCard
export const PremiumCard = GlassCard;

// 3. PremiumInput
export const PremiumInput = GlassInput;

// 4. PremiumSelect
export const PremiumSelect = GlassSelect;

// 5. PremiumTextarea
export const PremiumTextarea = GlassTextarea;

// 6. PremiumModal
export const PremiumModal = GlassModal;

// 7. PremiumTable
export const PremiumTable = GlassTable;

// 8. PremiumSidebar
export const PremiumSidebar = GlassSidebar;

// 9. PremiumNavbar
export const PremiumNavbar = Navbar;

// 10. PremiumDashboardWidgets
export interface PremiumDashboardWidgetProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  glow?: 'emerald' | 'gold' | 'amber' | boolean;
}

export const PremiumDashboardWidgets = ({
  title,
  subtitle,
  icon,
  action,
  children,
  className,
  glow = 'emerald',
}: PremiumDashboardWidgetProps) => {
  return (
    <GlassCard variant="luxury" glow={glow} className={cn('p-6 space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 shadow-md">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-extrabold text-foreground tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div>{children}</div>
    </GlassCard>
  );
};

// 11. PremiumStatisticsCards
export interface PremiumStatisticsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: ReactNode;
  variant?: 'emerald' | 'gold' | 'teal' | 'luxury';
  subtitle?: string;
  className?: string;
}

export const PremiumStatisticsCards = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  variant = 'emerald',
  subtitle,
  className,
}: PremiumStatisticsCardProps) => {
  return (
    <GlassCard
      variant={variant}
      glow={variant === 'gold' ? 'gold' : 'emerald'}
      gradientBorder
      className={cn('p-6 flex flex-col justify-between relative group hover:scale-[1.02] transition-transform duration-300', className)}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</span>
          <div className="text-3xl font-black text-foreground tracking-tight mt-1">{value}</div>
        </div>
        <div className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 text-emerald-400 group-hover:scale-110 transition-transform shadow-lg">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-white/10">
        {change && (
          <span className={cn('font-bold flex items-center gap-1 px-2 py-0.5 rounded-full border', isPositive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30')}>
            <TrendingUp size={12} className={!isPositive ? 'rotate-180' : ''} />
            {change}
          </span>
        )}
        {subtitle && <span className="text-muted-foreground text-[11px] font-medium">{subtitle}</span>}
      </div>
    </GlassCard>
  );
};

// 12. PremiumProfileCard
export interface PremiumProfileCardProps {
  name: string;
  role: string;
  avatarUrl?: string;
  idNumber?: string;
  badges?: string[];
  contactInfo?: { email?: string; phone?: string; class?: string };
  actions?: ReactNode;
  className?: string;
}

export const PremiumProfileCard = ({
  name,
  role,
  avatarUrl,
  idNumber,
  badges = [],
  contactInfo,
  actions,
  className,
}: PremiumProfileCardProps) => {
  return (
    <GlassCard variant="luxury" glow="emerald" gradientBorder className={cn('p-6 sm:p-8 text-center relative overflow-hidden', className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-emerald-500/30 p-1 bg-slate-900 shadow-2xl relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white text-3xl font-black">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-md" title="Active Account" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{name}</h3>
        <p className="text-xs font-extrabold uppercase tracking-widest text-amber-500 my-1">{role}</p>

        {idNumber && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-semibold text-muted-foreground my-2">
            ID: {idNumber}
          </span>
        )}

        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 my-3">
            {badges.map((b, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                {b}
              </span>
            ))}
          </div>
        )}

        {contactInfo && (
          <div className="w-full my-4 pt-4 border-t border-white/10 text-xs space-y-1.5 text-muted-foreground">
            {contactInfo.class && <p><strong className="text-foreground">Class:</strong> {contactInfo.class}</p>}
            {contactInfo.email && <p className="truncate"><strong className="text-foreground">Email:</strong> {contactInfo.email}</p>}
            {contactInfo.phone && <p><strong className="text-foreground">Phone:</strong> {contactInfo.phone}</p>}
          </div>
        )}

        {actions && <div className="mt-4 w-full flex justify-center gap-2">{actions}</div>}
      </div>
    </GlassCard>
  );
};

// 13. PremiumGalleryCard
export interface PremiumGalleryCardProps {
  title: string;
  category?: string;
  imageUrl: string;
  date?: string;
  onClick?: () => void;
  className?: string;
}

export const PremiumGalleryCard = ({
  title,
  category,
  imageUrl,
  date,
  onClick,
  className,
}: PremiumGalleryCardProps) => {
  return (
    <GlassCard
      onClick={onClick}
      hoverable
      variant="luxury"
      glow="emerald"
      className={cn('p-0 overflow-hidden group cursor-pointer border-white/10 hover:border-emerald-500/40 transition-all aspect-video sm:aspect-[4/3] flex flex-col justify-end relative', className)}
    >
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Top category tag */}
      {category && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 shadow-md">
            {category}
          </span>
        </div>
      )}

      <div className="relative z-10 p-5 space-y-1">
        {date && <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1"><Calendar size={12} /> {date}</span>}
        <h4 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{title}</h4>
      </div>
    </GlassCard>
  );
};

// 14. PremiumNoticeCard
export interface PremiumNoticeCardProps {
  title: string;
  category: string;
  date: string;
  description: string;
  isImportant?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PremiumNoticeCard = ({
  title,
  category,
  date,
  description,
  isImportant = false,
  onClick,
  className,
}: PremiumNoticeCardProps) => {
  return (
    <GlassCard
      variant={isImportant ? 'gold' : 'emerald'}
      glow={isImportant ? 'gold' : 'emerald'}
      gradientBorder={isImportant}
      onClick={onClick}
      className={cn('p-6 space-y-3 cursor-pointer group hover:border-emerald-500/50 transition-all', className)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 border border-white/15 text-amber-400">
          {category}
        </span>
        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
          <Calendar size={13} /> {date}
        </span>
      </div>

      <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-emerald-400 transition-colors line-clamp-2">
        {title}
      </h3>

      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
        {description}
      </p>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
        <span>Read Notice</span>
        <ChevronRight size={16} />
      </div>
    </GlassCard>
  );
};

// 15. PremiumAdmissionCard
export interface PremiumAdmissionCardProps {
  title: string;
  subtitle: string;
  stepNumber?: number;
  features?: string[];
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const PremiumAdmissionCard = ({
  title,
  subtitle,
  stepNumber,
  features = [],
  ctaText = 'Apply Online Now',
  onCtaClick,
  className,
}: PremiumAdmissionCardProps) => {
  return (
    <GlassCard variant="luxury" glow="gold" gradientBorder className={cn('p-8 flex flex-col justify-between border-amber-500/30 relative overflow-hidden', className)}>
      <div className="space-y-4">
        {stepNumber && (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-950/30">
            0{stepNumber}
          </div>
        )}

        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
        </div>

        {features.length > 0 && (
          <ul className="space-y-2 pt-2 border-t border-white/10 text-xs text-muted-foreground">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {onCtaClick && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <PremiumButton variant="gold" size="md" className="w-full" onClick={onCtaClick} icon={<ArrowRight size={16} />}>
            {ctaText}
          </PremiumButton>
        </div>
      )}
    </GlassCard>
  );
};
