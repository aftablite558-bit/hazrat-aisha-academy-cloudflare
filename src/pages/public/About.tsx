import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';

export const About = () => (
  <PublicLayout>
    <PageHeader title="About Hazrat Aisha Academy" description="Excellence in Education, Integrity in Character." />
    <Section title="Our Vision" subtitle="Becoming a leading English Medium and Islamic educational institution.">
      <div className="grid md:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4 text-foreground">History</h3>
          <p className="text-muted-foreground leading-relaxed">Hazrat Aisha Academy was established to provide high-quality CBSE-oriented education integrated with authentic Islamic teachings, modern learning methods, and strong moral values.</p>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4 text-foreground">Mission</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Academic Excellence</li>
            <li>Islamic Values</li>
            <li>Character Building</li>
            <li>Leadership Development</li>
            <li>Digital Learning</li>
          </ul>
        </GlassCard>
      </div>
    </Section>
  </PublicLayout>
);
