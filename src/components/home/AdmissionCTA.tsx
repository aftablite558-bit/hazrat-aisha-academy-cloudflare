import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { motion } from 'motion/react';
import { 
  Sparkles, ArrowRight, PhoneCall, MessageCircle, 
  CheckCircle2, FileText, UserCheck, GraduationCap, ShieldCheck
} from 'lucide-react';

export const AdmissionCTA = () => {
  const navigate = useNavigate();

  const admissionSteps = [
    { num: '01', title: 'Submit Application', desc: 'Fill the quick online admission form or visit campus in Chak Rajopatti.' },
    { num: '02', title: 'Document & Interaction', desc: 'Brief student interaction & verification of previous academic reports.' },
    { num: '03', title: 'Seat Allocation', desc: 'Receive official confirmation and join Hazrat Aisha Academy family.' },
  ];

  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-to-r from-emerald-600/15 via-teal-600/15 to-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <GlassCard className="p-8 sm:p-14 relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-emerald-950/80 shadow-2xl shadow-emerald-950/30">
          
          {/* Floating Islamic Geometry Accent */}
          <div className="absolute -right-20 -bottom-20 opacity-10 text-emerald-400 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(0 50 50)" />
              <rect x="20" y="20" width="60" height="60" rx="4" transform="rotate(45 50 50)" />
              <circle cx="50" cy="50" r="20" />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
            {/* Top Admission Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest"
            >
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>Admissions Open • Academic Session 2026–27</span>
            </motion.div>

            {/* Headline */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
            >
              Begin Your Child’s Journey of Faith, Knowledge & Character
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed"
            >
              Give your child the gift of CBSE-aligned modern education combined with authentic Islamic values at Hazrat Aisha Academy in Sitamarhi, Bihar. Limited seats available for the upcoming session.
            </motion.p>

            {/* 3-Step Process Highlights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 text-left"
            >
              {admissionSteps.map((step) => (
                <div key={step.num} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Step {step.num}
                    </span>
                    <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{step.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <GlassButton 
                variant="primary" 
                onClick={() => navigate('/admissions')}
                className="w-full sm:w-auto px-8 py-4 text-xs font-extrabold rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap size={18} />
                <span>Apply Online For Admission</span>
                <ArrowRight size={16} />
              </GlassButton>

              <a 
                href="https://wa.me/919470818538" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <GlassButton 
                  variant="glass" 
                  className="w-full sm:w-auto px-6 py-4 text-xs font-bold rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} className="text-emerald-400" />
                  <span>WhatsApp Admission Enquiry</span>
                </GlassButton>
              </a>

              <a 
                href="tel:+919470818538"
                className="w-full sm:w-auto"
              >
                <GlassButton 
                  variant="ghost" 
                  className="w-full sm:w-auto px-6 py-4 text-xs font-semibold rounded-2xl text-amber-300 hover:text-amber-200 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall size={16} />
                  <span>Helpline: +91 9470818538</span>
                </GlassButton>
              </a>
            </motion.div>

            {/* Bottom Trust Guarantee */}
            <div className="pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck size={14} /> Transparent Fee Structure
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <UserCheck size={14} /> Direct Principal Consultation
              </span>
            </div>

          </div>
        </GlassCard>
      </div>
    </section>
  );
};
