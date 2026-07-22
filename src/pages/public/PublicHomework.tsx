import { useState, useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { useMasterData } from '../../hooks/useMasterData';
import { Homework } from '../../types/academic';
import { Class, Subject, Teacher, Student } from '../../types/master';
import { FileText, Calendar, Clock, User, Search } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicHomework = () => {
  const { data: homeworks } = useMasterData<Homework>('homework');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { data: teachers } = useMasterData<Teacher>('teachers');
  const { data: students } = useMasterData<Student>('students');

  const [studentName, setStudentName] = useState('');
  const [classId, setClassId] = useState('');
  const [rollNo, setRollNo] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const publishedHomework = useMemo(() => {
    return homeworks.filter(hw => hw.isPublished);
  }, [homeworks]);

  const handleSearch = (e: React.FormEvent) => {
    
    setIsSearching(true);
    setTimeout(() => {
      performSearch();
      setIsSearching(false);
    }, 800);
  };
  const performSearch = () => {
    
    if (studentName.trim() && classId && rollNo.trim()) {
      const student = students.find(s => 
        s.fullName.toLowerCase() === studentName.trim().toLowerCase() &&
        s.classId === classId &&
        s.rollNo === rollNo.trim()
      );
      
      if (student) {
        const studentHomework = publishedHomework.filter(hw => hw.classId === classId)
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          
        setSearchResult({
          student,
          homework: studentHomework
        });
      } else {
        setSearchResult(null);
      }
      setHasSearched(true);
    }
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.className || 'Unknown';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.subjectName || 'Unknown';

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
            Student <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Homework</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your details below to check your assigned homework.
          </p>
        </motion.div>

        <GlassCard className="p-8 mb-12 max-w-3xl mx-auto border-t-4 border-t-primary-500">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassInput 
              required
              label="Student Name"
              placeholder="e.g. John Doe"
              value={studentName}
              onChange={e => { setStudentName(e.target.value); setHasSearched(false); }}
            />
            <GlassSelect 
              required
              label="Class"
              value={classId}
              onChange={e => { setClassId(e.target.value); setHasSearched(false); }}
              options={classes.map(c => ({ label: c.className, value: c.id }))}
            />
            <GlassInput 
              required
              label="Roll Number"
              placeholder="e.g. 12"
              value={rollNo}
              onChange={e => { setRollNo(e.target.value); setHasSearched(false); }}
            />
            <div className="md:col-span-3 mt-2">
              <GlassButton type="submit" variant="primary" className="w-full flex items-center justify-center gap-2 py-3 text-base">
                <Search size={20} /> Check Homework
              </GlassButton>
            </div>
          </form>
        </GlassCard>

        {isSearching ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : hasSearched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            {!searchResult ? (
              <GlassCard className="p-12 text-center max-w-4xl mx-auto">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Student record not found.</h3>
                <p className="text-muted-foreground">
                  Please check the details and try again. Ensure Name, Class, and Roll Number match exactly.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-8">
                <div className="text-center md:text-left mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Homework for {searchResult.student.fullName}</h2>
                  <p className="text-muted-foreground">
                    Class: {getClassName(searchResult.student.classId)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResult.homework.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                      No homework assigned for your class.
                    </div>
                  ) : (
                    searchResult.homework.map((hw: any, idx: number) => (
                      <motion.div
                        key={hw.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <GlassCard className="h-full flex flex-col p-6 hover:-translate-y-1 transition-transform duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-500/20 text-primary-500 border border-primary-500/30">
                              {getSubjectName(hw.subjectId)}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-foreground mb-3">{hw.title}</h3>
                          <p className="text-sm text-muted-foreground mb-6 flex-grow line-clamp-3">
                            {hw.description}
                          </p>
                          
                          <div className="space-y-3 mt-auto pt-4 border-t border-white/10">
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                              <Calendar size={14} className="text-secondary-500" />
                              <span>Assigned: {new Date(hw.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground gap-2">
                              <Clock size={14} className="text-rose-500" />
                              <span className="font-semibold text-rose-500/80">Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                            </div>
                            {hw.attachmentUrl && (
                              <div className="flex justify-end mt-2 pt-2">
                                <a 
                                  href={hw.attachmentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors bg-primary-500/10 px-3 py-1.5 rounded-md"
                                >
                                  <FileText size={14} /> View Attachment
                                </a>
                              </div>
                            )}
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};
