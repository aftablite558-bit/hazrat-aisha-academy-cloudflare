const fs = require('fs');
let file = 'src/pages/public/Careers.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import \{ Briefcase, Calendar, GraduationCap \} from 'lucide-react';/, "import { Briefcase, Calendar, GraduationCap, X, Upload } from 'lucide-react';\nimport { useState } from 'react';\nimport { GlassInput } from '../../components/common/GlassInput';\nimport { GlassButton } from '../../components/common/GlassButton';\nimport { useToast } from '../../contexts/ToastContext';");

c = c.replace(/export const Careers = \(\) => \{/, `export const Careers = () => {
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
`);

c = c.replace(/<a href="\/contact" className="inline-flex items-center justify-center h-10 px-6 rounded-full font-medium transition-colors bg-primary-500 text-white hover:bg-primary-600">\s*Apply Now\s*<\/a>/g, `<button onClick={() => setSelectedJob(c)} className="inline-flex items-center justify-center h-10 px-6 rounded-full font-medium transition-colors bg-primary-500 text-white hover:bg-primary-600">
                    Apply Now
                  </button>`);

c = c.replace(/<\/main>\n\s*<Footer \/>\n\s*<\/div>\n\s*\);\n\};/, `</main>
      <Footer />
      
      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-foreground">Apply for {selectedJob.jobTitle}</h2>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
          </motion.div>
        </div>
      )}
    </div>
  );
};`);

fs.writeFileSync(file, c);
