import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarProps {
  items: SidebarItem[];
  logo: React.ReactNode;
  footer?: React.ReactNode;
}

export const PremiumSidebar: React.FC<SidebarProps> = ({ items, logo, footer }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-80 bg-white border-r border-neutral-100/80 z-40 hidden lg:flex flex-col">
      <div className="p-10">
        {logo}
      </div>
      
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center space-x-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group',
              isActive 
                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/10' 
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
            )}
          >
            <item.icon className={cn(
              'h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-active:scale-90',
            )} />
            <span className="tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {footer && (
        <div className="p-8 border-t border-neutral-50">
          {footer}
        </div>
      )}
    </aside>
  );
};
