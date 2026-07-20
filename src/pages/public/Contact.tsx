import { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassTextarea } from '../../components/common/GlassTextarea';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useMasterData } from '../../hooks/useMasterData';
import { Enquiry } from '../../types/content';


export const Contact = () => {
  const { addRecord } = useMasterData<Enquiry>('enquiries');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addRecord({ ...formData, status: 'Pending' } as any);
      alert('Your message has been sent successfully. We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <PageHeader title="Contact Us" description="Get in touch with Hazrat Aisha Academy." />
        <Section>
          <div className="grid lg:grid-cols-2 gap-12 mt-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">We'd love to hear from you</h2>
              <p className="text-muted-foreground">Whether you have a question about admissions, curriculum, or anything else, our team is ready to answer all your questions.</p>
              
              <div className="grid gap-6">
                <GlassCard className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-primary-500/10 text-primary-500 rounded-full"><MapPin size={24} /></div>
                  <div><h3 className="font-semibold text-lg">Address</h3><p className="text-muted-foreground mt-1">Dilawarbagh, Sharif Colony,<br/>Chak Rajopatti, Bihar – 843302</p></div>
                </GlassCard>
                <GlassCard className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-secondary-500/10 text-secondary-500 rounded-full"><Phone size={24} /></div>
                  <div><h3 className="font-semibold text-lg">Phone / WhatsApp</h3><p className="text-muted-foreground mt-1">+91 9470818538</p></div>
                </GlassCard>
                <GlassCard className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full"><Mail size={24} /></div>
                  <div><h3 className="font-semibold text-lg">Email</h3><p className="text-muted-foreground mt-1">Coming Soon</p></div>
                </GlassCard>
              </div>
            </div>

            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassInput required label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <GlassInput required label="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassInput required label="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <GlassInput required label="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>
                <GlassTextarea required label="Message" rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                <GlassButton type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </GlassButton>
              </form>
            </GlassCard>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
};
