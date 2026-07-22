import React, { useState, useMemo } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassBadge } from '../../components/common/GlassBadge';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassModal } from '../../components/common/GlassModal';
import { useMasterData } from '../../hooks/useMasterData';
import { CareerVacancy } from '../../types/content';
import { useToast } from '../../contexts/ToastContext';
import { motion } from 'motion/react';
import { 
  Briefcase, Calendar, GraduationCap, Sparkles, Heart, 
  Award, BookOpen, Clock, Send, ArrowRight, CheckCircle2, UserCheck, ShieldCheck
} from 'lucide-react';

export const Careers = () => {
  const { addToast } = useToast();
  const [selectedJob, setSelectedJob] = useState<CareerVacancy | null>(null);
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    resumeUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: careers, loading } = useMasterData<CareerVacancy>('careers');

  const activeCareers = useMemo(() => {
    return careers.filter(c => c.status === 'Active');
  }, [careers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/collection/career_applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          appliedPosition: selectedJob.jobTitle,
          appliedDate: new Date().toISOString(),
          status: 'Pending'
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit application');
      
      addToast('Application submitted successfully! Our HR team will contact you.', 'success');
      setSelectedJob(null);
      setFormData({
        applicantName: '',
        email: '',
        phone: '',
        qualification: '',
        experience: '',
        resumeUrl: ''
      });
    } catch (error) {
      console.error(error);
      addToast('Failed to submit application. Please try again.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <PageHeader 
        title="Career Opportunities" 
        description="Join our team of dedicated educators and staff at Hazrat Aisha Academy in Sitamarhi, Bihar. Inspire young minds with knowledge and moral values." 
      />

      <div className="py-16 px-6 max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Why Teach At HAA Card */}
        <GlassCard className="p-8 sm:p-12 border-emerald-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-emerald-950/80 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
              <Sparkles size={14} className="text-amber-400" />
              <span>Teaching & Administrative Faculty</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Why Build Your Teaching Career With Us?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Hazrat Aisha Academy provides a respectful, supportive Islamic work environment with modern digital classroom infrastructure, competitive remuneration, professional workshops, and opportunities for continuous career growth in Sitamarhi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck size={16} /> Respectful Islamic Atmosphere
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Award size={16} /> Professional Development
              </div>
              <div className="flex items-center gap-2 text-teal-400">
                <BookOpen size={16} /> Smart Class Digital Tools
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Current Job Openings Header */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Open Positions
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-2">Current Career Vacancies</h3>
            </div>
            <p className="text-xs text-muted-foreground font-semibold">
              Showing {activeCareers.length} active job {activeCareers.length === 1 ? 'opening' : 'openings'}
            </p>
          </div>

          {/* Job Openings List */}
          {loading ? (
            <div className="flex justify-center p-20">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeCareers.length === 0 ? (
            <GlassCard className="p-12 text-center text-muted-foreground">
              <p className="text-sm font-semibold">There are no open teaching or staff vacancies at this moment.</p>
              <p className="text-xs mt-1">Interested candidates may send their CVs to info@hazrataishaacademy.in for future consideration.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {activeCareers.map((c, idx) => (
                <motion.div 
                  key={c.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.1 }}
                >
                  <GlassCard className="p-8 border-emerald-500/20 hover:border-emerald-500/40 transition-all group hover:shadow-xl">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {c.jobTitle}
                          </h3>
                          <GlassBadge variant="success" className="text-[10px] uppercase tracking-wider font-extrabold">Active</GlassBadge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-emerald-500" /> Dept: {c.department}</span>
                          <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-amber-500" /> Qualification: {c.qualification}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-teal-500" /> Exp: {c.experience}</span>
                          {c.lastDate && (
                            <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                              <Calendar size={14} /> Last Date: {c.lastDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <GlassButton 
                        onClick={() => setSelectedJob(c)} 
                        variant="primary"
                        className="px-6 py-3 text-xs font-extrabold rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        <Send size={14} />
                        <span>Apply For Position</span>
                      </GlassButton>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-muted-foreground leading-relaxed font-normal">
                      <p>{c.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Application Modal */}
      <GlassModal 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        title={`Apply for Position: ${selectedJob?.jobTitle}`}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
          <GlassInput 
            label="Full Name *"
            placeholder="e.g. Dr. Salman Farooqui"
            required
            value={formData.applicantName}
            onChange={e => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassInput 
              label="Email Address *"
              type="email"
              placeholder="e.g. salman@example.com"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <GlassInput 
              label="Phone Number *"
              type="tel"
              placeholder="10-digit mobile"
              required
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassInput 
              label="Highest Qualification *"
              placeholder="e.g. M.Sc. B.Ed / Alimiyyah"
              required
              value={formData.qualification}
              onChange={e => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
            />
            <GlassInput 
              label="Years of Experience *"
              placeholder="e.g. 3 Years"
              required
              value={formData.experience}
              onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <GlassInput 
              label="Resume / CV Link (Google Drive / LinkedIn) *"
              placeholder="https://drive.google.com/file/d/..."
              required
              value={formData.resumeUrl}
              onChange={e => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
            />
            <p className="text-[11px] text-muted-foreground">Please share a public link to your updated CV or resume document.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <GlassButton type="button" variant="ghost" onClick={() => setSelectedJob(null)} disabled={isSubmitting}>
              Cancel
            </GlassButton>
            <GlassButton 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit Application</span>
                </>
              )}
            </GlassButton>
          </div>
        </form>
      </GlassModal>

    </PublicLayout>
  );
};
