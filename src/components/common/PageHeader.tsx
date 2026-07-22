export const PageHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="py-20 px-6 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/15 via-amber-500/5 to-transparent pointer-events-none" />
    <div className="max-w-7xl mx-auto relative z-10">
      <h1 className="text-4xl sm:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-500 dark:from-white dark:via-emerald-300 dark:to-amber-300 tracking-tight">{title}</h1>
      {description && <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium">{description}</p>}
    </div>
  </div>
);
