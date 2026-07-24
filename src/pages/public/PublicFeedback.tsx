import { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { PageHeader } from '../../components/common/PageHeader';
import { Section } from '../../components/common/Section';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassTextarea } from '../../components/common/GlassTextarea';
import { Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackTicket } from '../../types/content';

export const PublicFeedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    category: 'Appreciation',
    subject: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate Ticket ID
    const ticketId = 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Simulate submission (in real app, use useMasterData add method)
    const newTicket: FeedbackTicket = {
      id: crypto.randomUUID(),
      ticketId,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      category: formData.category as any,
      subject: formData.subject,
      description: formData.description,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app we'd save this to our store/DB here.
    // For now, we'll store it in localStorage so the admin dashboard can read it
    const existing = JSON.parse(localStorage.getItem('feedback_tickets') || '[]');
    localStorage.setItem('feedback_tickets', JSON.stringify([newTicket, ...existing]));

    setSubmitted(ticketId);
    
    // We should also simulate notification to Admin here if we had a notification context, 
    // but for now local storage helps across reloads for admin.
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifs.push({
      id: crypto.randomUUID(),
      title: 'New Feedback Submitted',
      message: `A new ${formData.category} has been submitted by ${formData.name}.`,
      date: new Date().toISOString(),
      read: false,
      role: 'admin'
    });
    localStorage.setItem('notifications', JSON.stringify(notifs));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen">
        <PageHeader title="Public Feedback & Support" description="We value your feedback. Submit your appreciation, suggestions, or complaints below." />
        
        <Section className="mt-12">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="p-8 md:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <GlassInput 
                        required
                        label="Full Name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <GlassInput 
                        required
                        label="Mobile Number"
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={formData.mobile}
                        onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <GlassInput 
                        label="Email Address (Optional)"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                      <GlassSelect 
                        required
                        label="Category"
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        options={[
                          { label: 'Appreciation', value: 'Appreciation' },
                          { label: 'Complaint', value: 'Complaint' },
                          { label: 'Suggestion', value: 'Suggestion' },
                          { label: 'Issue Report', value: 'Issue Report' },
                        ]}
                      />
                    </div>

                    <GlassInput 
                      required
                      label="Subject"
                      placeholder="Brief summary of your feedback"
                      value={formData.subject}
                      onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    />

                    <GlassTextarea 
                      required
                      label="Description"
                      placeholder="Please provide detailed information..."
                      rows={6}
                      value={formData.description}
                      onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />

                    <div className="pt-4 flex justify-end">
                      <GlassButton type="submit" variant="primary" className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3">
                        <Send size={18} /> Submit Feedback
                      </GlassButton>
                    </div>
                  </form>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-2xl mx-auto"
              >
                <GlassCard className="p-12">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Feedback Submitted!</h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    Thank you for your valuable feedback. We have received your submission.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 inline-block text-left w-full max-w-sm">
                    <p className="text-sm text-muted-foreground mb-1">Your Ticket ID:</p>
                    <p className="text-2xl font-mono font-bold text-primary-500">{submitted}</p>
                    <p className="text-xs text-muted-foreground mt-4">Please keep this ID for future reference.</p>
                  </div>
                  <div>
                    <GlassButton variant="outline" onClick={() => {
                      setSubmitted(null);
                      setFormData({
                        name: '', mobile: '', email: '', category: 'Appreciation', subject: '', description: ''
                      });
                    }}>
                      Submit Another
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>
      </main>
      <Footer />
    </div>
  );
};
