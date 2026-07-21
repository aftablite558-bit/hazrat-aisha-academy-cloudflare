import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 rounded-xl relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
  </div>
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2.5 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md space-y-4 ${className}`}>
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
      <div className="space-y-2 flex-grow">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <Skeleton className="h-24 w-full rounded-2xl" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-20 rounded-xl" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => (
  <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-4">
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-8 w-24 rounded-xl" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={`h-4 flex-1 ${c === 0 ? 'font-bold' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStatWidget: React.FC = () => (
  <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="w-10 h-10 rounded-2xl" />
    </div>
    <Skeleton className="h-8 w-20" />
    <Skeleton className="h-3 w-32" />
  </div>
);
