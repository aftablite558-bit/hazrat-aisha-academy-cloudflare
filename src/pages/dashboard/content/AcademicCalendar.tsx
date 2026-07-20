import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { GlassTextarea } from '../../../components/common/GlassTextarea';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { CalendarEvent } from '../../../types/content';
import { Edit, Trash2, Plus, Search, CheckCircle, XCircle, Calendar as CalIcon } from 'lucide-react';

export const AcademicCalendar = () => {
  const { data: events, loading, addRecord, updateRecord, deleteRecord } = useMasterData<CalendarEvent>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '', date: '', category: 'Event', description: '', isHoliday: false, isExamination: false, isPublished: false
  });

  const filteredEvents = useMemo(() => {
    return events.filter(e => (e.title || "").toLowerCase().includes(searchTerm.toLowerCase()));
  }, [events, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedEvent(null);
    setFormData({ title: '', date: '', category: 'Event', description: '', isHoliday: false, isExamination: false, isPublished: false });
    setIsFormOpen(true);
  };

  const handleEdit = (e: CalendarEvent) => {
    setSelectedEvent(e);
    setFormData(e);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEvent?.id) {
      await updateRecord(selectedEvent.id, formData);
    } else {
      await addRecord(formData as any);
    }
    setIsFormOpen(false);
  };

  const togglePublish = async (ev: CalendarEvent) => {
    await updateRecord(ev.id, { isPublished: !ev.isPublished });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Calendar" description="Manage school events, holidays, and exams." />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput placeholder="Search by title..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Event
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Event Title</th>
            <th>Date</th>
            <th>Type</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No events found.</td></tr>
          ) : (
            paginatedData.map(ev => (
              <tr key={ev.id}>
                <td className="font-semibold text-primary-500 flex items-center gap-2">
                  <CalIcon size={16} /> {ev.title}
                </td>
                <td>{ev.date}</td>
                <td>
                  {ev.isHoliday && <GlassBadge variant="danger" className="mr-2">Holiday</GlassBadge>}
                  {ev.isExamination && <GlassBadge variant="warning">Exam</GlassBadge>}
                  {!ev.isHoliday && !ev.isExamination && <GlassBadge variant="default">Event</GlassBadge>}
                </td>
                <td>
                  <GlassBadge variant={ev.isPublished ? 'success' : 'default'}>
                    {ev.isPublished ? 'Published' : 'Draft'}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-secondary-500" onClick={() => togglePublish(ev)}>
                      {ev.isPublished ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500" onClick={() => handleEdit(ev)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500" onClick={() => { setSelectedEvent(ev); setIsDeleteOpen(true); }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <GlassModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedEvent ? "Edit Event" : "Add Event"} className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassInput required label="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <GlassInput required type="date" label="Date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          </div>
          <GlassTextarea label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isHoliday" checked={formData.isHoliday} onChange={e => setFormData({...formData, isHoliday: e.target.checked})} className="w-4 h-4 rounded" />
              <label htmlFor="isHoliday">Is Holiday</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isExamination" checked={formData.isExamination} onChange={e => setFormData({...formData, isExamination: e.target.checked})} className="w-4 h-4 rounded" />
              <label htmlFor="isExamination">Is Examination</label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-4 h-4 rounded" />
            <label htmlFor="isPublished">Publish immediately</label>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <GlassButton type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</GlassButton>
            <GlassButton type="submit" variant="primary">Save</GlassButton>
          </div>
        </form>
      </GlassModal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (selectedEvent?.id) { await deleteRecord(selectedEvent.id); setIsDeleteOpen(false); } }} title="Delete Event" message="Are you sure?" confirmText="Delete" />
    </div>
  );
};
