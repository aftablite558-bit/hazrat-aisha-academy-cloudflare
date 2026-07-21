import React, { useState } from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassBadge } from '../../components/common/GlassBadge';
import { SkeletonCard, SkeletonTable } from '../../components/common/SkeletonLoader';
import { AnimatedSection } from '../../components/common/AnimatedSection';
import { useMasterData } from '../../hooks/useMasterData';
import { Student, Class } from '../../types/master';
import { AttendanceRecord } from '../../types/academic';
import { 
  Search, UserCheck, Calendar as CalendarIcon, UserX, Clock, 
  UserMinus, Printer, CheckCircle2, AlertCircle, FileText, 
  Filter, Sparkles, User, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PublicAttendance = () => {
  const { data: students } = useMasterData<Student>('students');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: attendanceRecords } = useMasterData<AttendanceRecord>('attendance');

  const [studentName, setStudentName] = useState('');
  const [classId, setClassId] = useState('');
  const [rollNo, setRollNo] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');

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
        const records = attendanceRecords.filter(r => r.classId === classId);
        
        let present = 0, absent = 0, late = 0, leave = 0, total = 0;
        const history: any[] = [];
        
        records.forEach(day => {
          if (day.records) {
            const sr = day.records.find((r: any) => r.studentId === student.id);
            if (sr) {
              total++;
              if (sr.status === 'Present') present++;
              else if (sr.status === 'Absent') absent++;
              else if (sr.status === 'Late') late++;
              else if (sr.status === 'Leave') leave++;
              
              history.push({
                date: day.date,
                status: sr.status,
                remarks: sr.remarks
              });
            }
          }
        });
        
        history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setSearchResult({
          student,
          stats: { present, absent, late, leave, total },
          history
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

  const handlePrint = () => {
    window.print();
  };

  // Filtered history
  const filteredHistory = searchResult?.history?.filter((h: any) => {
    if (statusFilter === 'All') return true;
    return h.status === statusFilter;
  }) || [];

  return (
    <PublicLayout>
      <div className="print:hidden">
        <PageHeader 
          title="Student Attendance Portal" 
          description="Check daily attendance records, working days summary, and monthly attendance percentages for Hazrat Aisha Academy students." 
        />
      </div>

      <main className="py-12 px-6 max-w-7xl mx-auto min-h-screen relative z-10 print:p-0 print:m-0">
        
        {/* Search Card Section */}
        <div className="max-w-3xl mx-auto mb-12 print:hidden">
          <GlassCard className="p-8 sm:p-10 border-emerald-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <UserCheck size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Academic Directory
                </span>
                <h2 className="text-xl font-black text-foreground mt-1">Look Up Student Attendance</h2>
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
                  <span>Ensure Student Name, Class, and Roll Number match school records.</span>
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
                    <span>Check Attendance</span>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} className="h-28" />
                ))}
              </div>
              <SkeletonTable rows={5} cols={4} />
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
                  <CalendarIcon size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Search Student Attendance Records</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Parents and students can track attendance history, absent counts, and working day percentages by filling in the details above.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Real-time records updated daily by class teachers</span>
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
                  <UserX size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-foreground">Student Record Not Found</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No matching student record found for <span className="font-bold text-foreground">{studentName}</span> in Class ID <span className="font-bold text-foreground">{classId}</span> with Roll No <span className="font-bold text-foreground">{rollNo}</span>.
                </p>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <p className="font-bold">Troubleshooting Tips:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Double-check student full name spelling</li>
                    <li>Verify correct class selected</li>
                    <li>Ensure roll number matches official ID card</li>
                  </ul>
                </div>
                <GlassButton onClick={resetForm} variant="outline" className="text-xs font-bold border-rose-500/30 text-rose-600 dark:text-rose-400">
                  Try Again
                </GlassButton>
              </GlassCard>
            </motion.div>
          ) : (
            /* Search Results View */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              {/* Top Banner Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Official Attendance Statement
                  </span>
                  <h2 className="text-2xl font-black text-foreground mt-1">
                    {searchResult.student.fullName}
                  </h2>
                </div>

                <GlassButton onClick={handlePrint} variant="primary" className="px-6 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex items-center gap-2">
                  <Printer size={16} />
                  <span>Print / Download Report</span>
                </GlassButton>
              </div>

              {/* Student Profile & Attendance Percentage Card */}
              <GlassCard className="p-8 border-emerald-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-emerald-950/80 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-emerald-500/30 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                      {searchResult.student.photoUrl ? (
                        <img src={searchResult.student.photoUrl} alt={searchResult.student.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User size={36} className="text-emerald-400" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-white">{searchResult.student.fullName}</h2>
                        <GlassBadge variant="success" className="text-[10px] uppercase font-extrabold">Active</GlassBadge>
                      </div>
                      <p className="text-xs text-slate-300 font-semibold">
                        Class: <span className="text-emerald-400">{getClassName(searchResult.student.classId)}</span> | Roll No: <span className="text-amber-300">{searchResult.student.rollNo}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Admission No: {searchResult.student.admissionNo || 'N/A'} | Guardian: {searchResult.student.fatherName || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Percentage Gauge */}
                  {searchResult.stats.total > 0 && (
                    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[160px] text-center">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 mb-1">Attendance Score</p>
                      <div className="text-4xl font-black text-emerald-400">
                        {Math.round((searchResult.stats.present / searchResult.stats.total) * 100)}%
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 mt-1">
                        {Math.round((searchResult.stats.present / searchResult.stats.total) * 100) >= 85 ? 'Excellent' : 'Needs Improvement'}
                      </span>
                    </div>
                  )}

                </div>
              </GlassCard>

              {/* 5 Stats Cards Grid */}
              {searchResult.stats.total === 0 ? (
                <GlassCard className="p-8 text-center text-muted-foreground">
                  <AlertCircle size={24} className="mx-auto mb-2 text-amber-500" />
                  <p className="text-sm font-semibold">No attendance sessions logged for this class yet.</p>
                </GlassCard>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <GlassCard className="p-5 text-center border-slate-200 dark:border-slate-800">
                      <CalendarIcon size={24} className="mx-auto mb-2 text-emerald-500" />
                      <div className="text-2xl font-black text-foreground">{searchResult.stats.total}</div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Working Days</div>
                    </GlassCard>

                    <GlassCard className="p-5 text-center border-emerald-500/30 bg-emerald-500/5">
                      <UserCheck size={24} className="mx-auto mb-2 text-emerald-500" />
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{searchResult.stats.present}</div>
                      <div className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider mt-1">Present</div>
                    </GlassCard>

                    <GlassCard className="p-5 text-center border-rose-500/30 bg-rose-500/5">
                      <UserX size={24} className="mx-auto mb-2 text-rose-500" />
                      <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{searchResult.stats.absent}</div>
                      <div className="text-xs font-bold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-wider mt-1">Absent</div>
                    </GlassCard>

                    <GlassCard className="p-5 text-center border-amber-500/30 bg-amber-500/5">
                      <Clock size={24} className="mx-auto mb-2 text-amber-500" />
                      <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{searchResult.stats.late}</div>
                      <div className="text-xs font-bold text-amber-600/80 dark:text-amber-400/80 uppercase tracking-wider mt-1">Late</div>
                    </GlassCard>

                    <GlassCard className="p-5 text-center border-purple-500/30 bg-purple-500/5">
                      <UserMinus size={24} className="mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{searchResult.stats.leave}</div>
                      <div className="text-xs font-bold text-purple-600/80 dark:text-purple-400/80 uppercase tracking-wider mt-1">Leave</div>
                    </GlassCard>
                  </div>

                  {/* Attendance History Table Card */}
                  <GlassCard className="p-6 sm:p-8 border-emerald-500/20 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-black text-foreground">Detailed Attendance Log</h3>
                        <p className="text-xs text-muted-foreground">Showing recorded attendance dates in reverse chronological order</p>
                      </div>

                      {/* Status Filter Tabs */}
                      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold print:hidden">
                        {['All', 'Present', 'Absent', 'Late', 'Leave'].map(st => (
                          <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              statusFilter === st 
                                ? 'bg-emerald-600 text-white shadow-sm font-bold' 
                                : 'text-slate-600 dark:text-slate-400 hover:text-foreground'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold">
                            <th className="p-4">Date</th>
                            <th className="p-4">Day</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Remarks / Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                          {filteredHistory.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-muted-foreground font-semibold">
                                No attendance records match the selected status filter.
                              </td>
                            </tr>
                          ) : (
                            filteredHistory.map((record: any, idx: number) => {
                              const d = new Date(record.date);
                              const dayName = d.toLocaleDateString('default', { weekday: 'long' });
                              const formattedDate = d.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });

                              return (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                  <td className="p-4 font-bold text-foreground">{formattedDate}</td>
                                  <td className="p-4 text-muted-foreground font-semibold">{dayName}</td>
                                  <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold ${
                                      record.status === 'Present' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                                      record.status === 'Absent' ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30' :
                                      record.status === 'Late' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                                      'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                                    }`}>
                                      {record.status === 'Present' && <CheckCircle2 size={12} />}
                                      {record.status === 'Absent' && <UserX size={12} />}
                                      {record.status === 'Late' && <Clock size={12} />}
                                      {record.status === 'Leave' && <UserMinus size={12} />}
                                      {record.status}
                                    </span>
                                  </td>
                                  <td className="p-4 text-muted-foreground font-medium">
                                    {record.remarks || '—'}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 flex justify-between items-center">
                      <span>Hazrat Aisha Academy • Sitamarhi, Bihar</span>
                      <span>Total Entries: {filteredHistory.length}</span>
                    </div>
                  </GlassCard>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </PublicLayout>
  );
};
