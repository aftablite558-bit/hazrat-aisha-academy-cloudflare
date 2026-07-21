import React, { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassTextarea } from '../../components/common/GlassTextarea';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2, Sparkles, Building2, PhoneCall } from 'lucide-react';
import { useMasterData } from '../../hooks/useMasterData';
import { Enquiry } from '../../types/content';
import { useToast } from '../../contexts/ToastContext';
import { motion, AnimatePresence } from 'motion/react';

export const Contact = () => {
  const { addRecord } = useMasterData<Enquiry>('enquiries');
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addRecord({ ...formData, status: 'Pending' });
      addToast('Your enquiry has been submitted successfully!', 'success');
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      addToast('Failed to send message. Please try again.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <PageHeader 
        title="Contact & Help Desk" 
        description="Have questions regarding admissions, academics, or campus visits? Connect with Hazrat Aisha Academy in Sitamarhi, Bihar." 
      />

      <div className="py-16 px-6 max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Top Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-base text-foreground mb-1">Campus Location</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dilawarbagh, Sharif Colony,<br />Chak Rajopatti, Sitamarhi,<br />Bihar – 843302
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-amber-500/20 hover:border-amber-500/40 transition-all group">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <PhoneCall size={24} />
            </div>
            <h3 className="font-bold text-base text-foreground mb-1">Phone & WhatsApp</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Helpline: +91 9470818538<br />
              Mon – Sat: 8:00 AM – 3:00 PM
            </p>
            <a href="https://wa.me/919470818538" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-3 hover:underline">
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </GlassCard>

          <GlassCard className="p-6 border-teal-500/20 hover:border-teal-500/40 transition-all group">
            <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-base text-foreground mb-1">Email Desk</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Official Enquiries:<br />
              <span className="font-mono text-[11px] text-foreground">info@hazrataishaacademy.in</span>
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-purple-500/20 hover:border-purple-500/40 transition-all group">
            <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-base text-foreground mb-1">Office Hours</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Monday – Saturday<br />
              08:00 AM to 02:30 PM<br />
              <span className="text-[11px] text-amber-500 font-semibold">Sunday Closed</span>
            </p>
          </GlassCard>
        </div>

        {/* 2-Column Contact Form & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7">
            <GlassCard className="p-8 sm:p-10 border-emerald-500/20 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Online Enquiry
                </span>
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">Send Us a Direct Message</h3>
              <p className="text-xs text-muted-foreground mb-8">
                Fill in the details below and our administrative office will respond to your query promptly.
              </p>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center space-y-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="text-xl font-bold text-foreground">Message Delivered!</h4>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      JazakAllah Khair. Your enquiry has been received by Hazrat Aisha Academy. We will get back to you shortly.
                    </p>
                    <GlassButton 
                      variant="outline" 
                      onClick={() => setIsSuccess(false)}
                      className="text-xs font-bold px-6 py-2.5 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    >
                      Send Another Message
                    </GlassButton>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassInput 
                        required 
                        label="Full Name *" 
                        placeholder="e.g. Mohammad Rahil"
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                      />
                      <GlassInput 
                        required 
                        label="Email Address *" 
                        type="email" 
                        placeholder="e.g. name@example.com"
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GlassInput 
                        required 
                        label="Phone / Mobile Number *" 
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                      />
                      <GlassInput 
                        required 
                        label="Enquiry Subject *" 
                        placeholder="e.g. Class 5 Admission Query"
                        value={formData.subject} 
                        onChange={e => setFormData({...formData, subject: e.target.value})} 
                      />
                    </div>

                    <GlassTextarea 
                      required 
                      label="Your Message / Query *" 
                      rows={5} 
                      placeholder="Please write your query or message in detail..."
                      value={formData.message} 
                      onChange={e => setFormData({...formData, message: e.target.value})} 
                    />

                    <GlassButton 
                      type="submit" 
                      variant="primary" 
                      className="w-full py-4 text-xs font-black rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-950/20 hover:scale-105 transition-all flex items-center justify-center gap-2" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Enquiry Message</span>
                        </>
                      )}
                    </GlassButton>
                  </form>
                )}
              </AnimatePresence>
            </GlassCard>
          </div>

          {/* Campus Location Map & Details */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-8 border-teal-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Building2 size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">Visit Our Campus</h4>
                  <p className="text-xs text-muted-foreground">Chak Rajopatti, Sitamarhi</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-normal">
                Parents are welcome to visit our school campus during working hours to inspect our smart classrooms, science labs, Islamic resource library, and meet our principal.
              </p>

              {/* Map Embed Container */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-900 shadow-inner">
                <iframe 
                  title="Hazrat Aisha Academy Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14283.472183204!2d85.4800!3d26.5900!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec4e3d3f555555%3A0x123456789!2sSitamarhi%2C%20Bihar%20843302!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>Nearest Landmark: Sharif Colony</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">PIN: 843302</span>
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </PublicLayout>
  );
};
