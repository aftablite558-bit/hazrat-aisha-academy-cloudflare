import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const PremiumTable: React.FC<TableProps> = ({ headers, children, className }) => {
  return (
    <div className={cn('w-full overflow-x-auto rounded-[32px] border border-neutral-100/80 bg-white shadow-sm', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-50/50">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-8 py-5 text-xs font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const PremiumTableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className, onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'group transition-all duration-300 hover:bg-emerald-50/30',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
};

export const PremiumTableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <td className={cn('px-8 py-6 text-sm text-neutral-700 transition-colors', className)}>
      {children}
    </td>
  );
};
