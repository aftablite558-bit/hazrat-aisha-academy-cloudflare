import { ReactNode } from 'react';
import { GlassCard } from './GlassCard';
import { cn } from '../../utils';

export const GlassWidget = ({ children, title, className }: { children: ReactNode; title?: string; className?: string }) => {
  return (
    <GlassCard className={cn("flex flex-col h-full", className)}>
      {title && (
        <div className="mb-4 relative z-10 border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>
        </div>
      )}
      <div className="relative z-10 flex-1">{children}</div>
    </GlassCard>
  );
};
