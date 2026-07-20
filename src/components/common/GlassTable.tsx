import { ReactNode } from 'react';
import { GlassCard } from './GlassCard';
import { cn } from '../../utils';

export const GlassTable = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <GlassCard className={cn("p-0 overflow-hidden", className)}>
      <div className="overflow-x-auto w-full custom-scrollbar max-h-[600px]">
        <table className="w-full text-left border-collapse glass-table">
          {children}
        </table>
      </div>
    </GlassCard>
  );
};

