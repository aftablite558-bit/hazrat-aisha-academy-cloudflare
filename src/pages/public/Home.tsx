import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Hero } from '../../components/home/Hero';
import { AboutSection } from '../../components/home/AboutSection';
import { Stats } from '../../components/home/Stats';
import { Features } from '../../components/home/Features';
import { Facilities } from '../../components/home/Facilities';
import { AdmissionCTA } from '../../components/home/AdmissionCTA';
import { LatestNotices } from '../../components/home/LatestNotices';
import { GalleryPreview } from '../../components/home/GalleryPreview';
import { TestimonialsPreview } from '../../components/home/TestimonialsPreview';
import { AchievementsPreview } from '../../components/home/AchievementsPreview';

export const Home = () => (
  <PublicLayout>
    <Hero />
    <AboutSection />
    <Stats />
    <Features />
    <LatestNotices />
    <Facilities />
    <GalleryPreview />
    <AchievementsPreview />
    <TestimonialsPreview />
    <AdmissionCTA />
  </PublicLayout>
);
