import React, { useState, useMemo } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassBadge } from '../../components/common/GlassBadge';
import { SkeletonCard, SkeletonTable } from '../../components/common/SkeletonLoader';
import { useMasterData } from '../../hooks/useMasterData';
import { ExamSchedule } from '../../types/academic';
import { Class, Subject, Student } from '../../types/master';
import { 
  Calendar, Clock, Search, MapPin, AlertCircle, Printer, 
  Sparkles, BookOpen, CheckCircle2, LayoutGrid, LayoutList, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const publishedSchedules = useMemo(() => {
    return schedules.filter(s => s.status === 'Published');
  }, [schedules]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      performSearch();
      setIsSearching(false);
    }, 600);
  };

  const performSearch = () => {
    if (studentName.trim() && classId && rollNo.trim()) {
      const student = students.find(s => 
        s.fullName.toLowerCase() === studentName.trim().toLowerCase() &&
        s.classId === classId &&
        s.rollNo === rollNo.trim()
      );
      
      if (student) {
        const relevantExams: any[] = [];
        
        publishedSchedules.forEach(schedule => {
          if (schedule.classes.includes(classId) && schedule.papers) {
            const classPapers = schedule.papers.filter(p => p.classId === classId);
            classPapers.forEach(paper => {
              relevantExams.push({
                examName: schedule.examName,
                paper
              });
            });
          }
        });
        
        relevantExams.sort((a, b) => new Date(a.paper.date).getTime() - new Date(b.paper.date).getTime());
        
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

  const resetForm = () => {
    setStudentName('');
    setClassId('');
    setRollNo('');
    setHasSearched(false);
    setSearchResult(null);
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.className || 'Unknown Class';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.subjectName || 'General Subject';

  const handlePrint = () => {
    window.print();
  };

  return (
    <PublicLayout>
      <div className="print:hidden">
        <PageHeader 
          title="Examination Timetable" 
          description="Check upcoming examination date sheets, subject paper timings, hall seatings, and instructions at Hazrat Aisha Academy." 
        />
      </div>

      <main className="py-12 px-6 max-w-7xl mx-auto min-h-screen relative z-10 print:p-0 print:m-0">
        
        {/* Search Card Section */}
        <div className="max-w-3xl mx-auto mb-12 print:hidden">
          <GlassCard className="p-8 sm:p-10 border-emerald-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Calendar size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Exam Portal
                </span>
                <h2 className="text-xl font-black text-foreground mt-1">Look Up Exam Timetable</h2>
              </div>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassInput 
                  required
                  label="Student Full Name *"
                  placeholder="e.g. Abdullah Khan"
                  value={studentName}
                  onChange={e => { setStudentName(e.target.value); setHasSearched(false); }}
                />
                
                <GlassSelect 
                  required
                  label="Select Class *"
                  value={classId}
                  onChange={e => { setClassId(e.target.value); setHasSearched(false); }}
                  options={classes.map(c => ({ label: c.className, value: c.id }))}
                />

                <GlassInput 
                  required
                  label="Roll Number *"
                  placeholder="e.g. 12"
                  value={rollNo}
                  onChange={e => { setRollNo(e.target.value); setHasSearched(false); }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-amber-500 flex-none" />
                  <span>Enter student credentials to fetch official exam timetable.</span>
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {hasSearched && (
                    <GlassButton 
                      type="button" 
                      variant="ghost" 
                      onClick={resetForm} 
                      className="px-4 py-3 text-xs font-bold flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} /> Reset
                    </GlassButton>
                  )}
                  <GlassButton 
                    type="submit" 
                    variant="primary" 
                    className="w-full sm:w-auto px-8 py-3.5 text-xs font-black rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-950/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Search size={16} />
                    <span>Check Timetable</span>
                  </GlassButton>
                </div>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Loading State with Skeleton Loaders */}
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-5xl mx-auto space-y-6"
            >
              <SkeletonCard />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </motion.div>
          ) : !hasSearched ? (
            /* Initial Empty Guide State */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <GlassCard className="p-10 border-slate-200/60 dark:border-slate-800/60 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Look Up Examination Schedule</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Enter student details above to view subject paper dates, exam timings, assigned hall numbers, and specific instructions for upcoming tests.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Official CBSE & Deeniyat Examination Schedules</span>
                </div>
              </GlassCard>
            </motion.div>
          ) : !searchResult ? (
            /* Not Found Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center"
            >
              <GlassCard className="p-10 border-rose-500/30 text-center space-y-4">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-foreground">Student Record Not Found</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No matching record for <span className="font-bold text-foreground">{studentName}</span> in Class ID <span className="font-bold text-foreground">{classId}</span> with Roll No <span className="font-bold text-foreground">{rollNo}</span>.
                </p>
                <GlassButton onClick={resetForm} variant="outline" className="text-xs font-bold border-rose-500/30 text-rose-600 dark:text-rose-400">
                  Try Again
                </GlassButton>
              </GlassCard>
            </motion.div>
          ) : (
            /* Exam Schedule Results View */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              {/* Header Banner & Actions */}
              <GlassCard className="p-8 border-emerald-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-emerald-950/80 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  <div className="space-y-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                        Official Date Sheet
                      </span>
                      <GlassBadge variant="success" className="text-[10px] uppercase font-extrabold">Session 2026-27</GlassBadge>
                    </div>
                    <h2 className="text-2xl font-black text-white">{searchResult.student.fullName}</h2>
                    <p className="text-xs text-slate-300 font-semibold">
                      Class: <span className="text-emerald-400">{getClassName(searchResult.student.classId)}</span> | Roll No: <span className="text-amber-300">{searchResult.student.rollNo}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Mode Switcher */}
                    <div className="flex items-center p-1 bg-white/10 rounded-xl border border-white/10 text-xs print:hidden">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg flex items-center gap-1.5 transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                        title="Grid View"
                      >
                        <LayoutGrid size={16} />
                        <span className="hidden sm:inline">Cards</span>
                      </button>
                      <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg flex items-center gap-1.5 transition-all ${viewMode === 'table' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                        title="Table View"
                      >
                        <LayoutList size={16} />
                        <span className="hidden sm:inline">Date Sheet</span>
                      </button>
                    </div>

                    <GlassButton onClick={handlePrint} variant="primary" className="px-5 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex items-center gap-2 print:hidden">
                      <Printer size={16} />
                      <span className="hidden sm:inline">Print Date Sheet</span>
                    </GlassButton>
                  </div>

                </div>
              </GlassCard>

              {/* No Exams Scheduled State */}
              {searchResult.exams.length === 0 ? (
                <GlassCard className="p-12 text-center text-muted-foreground border-emerald-500/20">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No Upcoming Exams</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    There are no published examination schedules for <span className="font-bold text-foreground">{getClassName(searchResult.student.classId)}</span> at this time.
                  </p>
                </GlassCard>
              ) : viewMode === 'grid' ? (
                /* Grid View Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResult.exams.map((examObj: any, idx: number) => {
                    const paper = examObj.paper;
                    const dateObj = new Date(paper.date);
                    const monthName = dateObj.toLocaleString('default', { month: 'short' });
                    const dayNum = dateObj.getDate();
                    const dayName = dateObj.toLocaleDateString('default', { weekday: 'long' });

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <GlassCard className="p-6 border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-xl group relative overflow-hidden">
                          
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                                {examObj.examName}
                              </span>
                              <h3 className="text-xl font-extrabold text-foreground mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {getSubjectName(paper.subjectId)}
                              </h3>
                            </div>

                            {/* Date Badge Box */}
                            <div className="bg-slate-900 text-white p-3 rounded-2xl text-center border border-emerald-500/30 shrink-0 min-w-[70px] shadow-md">
                              <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">{monthName}</p>
                              <p className="text-2xl font-black leading-none my-0.5">{dayNum}</p>
                              <p className="text-[9px] font-bold text-slate-400">{dayName}</p>
                            </div>
                          </div>

                          <div className="space-y-2.5 text-xs text-muted-foreground pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                              <Clock size={16} className="text-emerald-500 shrink-0" />
                              <span>Time: <strong className="text-foreground">{paper.startTime} – {paper.endTime}</strong></span>
                              <span className="ml-auto text-[11px] text-slate-500">({paper.duration || '2 Hours'})</span>
                            </div>

                            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 font-semibold text-slate-700 dark:text-slate-300">
                              <MapPin size={16} className="text-rose-500 shrink-0" />
                              <span>Examination Room: <strong className="text-foreground">{paper.room || 'Main Hall'}</strong></span>
                            </div>

                            {paper.instructions && (
                              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px]">
                                <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                                <span>{paper.instructions}</span>
                              </div>
                            )}
                          </div>

                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* Full Date Sheet Table View */
                <GlassCard className="p-6 sm:p-8 border-emerald-500/20 shadow-xl">
                  <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold">
                          <th className="p-4">Date & Day</th>
                          <th className="p-4">Exam & Subject</th>
                          <th className="p-4">Timing & Duration</th>
                          <th className="p-4">Room No.</th>
                          <th className="p-4">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                        {searchResult.exams.map((examObj: any, idx: number) => {
                          const paper = examObj.paper;
                          const dateObj = new Date(paper.date);
                          const dateStr = dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
                          const dayStr = dateObj.toLocaleDateString('default', { weekday: 'long' });

                          return (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-4">
                                <p className="font-extrabold text-foreground">{dateStr}</p>
                                <p className="text-[11px] text-muted-foreground">{dayStr}</p>
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {examObj.examName}
                                </span>
                                <p className="font-bold text-foreground text-sm mt-1">{getSubjectName(paper.subjectId)}</p>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-foreground">{paper.startTime} – {paper.endTime}</p>
                                <p className="text-[11px] text-muted-foreground">{paper.duration || '2 Hours'}</p>
                              </td>
                              <td className="p-4 font-bold text-foreground">
                                {paper.room || 'Main Hall'}
                              </td>
                              <td className="p-4 text-muted-foreground text-[11px]">
                                {paper.instructions || 'Arrive 15 minutes prior with admit card.'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </PublicLayout>
  );
};
