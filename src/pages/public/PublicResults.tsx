import { useState, useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassBadge } from '../../components/common/GlassBadge';
import { useMasterData } from '../../hooks/useMasterData';
import { Result } from '../../types/academic';
import { Student, Class, Section } from '../../types/master';
import { Search, Award, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicResults = () => {
  const { data: results } = useMasterData<Result>('results');
  const { data: students } = useMasterData<Student>('students');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: sections } = useMasterData<Section>('sections');

  const [searchId, setSearchId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const publishedResults = useMemo(() => {
    return results.filter(r => r.isPublished);
  }, [results]);

  const searchResult = useMemo(() => {
    if (!hasSearched || !searchId) return null;
    
    // Find student by admissionNo or rollNo
    const student = students.find(s => 
      s.admissionNo.toLowerCase() === searchId.toLowerCase() || 
      s.rollNo.toLowerCase() === searchId.toLowerCase()
    );

    if (!student) return null;

    // Find all published results for this student
    const studentResults = publishedResults.filter(r => r.studentId === student.id);
    
    return {
      student,
      results: studentResults
    };
  }, [hasSearched, searchId, students, publishedResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setHasSearched(true);
    }
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.className || 'Unknown';
  const getSectionName = (id: string) => sections.find(s => s.id === id)?.sectionName || 'Unknown';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Exam <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Results</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your Admission Number or Roll Number to check your published exam results.
          </p>
        </motion.div>

        <GlassCard className="p-8 mb-12 max-w-xl mx-auto border-t-4 border-t-primary-500">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <GlassInput 
              required
              label="Admission No / Roll No"
              placeholder="e.g. ADM2026001 or 45"
              value={searchId}
              onChange={e => { setSearchId(e.target.value); setHasSearched(false); }}
            />
            <GlassButton type="submit" variant="primary" className="w-full flex items-center justify-center gap-2 mt-2 py-3 text-base">
              <Search size={20} /> Search Results
            </GlassButton>
          </form>
        </GlassCard>

        {hasSearched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {!searchResult ? (
              <GlassCard className="p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  We couldn't find any student or published results matching "{searchId}". Please check the number and try again.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-6">
                {/* Student Profile Summary */}
                <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border-b-4 border-b-secondary-500">
                  <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center overflow-hidden border-2 border-white/20 shrink-0">
                    {searchResult.student.photoUrl ? (
                      <img src={searchResult.student.photoUrl} alt={searchResult.student.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap size={40} className="text-primary-500 opacity-50" />
                    )}
                  </div>
                  <div className="text-center md:text-left flex-grow">
                    <h2 className="text-2xl font-bold text-foreground mb-1">{searchResult.student.fullName}</h2>
                    <p className="text-muted-foreground mb-4">
                      {getClassName(searchResult.student.classId)} - {getSectionName(searchResult.student.sectionId)}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="glass p-3 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Admission No</p>
                        <p className="font-semibold">{searchResult.student.admissionNo}</p>
                      </div>
                      <div className="glass p-3 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Roll No</p>
                        <p className="font-semibold">{searchResult.student.rollNo}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Results List */}
                <h3 className="text-xl font-bold text-foreground pl-2 mt-8 mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-primary-500" /> Academic Performance
                </h3>
                
                {searchResult.results.length === 0 ? (
                  <GlassCard className="p-8 text-center text-muted-foreground">
                    No published results available for this student yet.
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {searchResult.results.map((res, idx) => (
                      <GlassCard key={res.id} className="p-6 relative overflow-hidden group">
                        {/* Decorative Background */}
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors" />
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div>
                            <h4 className="text-xl font-bold text-foreground">{res.examName}</h4>
                            <p className="text-sm text-muted-foreground">Result Published</p>
                          </div>
                          <GlassBadge variant={res.status === 'Pass' ? 'success' : 'danger'}>
                            {res.status}
                          </GlassBadge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Marks</p>
                            <p className="text-lg font-semibold">{res.totalMarks}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Obtained</p>
                            <p className="text-lg font-bold text-primary-500">{res.obtainedMarks}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Percentage</p>
                            <p className="text-lg font-semibold">{res.percentage.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Grade</p>
                            <div className="flex items-center gap-1.5">
                              <Award size={18} className={res.status === 'Pass' ? 'text-amber-500' : 'text-rose-500'} />
                              <span className="text-xl font-black">{res.grade}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status bar */}
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative z-10">
                          <div 
                            className={`h-full rounded-full ${res.status === 'Pass' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(res.percentage, 100)}%` }}
                          />
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};
