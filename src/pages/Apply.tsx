import React from 'react';
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { PremiumButton } from '../components/common/PremiumButton';
import { PremiumCard } from '../components/common/PremiumCard';
import { PremiumInput } from '../components/common/PremiumInput';
import { PremiumSelect } from '../components/common/PremiumSelect';
import { PremiumTextarea } from '../components/common/PremiumTextarea';
import { motion } from 'motion/react';

const Apply = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <PremiumCard className="text-center p-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-[32px] flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-neutral-900 mb-4 tracking-tight">Application Sent!</h2>
            <p className="text-neutral-500 mb-8 leading-relaxed">
              Thank you for applying to Hazrat Aisha Academy. Our admission office will review your application and get back to you within 3-5 working days.
            </p>
            <PremiumButton onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
              Submit Another Application
            </PremiumButton>
          </PremiumCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-neutral-900 tracking-tighter mb-6 leading-tight">Join Our Academy</h1>
        <p className="text-neutral-500 text-xl max-w-2xl mx-auto leading-relaxed">
          Start your journey of excellence. Fill out the form below to initiate the admission process for the 2024-25 academic year.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Guidance */}
        <div className="lg:col-span-1 space-y-8">
          <PremiumCard className="bg-emerald-900 text-white p-10 rounded-[40px]">
            <h3 className="text-xl font-black mb-6 tracking-tight">Admission Process</h3>
            <div className="space-y-8">
              {[
                { step: '01', title: 'Online Form', desc: 'Complete the digital application with accurate details.' },
                { step: '02', title: 'Document Review', desc: 'Our team will verify the submitted documents.' },
                { step: '03', title: 'Entrance Test', desc: 'Students will appear for a basic competency assessment.' },
                { step: '04', title: 'Final Interview', desc: 'Meeting with the Principal for final selection.' },
              ].map((item, i) => (
                <div key={i} className="flex space-x-6">
                  <span className="text-emerald-500 font-black text-sm tracking-widest">{item.step}</span>
                  <div>
                    <h4 className="font-black text-sm mb-1 uppercase tracking-widest">{item.title}</h4>
                    <p className="text-emerald-200/60 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          <div className="p-8 border-2 border-dashed border-neutral-200 rounded-[40px]">
            <h4 className="font-black text-neutral-900 mb-4 tracking-tight uppercase text-xs tracking-[0.2em]">Required Documents</h4>
            <ul className="space-y-3">
              {['Birth Certificate', 'Previous School Report', 'Aadhar Card', 'Recent Photographs'].map((doc, i) => (
                <li key={i} className="flex items-center text-sm font-bold text-neutral-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-3" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Application Form */}
        <div className="lg:col-span-2">
          <PremiumCard className="p-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PremiumInput 
                  label="Student Full Name"
                  placeholder="Enter student's legal name"
                  icon={<User className="h-5 w-5" />}
                  required
                />
                <PremiumSelect 
                  label="Applying for Grade"
                  options={[
                    { label: 'Nursery', value: 'nursery' },
                    { label: 'KG I', value: 'kg1' },
                    { label: 'KG II', value: 'kg2' },
                    { label: 'Class 1', value: '1' },
                    { label: 'Class 2', value: '2' },
                    { label: 'Class 3', value: '3' },
                    { label: 'Class 4', value: '4' },
                    { label: 'Class 5', value: '5' },
                  ]}
                  required
                />
                <PremiumInput 
                  label="Date of Birth"
                  type="date"
                  icon={<Calendar className="h-5 w-5" />}
                  required
                />
                <PremiumInput 
                  label="Father / Guardian Name"
                  placeholder="Enter full name"
                  icon={<User className="h-5 w-5" />}
                  required
                />
                <PremiumInput 
                  label="Contact Email"
                  type="email"
                  placeholder="example@email.com"
                  icon={<Mail className="h-5 w-5" />}
                  required
                />
                <PremiumInput 
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  icon={<Phone className="h-5 w-5" />}
                  required
                />
              </div>

              <PremiumTextarea 
                label="Residential Address"
                placeholder="Complete postal address..."
                icon={<MapPin className="h-5 w-5" />}
                required
              />

              <div className="pt-6 border-t border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <p className="text-xs text-neutral-400 font-bold max-w-sm">
                  By submitting this form, you agree to our terms of admission and confirm that all provided information is accurate.
                </p>
                <PremiumButton size="lg" type="submit" className="min-w-[200px] shadow-2xl">
                  Submit Application
                  <Send className="h-4 w-4 ml-2" />
                </PremiumButton>
              </div>
            </form>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
};

export default Apply;
