import { TextareaHTMLAttributes, useId } from 'react';
import { cn } from '../../utils/index';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const GlassTextarea = ({ label, className, id, ...props }: TextareaProps) => {
  const autoId = useId();
  const textareaId = id || (label ? `textarea-${autoId}` : undefined);

  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={textareaId} className="text-sm font-semibold text-secondary-foreground">{label}</label>}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-5 py-3.5 !rounded-2xl glass text-foreground !shadow-[inset_0_2px_8px_rgba(0,0,0,0.05),0_1px_2px_rgba(255,255,255,0.2)] focus:!shadow-[0_0_0_4px_rgba(6,182,212,0.15),inset_0_2px_8px_rgba(0,0,0,0.05)] focus:!border-primary-500/50 outline-none transition-all duration-300 min-h-[120px] resize-y custom-scrollbar',
          className
        )}
        {...props}
      />
    </div>
  );
};
