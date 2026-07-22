export const PageHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="py-20 px-6 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />
    <div className="max-w-7xl mx-auto relative z-10">
      <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">{title}</h1>
      {description && <p className="text-lg text-muted-foreground max-w-xl mx-auto">{description}</p>}
    </div>
  </div>
);
