import { ReactNode } from 'react';

export const Section = ({ title, subtitle, children, className }: { title?: string; subtitle?: string; children: ReactNode; className?: string }) => (
  <section className={`py-16 px-6 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {(title || subtitle) && (
        <div className="mb-12 text-center">
          {title && <h2 className="text-4xl font-bold mb-4 text-foreground">{title}</h2>}
          {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  </section>
);
