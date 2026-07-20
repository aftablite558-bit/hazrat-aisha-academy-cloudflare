import { GlassCard } from '../common/GlassCard';
import { BookOpen, Users, Award, Zap } from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Modern Curriculum', desc: 'CBSE-aligned academic excellence.' },
  { icon: Users, title: 'Expert Faculty', desc: 'Dedicated and experienced educators.' },
  { icon: Award, title: 'Islamic Values', desc: 'Authentic faith-based character building.' },
  { icon: Zap, title: 'Modern Facilities', desc: 'State-of-the-art campus infrastructure.' },
];

export const Features = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f) => (
          <GlassCard key={f.title} className="p-8">
            <f.icon className="w-12 h-12 text-primary-500 mb-6" />
            <h3 className="text-xl font-bold mb-3 text-foreground">{f.title}</h3>
            <p className="text-muted-foreground">{f.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);
