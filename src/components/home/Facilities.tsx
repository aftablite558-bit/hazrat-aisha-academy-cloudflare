import { GlassCard } from '../common/GlassCard';

export const Facilities = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Campus Facilities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <GlassCard key={i} className="h-64 flex items-center justify-center text-muted-foreground">
            Image Placeholder {i}
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);
