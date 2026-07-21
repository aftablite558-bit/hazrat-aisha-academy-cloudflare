import { useState, useMemo } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassSelect } from '../../components/common/GlassSelect';
import { useMasterData } from '../../hooks/useMasterData';
import { Homework } from '../../types/academic';
import { Class, Subject, Teacher } from '../../types/master';
import { FileText, Calendar, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';

export const PublicHomework = () => {
  const { data: homeworks } = useMasterData<Homework>('homework');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { data: teachers } = useMasterData<Teacher>('teachers');

  const [classId, setClassId] = useState('');

  const publishedHomework = useMemo(() => {
    return homeworks.filter(hw => hw.isPublished);
  }, [homeworks]);

  const filteredHomework = useMemo(() => {
    return publishedHomework.filter(hw => {
      const matchClass = classId ? hw.classId === classId : true;
      return matchClass;
    }).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [publishedHomework, classId]);

  const getClassName = (id: string) => classes.find(c => c.id === id)?.className || 'Unknown';
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.subjectName || 'Unknown';
  const getTeacherName = (id: string) => teachers.find(t => t.id === id)?.name || 'Unknown';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 selection:bg-primary-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Student <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Homework</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            View daily assignments and classwork across all grades.
          </p>
        </motion.div>

        <GlassCard className="p-6 mb-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
          <GlassSelect 
            label="Filter by Class" 
            value={classId} 
            onChange={e => { setClassId(e.target.value) }}
            options={classes.map(c => ({ label: c.className, value: c.id }))}
          />
          <GlassSelect 
            label="Filter by Section" 
          />
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredHomework.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              No homework assigned for the selected criteria.
            </div>
          ) : (
            filteredHomework.map((hw, idx) => (
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
                    <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
                      {getClassName(hw.classId)}
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
                    <div className="flex items-center justify-between mt-2 pt-2">
                      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                        <User size={14} />
                        {getTeacherName(hw.teacherId)}
                      </div>
                      {hw.attachmentUrl && (
                        <a 
                          href={hw.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-400 transition-colors"
                        >
                          <FileText size={14} /> Attachment
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
