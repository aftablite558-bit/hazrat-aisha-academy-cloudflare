import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';

export const Admissions = () => (
  <PublicLayout>
    <PageHeader title="Admissions" description="Start your journey with us." />
    <Section>
      <div className="max-w-2xl mx-auto">
        <GlassCard className="p-8">
          <h3 className="text-xl font-bold mb-4">Admission Process</h3>
          <ul className="list-decimal list-inside space-y-2 text-muted-foreground mb-8">
            <li>Application form submission</li>
            <li>Interaction / Assessment</li>
            <li>Document verification</li>
            <li>Fee payment</li>
          </ul>
          <GlassButton className="w-full">Apply Now</GlassButton>
        </GlassCard>
      </div>
    </Section>
  </PublicLayout>
);
