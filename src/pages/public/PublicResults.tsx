import { useState, useMemo, useRef } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassSelect } from '../../components/common/GlassSelect';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassButton } from '../../components/common/GlassButton';
import { useMasterData } from '../../hooks/useMasterData';
import { Result } from '../../types/academic';
import { Class, Subject, Student } from '../../types/master';
import { Search, Download, GraduationCap, Award, Printer, User } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicResults = () => {
  const { data: results } = useMasterData<any>('results');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { data: students } = useMasterData<Student>('students');

  const [studentName, setStudentName] = useState('');
  const [classId, setClassId] = useState('');
  const [rollNo, setRollNo] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const publishedResults = useMemo(() => {
    return results.filter(r => r.isPublished);
  }, [results]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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

  const getClassName = (id: string) => classes.find(c => c.id === id)?.className || 'Unknown';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.subjectName || 'Unknown';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen print:pt-0 print:px-0 print:pb-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12 print:hidden"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Exam <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Results</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your details below to check your published exam results.
          </p>
        </motion.div>

        <GlassCard className="p-8 mb-12 max-w-3xl mx-auto border-t-4 border-t-primary-500 print:hidden">
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
                <Search size={20} /> Check Result
              </GlassButton>
            </div>
          </form>
        </GlassCard>

        {hasSearched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {!searchResult ? (
              <GlassCard className="p-12 text-center print:hidden">
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
                {searchResult.results.length === 0 ? (
                  <GlassCard className="p-12 text-center text-muted-foreground print:hidden">
                    No published results available for this student yet.
                  </GlassCard>
                ) : (
                  <>
                    <div className="flex justify-end print:hidden mb-4">
                      <GlassButton variant="primary" className="flex items-center gap-2" onClick={handlePrint}>
                        <Printer size={18} /> Print / Download PDF
                      </GlassButton>
                    </div>

                    {searchResult.results.map((res: any, idx: number) => (
                      <div key={res.id} className="bg-white text-slate-900 shadow-xl rounded-none md:rounded-xl overflow-hidden print:shadow-none print:break-inside-avoid mb-12">
                        {/* Report Card Header */}
                        <div className="p-8 border-b border-slate-200 text-center relative">
                          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                            <GraduationCap size={300} />
                          </div>
                          
                          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                              <img src="/logo.png" alt="School Logo" className="w-16 h-16 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                              <GraduationCap size={40} className="text-slate-400 hidden" />
                            </div>
                            
                            <div className="flex-grow text-center">
                              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Hazrat Aisha Academy</h1>
                              <p className="text-sm font-semibold text-slate-600 mt-1 uppercase tracking-widest">Affiliated to CBSE, New Delhi</p>
                              <p className="text-xs text-slate-500 mt-1">Chak Rajopatti, Sitamarhi, Bihar</p>
                              <div className="inline-block px-4 py-1.5 bg-slate-900 text-white font-bold text-sm rounded-full mt-4 uppercase tracking-widest shadow-md">
                                {res.examName} Report Card
                              </div>
                            </div>
                            
                            <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border-4 border-white shadow-md">
                              {searchResult.student.photoUrl ? (
                                <img src={searchResult.student.photoUrl} alt={searchResult.student.fullName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                  <User size={40} className="text-slate-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Student Details */}
                        <div className="p-8 border-b border-slate-200 bg-slate-50">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
                            <div className="col-span-2">
                              <span className="text-slate-500 block mb-1">Student Name</span>
                              <span className="font-bold text-base text-slate-900">{searchResult.student.fullName}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-500 block mb-1">Father's Name</span>
                              <span className="font-bold text-base text-slate-900">{searchResult.student.fatherName || '-'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-1">Class</span>
                              <span className="font-bold text-slate-900">{getClassName(searchResult.student.classId)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-1">Roll Number</span>
                              <span className="font-bold text-slate-900">{searchResult.student.rollNo}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-1">Admission No</span>
                              <span className="font-bold text-slate-900">{searchResult.student.admissionNo}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-1">Academic Session</span>
                              <span className="font-bold text-slate-900">{new Date().getFullYear()}-{new Date().getFullYear()+1}</span>
                            </div>
                          </div>
                        </div>

                        {/* Marks Table */}
                        <div className="p-8">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-slate-100 border border-slate-200">
                                <th className="py-3 px-4 text-left text-sm font-bold text-slate-900 border-r border-slate-200">Subject</th>
                                <th className="py-3 px-4 text-center text-sm font-bold text-slate-900 border-r border-slate-200 w-24">Max Marks</th>
                                <th className="py-3 px-4 text-center text-sm font-bold text-slate-900 border-r border-slate-200 w-28">Obtained</th>
                                <th className="py-3 px-4 text-center text-sm font-bold text-slate-900 border-r border-slate-200 w-24">Grade</th>
                                <th className="py-3 px-4 text-center text-sm font-bold text-slate-900 w-32">Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {res.subjects && res.subjects.map((sub: any, sIdx: number) => (
                                <tr key={sIdx} className="border-b border-slate-200 border-x">
                                  <td className="py-3 px-4 font-semibold text-slate-900 border-r border-slate-200">{getSubjectName(sub.subjectId)}</td>
                                  <td className="py-3 px-4 text-center text-slate-700 border-r border-slate-200">{sub.maxMarks || 100}</td>
                                  <td className="py-3 px-4 text-center font-bold text-slate-900 border-r border-slate-200">{sub.obtainedMarks}</td>
                                  <td className="py-3 px-4 text-center font-bold text-slate-900 border-r border-slate-200">{sub.grade || '-'}</td>
                                  <td className="py-3 px-4 text-center text-xs text-slate-600">{sub.remarks || 'Good'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary */}
                        <div className="px-8 pb-8">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-slate-900 text-white p-6 rounded-xl shadow-inner">
                            <div className="text-center">
                              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Total Marks</span>
                              <span className="text-2xl font-black">{res.obtainedMarks} <span className="text-slate-500 text-sm font-normal">/ {res.totalMarks}</span></span>
                            </div>
                            <div className="text-center border-l border-white/10">
                              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Percentage</span>
                              <span className="text-2xl font-black">{res.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="text-center border-l border-white/10">
                              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Grade</span>
                              <span className="text-2xl font-black text-amber-400">{res.grade}</span>
                            </div>
                            <div className="text-center border-l border-white/10">
                              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Rank</span>
                              <span className="text-2xl font-black">{res.rank || '-'}</span>
                            </div>
                            <div className="text-center border-l border-white/10">
                              <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Result</span>
                              <span className={`text-2xl font-black ${res.status === 'Pass' ? 'text-emerald-400' : 'text-rose-400'}`}>{res.status}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Signatures */}
                        <div className="p-8 pt-16 flex justify-between items-end border-t border-slate-200">
                          <div className="text-center w-40">
                            <div className="border-b-2 border-slate-400 mb-2"></div>
                            <p className="text-xs font-bold text-slate-600 uppercase">Class Teacher</p>
                          </div>
                          <div className="text-center w-40">
                            <div className="border-b-2 border-slate-400 mb-2"></div>
                            <p className="text-xs font-bold text-slate-600 uppercase">Principal</p>
                          </div>
                          <div className="text-center w-40">
                            <div className="border-b-2 border-slate-400 mb-2"></div>
                            <p className="text-xs font-bold text-slate-600 uppercase">Parent's Signature</p>
                          </div>
                        </div>
                        
                        <div className="bg-slate-100 py-3 text-center text-xs text-slate-500 border-t border-slate-200">
                          This is a computer generated document. No signature is required.
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>
      
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};
