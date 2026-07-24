import { useState, useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { useMasterData } from '../../hooks/useMasterData';
import { ExamSchedule } from '../../types/master';
import { Class, Subject, Student } from '../../types/master';
import { Calendar, Clock, Search, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicExamSchedule = () => {
  const { data: schedules } = useMasterData<ExamSchedule>('exam-schedule');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { data: students } = useMasterData<Student>('students');

  const [studentName, setStudentName] = useState('');
  const [classId, setClassId] = useState('');
  const [rollNo, setRollNo] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const publishedSchedules = useMemo(() => {
    return schedules.filter(s => s.status === 'Scheduled');
  }, [schedules]);

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
        // Collect all exam papers relevant to this class from published schedules
        const relevantExams: any[] = publishedSchedules
          .filter(schedule => schedule.classId === classId)
          .map(schedule => ({
            examName: schedule.examName,
            paper: {
              date: schedule.examDate,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              duration: '',
              subjectId: schedule.subjectId,
              room: schedule.roomNumber,
              instructions: ''
            }
          }))
          .sort((a, b) => new Date(a.paper.date).getTime() - new Date(b.paper.date).getTime());
        
        setSearchResult({
          student,
          exams: relevantExams
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
            Exam <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Schedule</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your details below to check your upcoming examinations.
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
                <Search size={20} /> Check Exam Schedule
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
            className="max-w-5xl mx-auto"
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
                  <h2 className="text-2xl font-bold text-foreground">Exam Schedule for {searchResult.student.fullName}</h2>
                  <p className="text-muted-foreground">
                    Class: {getClassName(searchResult.student.classId)}
                  </p>
                </div>

                {searchResult.exams.length === 0 ? (
                  <GlassCard className="p-12 text-center text-muted-foreground">
                    No exams scheduled for your class at the moment.
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {searchResult.exams.map((examObj: any, idx: number) => {
                      const paper = examObj.paper;
                      const dateObj = new Date(paper.date);
                      return (
                        <GlassCard key={idx} className="p-6 relative overflow-hidden group border-l-4 border-l-secondary-500">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-foreground mb-1">{getSubjectName(paper.subjectId)}</h4>
                              <p className="text-sm font-medium text-muted-foreground">{examObj.examName}</p>
                            </div>
                            <div className="bg-primary-500/10 text-primary-500 px-4 py-2 rounded-xl text-center border border-primary-500/20">
                              <div className="text-xs font-bold uppercase tracking-wider">{dateObj.toLocaleString('default', { month: 'short' })}</div>
                              <div className="text-2xl font-black leading-none">{dateObj.getDate()}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mt-6">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                              <Clock size={16} className="text-emerald-500" />
                              <span className="font-medium text-foreground">{paper.startTime} - {paper.endTime}</span>
                              <span className="ml-auto text-xs text-muted-foreground">{paper.duration}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                              <MapPin size={16} className="text-rose-500" />
                              <span className="font-medium">Room: <span className="text-foreground">{paper.room}</span></span>
                            </div>
                            
                            {paper.instructions && (
                              <div className="flex items-start gap-3 text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                                <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                <span className="italic">{paper.instructions}</span>
                              </div>
                            )}
                          </div>
                        </GlassCard>
                      );
                    })}
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
