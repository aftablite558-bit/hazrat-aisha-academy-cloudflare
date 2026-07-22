import React, { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassTextarea } from '../../components/common/GlassTextarea';
import { Send, CheckCircle2, MessageSquare, Ticket, Sparkles, Heart, AlertTriangle, Lightbulb, ShieldCheck, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackTicket } from '../../types/content';
import { useToast } from '../../contexts/ToastContext';

export const PublicFeedback = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    category: 'Appreciation',
    subject: '',
    description: ''
  });

  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate Ticket ID
    const ticketId = 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
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
      schoolId: 'school-1'
    };
    
    // Save to local storage for admin portal synchronization
    const existing = JSON.parse(localStorage.getItem('feedback_tickets') || '[]');
    localStorage.setItem('feedback_tickets', JSON.stringify([newTicket, ...existing]));

    setSubmittedTicket(ticketId);
    
    // Trigger notification for admin portal
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifs.push({
      id: crypto.randomUUID(),
      title: 'New Feedback Submitted',
      message: `A new ${formData.category} ticket (${ticketId}) has been submitted by ${formData.name}.`,
      date: new Date().toISOString(),
      read: false,
      role: 'admin'
    });
    localStorage.setItem('notifications', JSON.stringify(notifs));

    addToast('Feedback ticket generated successfully!', 'success');
  };

  const copyTicketId = () => {
    if (!submittedTicket) return;
    navigator.clipboard.writeText(submittedTicket);
    setCopied(true);
    addToast('Ticket ID copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PublicLayout>
      <PageHeader 
        title="Public Feedback & Support Desk" 
        description="We value your feedback. Submit your appreciation, suggestions, complaints, or issue reports directly to Hazrat Aisha Academy administration." 
      />

      <div className="py-16 px-6 max-w-4xl mx-auto space-y-12 relative z-10">

        <AnimatePresence mode="wait">
          {!submittedTicket ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlassCard className="p-8 sm:p-12 border-emerald-500/20 shadow-xl">
                
                {/* Header Badge */}
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <MessageSquare size={26} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      Open Communication Desk
                    </span>
                    <h3 className="text-2xl font-black text-foreground mt-1">Submit Feedback Ticket</h3>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selector Cards */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Select Feedback Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Appreciation', icon: Heart, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
                        { label: 'Suggestion', icon: Lightbulb, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
                        { label: 'Complaint', icon: AlertTriangle, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
                        { label: 'Issue Report', icon: Ticket, color: 'text-teal-500 bg-teal-500/10 border-teal-500/30' },
                      ].map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = formData.category === cat.label;
                        return (
                          <button
                            key={cat.label}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: cat.label }))}
                            className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col items-center justify-center gap-2 ${
                              isSelected 
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-300 shadow-md font-bold' 
                                : 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-emerald-500/30'
                            }`}
                          >
                            <Icon size={20} className={cat.color.split(' ')[0]} />
                            <span className="text-xs">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassInput 
                      required
                      label="Full Name *"
                      placeholder="e.g. Syed Tariq Hussain"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <GlassInput 
                      required
                      label="Mobile Number *"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GlassInput 
                      label="Email Address (Optional)"
                      type="email"
                      placeholder="e.g. parent@example.com"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <GlassSelect 
                      required
                      label="Selected Category *"
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
                    label="Subject / Summary *"
                    placeholder="Brief headline of your feedback"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  />

                  <GlassTextarea 
                    required
                    label="Detailed Description *"
                    placeholder="Please explain your feedback or concern clearly so our team can address it effectively..."
                    rows={6}
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />

                  <div className="pt-4 flex justify-end">
                    <GlassButton 
                      type="submit" 
                      variant="primary" 
                      className="w-full sm:w-auto px-8 py-4 text-xs font-black rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-950/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      <span>Submit Feedback Ticket</span>
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
              className="text-center max-w-xl mx-auto"
            >
              <GlassCard className="p-10 border-emerald-500/30 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-500/30">
                  <CheckCircle2 size={44} />
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground">Feedback Submitted!</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    JazakAllah Khair. Your feedback has been registered and assigned to Hazrat Aisha Academy administrative team.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 text-center max-w-md mx-auto shadow-2xl relative overflow-hidden">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">Official Support Ticket ID</span>
                  <div className="flex items-center justify-center gap-3 my-2">
                    <p className="text-3xl font-mono font-black text-amber-300 tracking-wider">{submittedTicket}</p>
                    <button 
                      onClick={copyTicketId}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Copy Ticket ID"
                    >
                      {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">Keep this Ticket ID for reference when contacting school administration.</p>
                </div>

                <div className="pt-2">
                  <GlassButton 
                    variant="outline" 
                    onClick={() => {
                      setSubmittedTicket(null);
                      setFormData({
                        name: '', mobile: '', email: '', category: 'Appreciation', subject: '', description: ''
                      });
                    }}
                    className="px-6 py-3 rounded-2xl text-xs font-extrabold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    Submit Another Feedback Ticket
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PublicLayout>
  );
};
