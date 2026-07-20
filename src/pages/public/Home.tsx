import { PublicLayout } from '../../layouts/PublicLayout';
import { Hero } from '../../components/home/Hero';
import { Stats } from '../../components/home/Stats';
import { Features } from '../../components/home/Features';
import { Facilities } from '../../components/home/Facilities';
import { AdmissionCTA } from '../../components/home/AdmissionCTA';

export const Home = () => (
  <PublicLayout>
    <Hero />
    <Stats />
    <Features />
    <Facilities />
    <AdmissionCTA />
  </PublicLayout>
);
