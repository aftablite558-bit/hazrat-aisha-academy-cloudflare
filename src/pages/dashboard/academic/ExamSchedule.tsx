import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { BackButton } from '../../../components/common/BackButton';

import { useMasterData } from '../../../hooks/useMasterData';
import { ExamSchedule as ExamScheduleType, Class, Subject } from '../../../types/master';
import { Edit, Trash2, Plus, Search, Calendar as CalendarIcon, Clock } from 'lucide-react';

export const ExamSchedule = () => {
  const { data: schedules, loading, addRecord, updateRecord, deleteRecord } = useMasterData<ExamScheduleType>('exam_schedules');
  const { data: classes } = useMasterData<Class>('classes');
  const { data: subjects } = useMasterData<Subject>('subjects');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ExamScheduleType | null>(null);
  const [formData, setFormData] = useState<Partial<ExamScheduleType>>({
    examName: '', classId: '', subjectId: '', examDate: '', startTime: '', endTime: '', roomNumber: '', totalMarks: 100, status: 'Scheduled'
  });

  const filteredData = useMemo(() => {
    return schedules.filter(s => {
      const matchSearch = (s.examName || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = filterClass ? s.classId === filterClass : true;
      return matchSearch && matchClass;
    });
  }, [schedules, searchTerm, filterClass]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedSchedule(null);
    setFormData({ examName: '', classId: '', subjectId: '', examDate: '', startTime: '', endTime: '', roomNumber: '', totalMarks: 100, status: 'Scheduled' });
    setIsFormOpen(true);
  };

  const handleEdit = (s: ExamScheduleType) => {
    setSelectedSchedule(s);
    setFormData(s);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSchedule?.id) {
      await updateRecord(selectedSchedule.id, formData);
    } else {
      await addRecord(formData);
    }
    setIsFormOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>
      <PageHeader title="Exam Schedule" description="Manage examination schedules." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <GlassInput placeholder="Search exam name..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
          </div>
          <GlassSelect
            value={filterClass}
            onChange={(e) => { setFilterClass(e.target.value); setCurrentPage(1); }}
            options={[
              { value: '', label: 'All Classes' },
              ...classes.map(c => ({ value: c.id, label: c.className || (c as { name?: string }).name }))
            ]}
          />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Schedule
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Exam Details</th>
            <th>Class & Subject</th>
            <th>Date & Time</th>
            <th>Room</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-8">No schedules found.</td></tr>
          ) : (
            paginatedData.map(s => {
              const cls = classes.find(c => c.id === s.classId);
              const sub = subjects.find(su => su.id === s.subjectId);
              return (
                <tr key={s.id}>
                  <td>
                    <div className="font-medium text-foreground">{s.examName}</div>
                    <div className="text-xs text-muted-foreground">Marks: {s.totalMarks}</div>
                  </td>
                  <td>
                    <div className="font-medium">{cls?.className || s.classId}</div>
                    <div className="text-xs text-muted-foreground">{sub?.subjectName || s.subjectId}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm">
                      <CalendarIcon size={14} className="text-primary-500" />
                      {new Date(s.examDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Clock size={14} className="text-emerald-500" />
                      {s.startTime} - {s.endTime}
                    </div>
                  </td>
                  <td>{s.roomNumber}</td>
                  <td>
                    <GlassBadge variant={getStatusColor(s.status)}>{s.status}</GlassBadge>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(s)}><Edit size={18} /></button>
                      <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedSchedule(s); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedSchedule ? "Edit Schedule" : "Add Schedule"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Exam Name" value={formData.examName} onChange={e => setFormData({...formData, examName: e.target.value})} placeholder="e.g. Mid Term Exam" />
            
            <GlassSelect 
              required 
              label="Class" 
              value={formData.classId} 
              onChange={e => setFormData({...formData, classId: e.target.value})}
              options={[
                { value: '', label: 'Select Class' },
                ...classes.map(c => ({ value: c.id, label: c.className || (c as { name?: string }).name }))
              ]}
            />
            
            <GlassSelect 
              required 
              label="Subject" 
              value={formData.subjectId} 
              onChange={e => setFormData({...formData, subjectId: e.target.value})}
              options={[
                { value: '', label: 'Select Subject' },
                ...subjects.map(s => ({ value: s.id, label: s.subjectName || (s as { name?: string }).name }))
              ]}
            />
            
            <GlassInput required label="Exam Date" type="date" value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} />
            <GlassInput required label="Start Time" type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            <GlassInput required label="End Time" type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            <GlassInput required label="Room Number" value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
            <GlassInput required label="Total Marks" type="number" min="1" value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: parseInt(e.target.value) || 100})} />
            
            <GlassSelect 
              label="Status" 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value as 'Scheduled' | 'Completed' | 'Cancelled'})}
              options={[
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' }
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <GlassButton type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Save</GlassButton>
          </div>
        </form>
      </GlassModal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (selectedSchedule?.id) { await deleteRecord(selectedSchedule.id); setIsDeleteOpen(false); } }} title="Delete Schedule" message="Are you sure you want to delete this schedule?" confirmText="Delete" />
    </div>
  );
};
