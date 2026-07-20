import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';

export const About = () => (
  <PublicLayout>
    <PageHeader title="About Hazrat Aisha Academy" description="Cultivating knowledge, character, and faith." />
    <Section title="Our Vision" subtitle="Building a brighter future for the next generation.">
      <div className="grid md:grid-cols-2 gap-8">
        <GlassCard>
          <h3 className="text-xl font-bold mb-4 text-foreground">Vision</h3>
          <p className="text-muted-foreground">To be a premier Islamic educational institution fostering excellence and character.</p>
        </GlassCard>
        <GlassCard>
          <h3 className="text-xl font-bold mb-4 text-foreground">Mission</h3>
          <p className="text-muted-foreground">Providing CBSE-aligned academics integrated with authentic Islamic values.</p>
        </GlassCard>
      </div>
    </Section>
  </PublicLayout>
);
