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
import { Homework } from '../../types/academic';
import { Class, Subject, Teacher, Student } from '../../types/master';
import { 
  FileText, Calendar, Clock, User, Search, BookOpen, 
  Printer, CheckCircle2, AlertCircle, Sparkles, Download, 
  LayoutGrid, LayoutList, RefreshCw, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const publishedHomework = useMemo(() => {
    return homeworks.filter(hw => hw.isPublished);
  }, [homeworks]);

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
        const studentHomework = publishedHomework
          .filter(hw => hw.classId === classId)
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

  const resetForm = () => {
    setStudentName('');
    setClassId('');
    setRollNo('');
    setHasSearched(false);
    setSearchResult(null);
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.className || 'Unknown Class';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.subjectName || 'General';

  const handlePrint = () => {
    window.print();
  };

  return (
    <PublicLayout>
      <div className="print:hidden">
        <PageHeader 
          title="Student Homework & Tasks" 
          description="Access daily class homework, subject assignments, study worksheets, and submission deadlines at Hazrat Aisha Academy." 
        />
      </div>

      <main className="py-12 px-6 max-w-7xl mx-auto min-h-screen relative z-10 print:p-0 print:m-0">
        
        {/* Search Card Section */}
        <div className="max-w-3xl mx-auto mb-12 print:hidden">
          <GlassCard className="p-8 sm:p-10 border-emerald-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <BookOpen size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Academic Portal
                </span>
                <h2 className="text-xl font-black text-foreground mt-1">Check Student Homework</h2>
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
                  <span>Enter student credentials to filter assignments for your class.</span>
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
                    <span>Check Homework</span>
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
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Search Daily Homework Assignments</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Enter student details above to view subject tasks, homework descriptions, due dates, and download study worksheets assigned by teachers.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Homework updated daily after school hours</span>
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
                  No student matching <span className="font-bold text-foreground">{studentName}</span> in Class ID <span className="font-bold text-foreground">{classId}</span> with Roll No <span className="font-bold text-foreground">{rollNo}</span> was found.
                </p>
                <GlassButton onClick={resetForm} variant="outline" className="text-xs font-bold border-rose-500/30 text-rose-600 dark:text-rose-400">
                  Try Searching Again
                </GlassButton>
              </GlassCard>
            </motion.div>
          ) : (
            /* Homework Results View */
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
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                        Class Homework Dashboard
                      </span>
                      <GlassBadge variant="success" className="text-[10px] uppercase font-extrabold">Session 2026-27</GlassBadge>
                    </div>
                    <h2 className="text-2xl font-black text-white">{searchResult.student.fullName}</h2>
                    <p className="text-xs text-slate-300 font-semibold">
                      Class: <span className="text-emerald-400">{getClassName(searchResult.student.classId)}</span> | Roll No: <span className="text-amber-300">{searchResult.student.rollNo}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Switcher */}
                    <div className="flex items-center p-1 bg-white/10 rounded-xl border border-white/10 text-xs print:hidden">
                      <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg flex items-center gap-1.5 transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                        title="Grid View"
                      >
                        <LayoutGrid size={16} />
                        <span className="hidden sm:inline">Grid</span>
                      </button>
                      <button 
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg flex items-center gap-1.5 transition-all ${viewMode === 'table' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
                        title="Table View"
                      >
                        <LayoutList size={16} />
                        <span className="hidden sm:inline">Table</span>
                      </button>
                    </div>

                    <GlassButton onClick={handlePrint} variant="primary" className="px-5 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex items-center gap-2 print:hidden">
                      <Printer size={16} />
                      <span className="hidden sm:inline">Print Sheet</span>
                    </GlassButton>
                  </div>

                </div>
              </GlassCard>

              {/* No Homework Assigned Empty State */}
              {searchResult.homework.length === 0 ? (
                <GlassCard className="p-12 text-center text-muted-foreground border-emerald-500/20">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">All Caught Up!</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    There are currently no pending homework assignments published for <span className="font-bold text-foreground">{getClassName(searchResult.student.classId)}</span>.
                  </p>
                </GlassCard>
              ) : viewMode === 'grid' ? (
                /* Grid View Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResult.homework.map((hw: any, idx: number) => {
                    const createdDate = new Date(hw.createdAt || Date.now()).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
                    const dueDateObj = new Date(hw.dueDate);
                    const dueDateStr = dueDateObj.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <motion.div
                        key={hw.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <GlassCard className="h-full flex flex-col p-6 border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:shadow-xl group">
                          
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {getSubjectName(hw.subjectId)}
                            </span>

                            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                              <Clock size={12} />
                              <span>Due {dueDateStr}</span>
                            </div>
                          </div>

                          <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {hw.title}
                          </h3>

                          <p className="text-xs text-muted-foreground mb-6 flex-grow leading-relaxed font-normal">
                            {hw.description}
                          </p>

                          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3 mt-auto">
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={13} className="text-emerald-500" /> Assigned: {createdDate}
                              </span>
                            </div>

                            {hw.attachmentUrl && (
                              <a 
                                href={hw.attachmentUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-emerald-500/20"
                              >
                                <Paperclip size={14} />
                                <span>Download Worksheet / Attachment</span>
                              </a>
                            )}
                          </div>

                        </GlassCard>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* Table View */
                <GlassCard className="p-6 sm:p-8 border-emerald-500/20 shadow-xl">
                  <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold">
                          <th className="p-4">Subject</th>
                          <th className="p-4">Homework Title & Details</th>
                          <th className="p-4">Assigned Date</th>
                          <th className="p-4">Due Date</th>
                          <th className="p-4 text-right">Attachment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                        {searchResult.homework.map((hw: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {getSubjectName(hw.subjectId)}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-foreground text-xs">{hw.title}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{hw.description}</p>
                            </td>
                            <td className="p-4 text-muted-foreground font-medium">
                              {new Date(hw.createdAt || Date.now()).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="p-4">
                              <span className="text-rose-500 font-bold">
                                {new Date(hw.dueDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {hw.attachmentUrl ? (
                                <a 
                                  href={hw.attachmentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                                >
                                  <Download size={13} /> Attachment
                                </a>
                              ) : (
                                <span className="text-muted-foreground text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
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
