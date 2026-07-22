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
import { StudentResult } from '../../types/academic';
import { Class, Subject, Student } from '../../types/master';
import { 
  Search, Download, GraduationCap, Award, Printer, User, 
  CheckCircle2, AlertCircle, Sparkles, RefreshCw, FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PublicResults = () => {
  const { data: results } = useMasterData<StudentResult>('results');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { data: students } = useMasterData<Student>('students');

  const [studentName, setStudentName] = useState('');
  const [classId, setClassId] = useState('');
  const [rollNo, setRollNo] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const publishedResults = useMemo(() => {
    return results.filter(r => r.isPublished);
  }, [results]);

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
        const studentResults = publishedResults.filter(r => r.studentId === student.id);
        setSearchResult({
          student,
          results: studentResults
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
          title="Examination Results & Report Cards" 
          description="Check published exam marks, subject grades, cumulative performance, and print official report cards for Hazrat Aisha Academy students." 
        />
      </div>

      <main className="py-12 px-6 max-w-7xl mx-auto min-h-screen relative z-10 print:p-0 print:m-0">
        
        {/* Search Card Section */}
        <div className="max-w-3xl mx-auto mb-12 print:hidden">
          <GlassCard className="p-8 sm:p-10 border-emerald-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <GraduationCap size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Results Portal
                </span>
                <h2 className="text-xl font-black text-foreground mt-1">Look Up Student Report Card</h2>
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
                  <span>Enter student credentials to fetch published examination marks.</span>
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
                    <span>Check Result</span>
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
              <SkeletonTable rows={6} cols={5} />
            </motion.div>
          ) : !hasSearched ? (
            /* Initial Guide Empty State */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <GlassCard className="p-10 border-slate-200/60 dark:border-slate-800/60 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto">
                  <Award size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Search Examination Results</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Enter student details above to view published report cards, subject scores, total percentage, grades, and print official report card sheets.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Official CBSE Aligned Examination Results</span>
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
            /* Results View */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {searchResult.results.length === 0 ? (
                <GlassCard className="p-12 text-center text-muted-foreground border-emerald-500/20">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Results Awaited</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    No published exam results are available for <span className="font-bold text-foreground">{searchResult.student.fullName}</span> at this time. Please check back later or contact school administration.
                  </p>
                </GlassCard>
              ) : (
                <>
                  {/* Action Print Button Bar */}
                  <div className="flex justify-end print:hidden">
                    <GlassButton onClick={handlePrint} variant="primary" className="px-6 py-3 text-xs font-extrabold rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-950/20 hover:scale-105 transition-all flex items-center gap-2">
                      <Printer size={18} />
                      <span>Print Official Report Card / Download PDF</span>
                    </GlassButton>
                  </div>

                  {/* Official Report Card View */}
                  {searchResult.results.map((res: any, idx: number) => (
                    <div key={res.id || idx} className="bg-white text-slate-900 shadow-2xl rounded-3xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:rounded-none print:m-0 print:p-0">
                      
                      {/* School Header Banner */}
                      <div className="p-8 sm:p-10 border-b border-slate-200 text-center relative bg-slate-900 text-white overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-60 h-60 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 p-2 shadow-inner">
                            <img src="/logo.png" alt="Hazrat Aisha Academy" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                            <GraduationCap size={40} className="text-emerald-400 hidden" />
                          </div>

                          <div className="flex-grow text-center space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white">Hazrat Aisha Academy</h1>
                            <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300">CBSE Aligned Modern & Islamic Education</p>
                            <p className="text-[11px] text-slate-300">Chak Rajopatti, Sitamarhi, Bihar – 843302</p>
                            <div className="inline-block px-5 py-1.5 bg-emerald-600 text-white font-extrabold text-xs rounded-full mt-3 uppercase tracking-widest shadow-md">
                              {res.examName || 'Annual Examination'} Report Card
                            </div>
                          </div>

                          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-500/40 shadow-lg bg-slate-800 flex items-center justify-center">
                            {searchResult.student.photoUrl ? (
                              <img src={searchResult.student.photoUrl} alt={searchResult.student.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <User size={36} className="text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Student Information Bar */}
                      <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 text-xs">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                          <div>
                            <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Student Name</span>
                            <span className="font-extrabold text-sm text-slate-900">{searchResult.student.fullName}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Father's Name</span>
                            <span className="font-bold text-slate-900">{searchResult.student.fatherName || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Class & Section</span>
                            <span className="font-bold text-slate-900">{getClassName(searchResult.student.classId)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Roll Number</span>
                            <span className="font-bold text-slate-900">{searchResult.student.rollNo}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Admission No</span>
                            <span className="font-bold text-slate-900">{searchResult.student.admissionNo || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider mb-0.5">Academic Session</span>
                            <span className="font-bold text-slate-900">2026 – 2027</span>
                          </div>
                        </div>
                      </div>

                      {/* Subject Marks Table */}
                      <div className="p-6 sm:p-8">
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-extrabold">
                                <th className="p-3.5 border-r border-slate-200">Subject Name</th>
                                <th className="p-3.5 text-center border-r border-slate-200 w-24">Max Marks</th>
                                <th className="p-3.5 text-center border-r border-slate-200 w-28">Obtained</th>
                                <th className="p-3.5 text-center border-r border-slate-200 w-24">Grade</th>
                                <th className="p-3.5 text-center w-32">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {res.subjects && res.subjects.map((sub: any, sIdx: number) => (
                                <tr key={sIdx} className="hover:bg-slate-50 transition-colors">
                                  <td className="p-3.5 font-bold text-slate-900 border-r border-slate-200">
                                    {getSubjectName(sub.subjectId)}
                                  </td>
                                  <td className="p-3.5 text-center text-slate-700 border-r border-slate-200 font-semibold">
                                    {sub.maxMarks || 100}
                                  </td>
                                  <td className="p-3.5 text-center font-extrabold text-slate-900 border-r border-slate-200">
                                    {sub.obtainedMarks}
                                  </td>
                                  <td className="p-3.5 text-center font-extrabold text-slate-900 border-r border-slate-200">
                                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                                      {sub.grade || 'A'}
                                    </span>
                                  </td>
                                  <td className="p-3.5 text-center text-[11px] text-slate-600 font-medium">
                                    {sub.remarks || 'Satisfactory'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Performance Summary KPI Bar */}
                      <div className="px-6 sm:px-8 pb-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                          <div className="text-center">
                            <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Total Marks</span>
                            <span className="text-2xl font-black">{res.obtainedMarks} <span className="text-slate-400 text-xs font-normal">/ {res.totalMarks}</span></span>
                          </div>
                          <div className="text-center border-l border-white/10">
                            <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Percentage</span>
                            <span className="text-2xl font-black text-emerald-400">{res.percentage ? res.percentage.toFixed(1) : 0}%</span>
                          </div>
                          <div className="text-center border-l border-white/10">
                            <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Grade</span>
                            <span className="text-2xl font-black text-amber-300">{res.grade || 'A'}</span>
                          </div>
                          <div className="text-center border-l border-white/10">
                            <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Class Rank</span>
                            <span className="text-2xl font-black text-white">{res.rank || '—'}</span>
                          </div>
                          <div className="text-center border-l border-white/10">
                            <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Result</span>
                            <span className={`text-2xl font-black ${res.status === 'Pass' || !res.status ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {res.status || 'PASS'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Printable Signatures Section */}
                      <div className="p-8 pt-12 flex justify-between items-end border-t border-slate-200 text-xs">
                        <div className="text-center w-36">
                          <div className="border-b-2 border-slate-400 mb-2"></div>
                          <p className="font-extrabold text-slate-700 uppercase">Class Teacher</p>
                        </div>
                        <div className="text-center w-36">
                          <div className="border-b-2 border-slate-400 mb-2"></div>
                          <p className="font-extrabold text-slate-700 uppercase">Principal</p>
                        </div>
                        <div className="text-center w-36">
                          <div className="border-b-2 border-slate-400 mb-2"></div>
                          <p className="font-extrabold text-slate-700 uppercase">Parent Signature</p>
                        </div>
                      </div>

                      {/* Footer Disclaimer */}
                      <div className="bg-slate-100 py-3 text-center text-[11px] font-semibold text-slate-500 border-t border-slate-200">
                        Hazrat Aisha Academy, Chak Rajopatti, Sitamarhi • Official Computer Generated Report Card
                      </div>

                    </div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </PublicLayout>
  );
};
