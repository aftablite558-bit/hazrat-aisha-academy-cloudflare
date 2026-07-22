import React from 'react';
import { GlassCard } from '../../components/common/GlassComponents';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <GlassCard className="p-12 text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">{title}</h1>
        <p className="text-slate-400">This section is being restored to its original Liquid Glass state.</p>
      </GlassCard>
    </div>
  );
};

export const About = () => <PlaceholderPage title="About Us" />;
export const Academics = () => <PlaceholderPage title="Academics" />;
export const Admissions = () => <PlaceholderPage title="Admissions" />;
export const Gallery = () => <PlaceholderPage title="Gallery" />;
export const Contact = () => <PlaceholderPage title="Contact Us" />;
