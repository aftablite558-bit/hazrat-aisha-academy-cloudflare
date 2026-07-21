import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Award, UserCheck, BookOpen, GraduationCap, PhoneCall } from 'lucide-react';

export const MobileActionBar: React.FC = () => {
  const location = useLocation();

  // Hide on admin dashboard or teacher panel routes
  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/teacher')) {
    return null;
  }

  const items = [
    { label: 'Results', path: '/results', icon: Award },
    { label: 'Attendance', path: '/attendance', icon: UserCheck },
    { label: 'Homework', path: '/homework', icon: BookOpen },
    { label: 'Admissions', path: '/admissions', icon: GraduationCap },
    { label: 'Call Us', path: 'tel:+919470818538', icon: PhoneCall, isExternal: true },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-slate-950/90 backdrop-blur-xl border-t border-emerald-500/20 px-3 py-2 shadow-2xl print:hidden">
      <div className="grid grid-cols-5 gap-1 text-center">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.path}
                className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-400 hover:text-amber-400 transition-colors"
              >
                <Icon size={18} className="text-amber-400" />
                <span className="text-[9px] font-bold mt-1 tracking-tight">{item.label}</span>
              </a>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-emerald-400' : ''} />
              <span className="text-[9px] font-bold mt-1 tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
