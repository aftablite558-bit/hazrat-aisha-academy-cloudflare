import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { Accordion } from '../../components/common/Accordion';

export const FAQ = () => (
  <PublicLayout>
    <PageHeader title="FAQ" description="Frequently asked questions." />
    <Section>
      <div className="max-w-3xl mx-auto">
        <Accordion items={[{q: 'Admissions?', a: 'Contact us.'}, {q: 'School timing?', a: '8am - 2pm.'}]} />
      </div>
    </Section>
  </PublicLayout>
);
