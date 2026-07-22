import { PublicLayout } from '../../layouts/PublicLayout';

export const PlaceholderPage = ({ title }: { title: string }) => (
  <PublicLayout>
    <div className="py-20 px-6 text-center">
      <h1 className="text-4xl font-bold text-foreground">{title}</h1>
    </div>
  </PublicLayout>
);
