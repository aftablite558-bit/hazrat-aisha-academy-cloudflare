import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';

export const Academics = () => (
  <PublicLayout>
    <PageHeader title="Academics" description="CBSE-aligned modern education." />
    <Section>
      <div className="grid md:grid-cols-3 gap-8">
        <GlassCard><h3 className="font-bold">Primary School</h3></GlassCard>
        <GlassCard><h3 className="font-bold">Secondary School</h3></GlassCard>
        <GlassCard><h3 className="font-bold">Hifz Program</h3></GlassCard>
      </div>
    </Section>
  </PublicLayout>
);
