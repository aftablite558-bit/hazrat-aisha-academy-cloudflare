import { GlassCard } from '../common/GlassCard';
import { ReactNode } from 'react';

export const ChartCard = ({ title, children }: { title: string, children: ReactNode }) => (
  <GlassCard className="p-8 flex flex-col h-full">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
        <span className="text-sm font-medium text-muted-foreground">Live</span>
      </div>
    </div>
    <div className="h-72 w-full flex-1">
      {children}
    </div>
  </GlassCard>
);
