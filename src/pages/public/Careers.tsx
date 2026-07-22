import { useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassBadge } from '../../components/common/GlassBadge';
import { useMasterData } from '../../hooks/useMasterData';
import { CareerVacancy } from '../../types/content';
import { Briefcase, Calendar, GraduationCap, X, Upload } from 'lucide-react';
import { useState } from 'react';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassModal } from '../../components/common/GlassModal';
import { useToast } from '../../contexts/ToastContext';
import { motion } from 'motion/react';

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
      
      addToast('Application submitted successfully!', 'success');
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
      addToast('Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: careers, loading } = useMasterData<CareerVacancy>('careers');

  const activeCareers = useMemo(() => {
    return careers.filter(c => c.status === 'Active');
  }, [careers]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Join Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Team</span>
          </h1>
          <p className="text-lg text-muted-foreground">Shape the future with us. Explore current openings at Hazrat Aisha Academy.</p>
        </motion.div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20">Loading vacancies...</div>
          ) : activeCareers.length === 0 ? (
            <GlassCard className="p-12 text-center text-muted-foreground">No open vacancies at the moment. Please check back later.</GlassCard>
          ) : (
            activeCareers.map((c, idx) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <GlassCard className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{c.jobTitle}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Briefcase size={16} /> {c.department}</span>
                        <span className="flex items-center gap-1.5"><GraduationCap size={16} /> {c.qualification}</span>
                        {c.lastDate && <span className="flex items-center gap-1.5 text-rose-500"><Calendar size={16} /> Last date: {c.lastDate}</span>}
                      </div>
                    </div>
                    <GlassBadge variant="success" className="w-fit">Active</GlassBadge>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none mb-6">
                    <p>{c.description}</p>
                    <p className="text-sm font-semibold mt-4">Required Experience: {c.experience}</p>
                  </div>
                  
                  <button onClick={() => setSelectedJob(c)} className="inline-flex items-center justify-center h-10 px-6 rounded-full font-medium transition-colors bg-primary-500 text-white hover:bg-primary-600">
                    Apply Now
                  </button>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </main>
      <Footer />
      
      {/* Application Modal */}
      <GlassModal 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        title={`Apply for ${selectedJob?.jobTitle}`}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput 
                label="Full Name"
                required
                value={formData.applicantName}
                onChange={e => setFormData(prev => ({ ...prev, applicantName: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <GlassInput 
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <GlassInput 
                  label="Phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlassInput 
                  label="Highest Qualification"
                  required
                  value={formData.qualification}
                  onChange={e => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                />
                <GlassInput 
                  label="Years of Experience"
                  required
                  value={formData.experience}
                  onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Resume/CV URL</label>
                <GlassInput 
                  placeholder="https://link-to-your-resume.pdf"
                  required
                  value={formData.resumeUrl}
                  onChange={e => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Please provide a link to your resume (e.g., Google Drive, LinkedIn profile, or personal website).</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <GlassButton type="button" variant="ghost" onClick={() => setSelectedJob(null)}>
                  Cancel
                </GlassButton>
                <GlassButton type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </GlassButton>
              </div>
            </form>
      </GlassModal>
    </div>
  );
};
