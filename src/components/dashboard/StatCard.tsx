import { GlassCard } from '../common/GlassCard';
import { LucideIcon } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: LucideIcon, color: string }) => {
  const textColor = color.replace('bg-', 'text-').split(' ')[0];
  const bgColorClass = color.split(' ')[0];
  
  return (
    <GlassCard className="flex flex-col justify-between h-full relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bgColorClass}/10 blur-2xl group-hover:${bgColorClass}/20 transition-all duration-500`} />
      
      <div className="flex items-start justify-between mb-6 relative z-10">
          <div className={`p-4 rounded-2xl ${bgColorClass}/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20`}>
              <Icon className={textColor} size={28} />
          </div>
      </div>
      <div className="relative z-10">
          <h3 className="text-4xl font-extrabold mb-1 tracking-tight text-foreground drop-shadow-sm">{value}</h3>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>
    </GlassCard>
  );
};
