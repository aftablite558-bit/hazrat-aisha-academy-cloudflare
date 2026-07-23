import { useState, useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassButton } from '../../components/common/GlassButton';
import { useMasterData } from '../../hooks/useMasterData';
import { Student, Class } from '../../types/master';
import { Attendance } from '../../types/academic';
import { Search, UserCheck, Calendar as CalendarIcon, UserX, Clock, UserMinus } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicAttendance = () => {
  const { data: students } = useMasterData<Student>('students');
  const { data: classes } = useMasterData<Class>('classes');
  // Assuming attendance is stored as 'attendance'
  const { data: attendanceRecords } = useMasterData<AttendanceRecord>('attendance');

  const [studentName, setStudentName] = useState('');
  const [classId, setClassId] = useState('');
  const [rollNo, setRollNo] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

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
        // Calculate attendance stats
        const records = attendanceRecords.filter(r => r.classId === classId);
        
        let present = 0, absent = 0, late = 0, leave = 0, total = 0;
        const history: any[] = [];
        
        // This is a naive calculation based on the expected structure.
        // Adapt based on how attendance is actually structured in your app.
        // Assuming AttendanceRecord has date and records array: { studentId, status }
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

  const getClassName = (id: string) => classes.find(c => c.id === id)?.className || 'Unknown';

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
            Student <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Attendance</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your details below to check your attendance records.
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
                <Search size={20} /> Check Attendance
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
            className="max-w-4xl mx-auto"
          >
            {!searchResult ? (
              <GlassCard className="p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Student record not found.</h3>
                <p className="text-muted-foreground">
                  Please check the details and try again. Ensure Name, Class, and Roll Number match exactly.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-6">
                <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border-b-4 border-b-secondary-500">
                  <div className="text-center md:text-left flex-grow">
                    <h2 className="text-2xl font-bold text-foreground mb-1">{searchResult.student.fullName}</h2>
                    <p className="text-muted-foreground mb-4">
                      Class: {getClassName(searchResult.student.classId)} | Roll No: {searchResult.student.rollNo}
                    </p>
                  </div>
                  
                  {searchResult.stats.total > 0 && (
                    <div className="flex-shrink-0 text-center glass p-4 rounded-2xl border-2 border-primary-500/20">
                      <div className="text-4xl font-black text-primary-500">
                        {Math.round((searchResult.stats.present / searchResult.stats.total) * 100)}%
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Attendance</div>
                    </div>
                  )}
                </GlassCard>

                {searchResult.stats.total === 0 ? (
                  <GlassCard className="p-8 text-center text-muted-foreground">
                    No attendance records found for this student.
                  </GlassCard>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <GlassCard className="p-4 text-center">
                        <CalendarIcon size={24} className="mx-auto mb-2 text-primary-500" />
                        <div className="text-2xl font-bold">{searchResult.stats.total}</div>
                        <div className="text-xs text-muted-foreground">Working Days</div>
                      </GlassCard>
                      <GlassCard className="p-4 text-center">
                        <UserCheck size={24} className="mx-auto mb-2 text-emerald-500" />
                        <div className="text-2xl font-bold text-emerald-500">{searchResult.stats.present}</div>
                        <div className="text-xs text-emerald-500/70">Present</div>
                      </GlassCard>
                      <GlassCard className="p-4 text-center">
                        <UserX size={24} className="mx-auto mb-2 text-rose-500" />
                        <div className="text-2xl font-bold text-rose-500">{searchResult.stats.absent}</div>
                        <div className="text-xs text-rose-500/70">Absent</div>
                      </GlassCard>
                      <GlassCard className="p-4 text-center">
                        <Clock size={24} className="mx-auto mb-2 text-amber-500" />
                        <div className="text-2xl font-bold text-amber-500">{searchResult.stats.late}</div>
                        <div className="text-xs text-amber-500/70">Late</div>
                      </GlassCard>
                      <GlassCard className="p-4 text-center">
                        <UserMinus size={24} className="mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold text-purple-500">{searchResult.stats.leave}</div>
                        <div className="text-xs text-purple-500/70">Leave</div>
                      </GlassCard>
                    </div>

                    <GlassCard className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-4">Attendance History</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="pb-3 font-semibold text-muted-foreground">Date</th>
                              <th className="pb-3 font-semibold text-muted-foreground">Status</th>
                              <th className="pb-3 font-semibold text-muted-foreground">Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchResult.history.map((record: any, idx: number) => (
                              <tr key={idx} className="border-b border-white/5 last:border-0">
                                <td className="py-3">{new Date(record.date).toLocaleDateString()}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    record.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500' :
                                    record.status === 'Absent' ? 'bg-rose-500/10 text-rose-500' :
                                    record.status === 'Late' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-purple-500/10 text-purple-500'
                                  }`}>
                                    {record.status}
                                  </span>
                                </td>
                                <td className="py-3 text-muted-foreground">{record.remarks || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </GlassCard>
                  </>
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
