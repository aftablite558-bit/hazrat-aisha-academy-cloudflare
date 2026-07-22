import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  sticky?: boolean;
}

export const PremiumNavbar: React.FC<NavbarProps> = ({
  leftContent,
  rightContent,
  centerContent,
  sticky = true,
}) => {
  return (
    <nav className={cn(
      'w-full bg-white/80 backdrop-blur-md border-b border-neutral-100/80 px-8 py-4 z-30 transition-all duration-300',
      sticky && 'sticky top-0'
    )}>
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-8">
        <div className="flex-1 flex items-center justify-start">
          {leftContent}
        </div>
        
        {centerContent && (
          <div className="flex-1 flex items-center justify-center">
            {centerContent}
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-end gap-4">
          {rightContent}
        </div>
      </div>
    </nav>
  );
};

export const PremiumUserNav: React.FC<{
  name: string;
  role: string;
  avatar?: string;
}> = ({ name, role, avatar }) => {
  return (
    <div className="flex items-center space-x-4 bg-neutral-50/50 p-2 pr-5 rounded-2xl border border-neutral-100 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer group">
      <div className="h-10 w-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-900/10 transition-transform group-hover:scale-105">
        {avatar || name.charAt(0)}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-sm font-black text-neutral-900 tracking-tight leading-none mb-1 group-hover:text-emerald-700 transition-colors">{name}</span>
        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none">{role}</span>
      </div>
    </div>
  );
};
