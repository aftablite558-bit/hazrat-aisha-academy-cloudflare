import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../common/GlassCard';
import { Calendar as CalendarIcon, Clock, Sparkles, ShieldCheck, Sun, Moon, Sunset } from 'lucide-react';

interface HeaderWidgetProps {
  principalName?: string;
  academicSession?: string;
  role?: string;
}

export const HeaderWidget: React.FC<HeaderWidgetProps> = ({
  principalName = 'Principal',
  academicSession = '2026-2027',
  role = 'Principal',
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  let greeting = 'Good Morning';
  let GreetingIcon = Sun;
  let greetingColor = 'text-amber-500';

  if (hours >= 12 && hours < 17) {
    greeting = 'Good Afternoon';
    GreetingIcon = Sunset;
    greetingColor = 'text-orange-500';
  } else if (hours >= 17) {
    greeting = 'Good Evening';
    GreetingIcon = Moon;
    greetingColor = 'text-indigo-400';
  }

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <GlassCard className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-emerald-500/10 border-emerald-500/30 shadow-xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Welcome Details */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-md border border-emerald-500/30 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/logo.png"
                alt="Hazrat Aisha Academy"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-2xl font-black text-emerald-500 select-none">HAA</span>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full shadow-sm" title="Active Session">
              <ShieldCheck size={12} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <GreetingIcon size={18} className={greetingColor} />
              <span className={`text-sm font-semibold ${greetingColor}`}>{greeting}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 uppercase tracking-wider">
                {role}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              {principalName}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              Hazrat Aisha Academy • Chak Rajopatti, Sitamarhi
            </p>
          </div>
        </div>

        {/* Right Session & Time Widget */}
        <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 lg:border-l border-white/20 pt-4 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-3 bg-white/10 dark:bg-slate-800/50 p-3 rounded-2xl border border-white/20">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Live Time</p>
              <p className="text-base font-extrabold font-mono text-foreground">{formattedTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 dark:bg-slate-800/50 p-3 rounded-2xl border border-white/20">
            <div className="p-2.5 bg-secondary-500/10 text-secondary-500 rounded-xl">
              <CalendarIcon size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{formattedDate}</p>
              <p className="text-sm font-bold text-foreground">Session: <span className="text-primary-500">{academicSession}</span></p>
            </div>
          </div>
        </div>

      </div>
    </GlassCard>
  );
};
