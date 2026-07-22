import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';

export const AdmissionCTA = () => {
  const navigate = useNavigate();
  
  return (
  <section className="py-20 px-6 relative z-10">
    <GlassCard className="max-w-5xl mx-auto p-16 text-center !bg-primary-500/10 dark:!bg-primary-500/5 !border-primary-500/30 shadow-[0_20px_50px_rgba(6,182,212,0.1),inset_0_4px_16px_rgba(255,255,255,0.2)]">
      <h2 className="text-4xl font-extrabold mb-6 text-foreground tracking-tight">Ready to Join Hazrat Aisha Academy?</h2>
      <p className="text-xl mb-10 text-secondary-foreground font-medium">Start your journey of academic and spiritual growth today.</p>
      <div className="flex gap-4 justify-center">
        <GlassButton variant="primary" onClick={() => navigate('/admissions')}>Apply Now</GlassButton>
        <GlassButton variant="glass" onClick={() => navigate('/contact')}>Contact Us</GlassButton>
      </div>
    </GlassCard>
  </section>
  );
};
