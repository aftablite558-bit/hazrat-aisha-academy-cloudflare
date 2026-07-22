import React, { useState, useMemo } from 'react';
import { useCurrentTeacher } from '../../hooks/useCurrentTeacher';
import { useMasterData } from '../../hooks/useMasterData';
import { useToast } from '../../contexts/ToastContext';

import { PageHeader } from '../../components/common/PageHeader';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { GlassTable } from '../../components/common/GlassTable';
import { GlassBadge } from '../../components/common/GlassBadge';
import { GlassModal } from '../../components/common/GlassModal';
import { GlassInput } from '../../components/common/GlassInput';
import { GlassSelect } from '../../components/common/GlassSelect';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import { BackButton } from '../../components/common/BackButton';

import { Homework } from '../../types/academic';
import { Subject } from '../../types/master';

import {
  Plus,
  Edit,
  Trash2,
  FileText,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Calendar,
  BookOpen,
  Send,
  Save,
  Search,
} from 'lucide-react';

export const TeacherHomework: React.FC = () => {
  const { teacher, assignedClasses, assignedSubjects, isLoading } = useCurrentTeacher();
  const { data: homeworks, loading, addRecord, updateRecord, deleteRecord } = useMasterData<Homework>('homework');
  const { data: subjects } = useMasterData<Subject>('subjects');
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    subjectId: '',
    dueDate: '',
    publishDate: new Date().toISOString().split('T')[0],
    attachmentUrl: '',
    attachmentName: '',
    attachmentType: 'pdf' as 'pdf' | 'image' | 'document',
    isPublished: true,
  });

  const assignedClassIds = useMemo(() => assignedClasses.map((c) => c.id), [assignedClasses]);

  // Homework list for assigned classes & teacher
  const teacherHomeworks = useMemo(() => {
    return homeworks.filter(
      (hw) => hw.teacherId === teacher.id || assignedClassIds.includes(hw.classId)
    );
  }, [homeworks, teacher.id, assignedClassIds]);

  // Filtered Homeworks
  const filteredHomeworks = useMemo(() => {
    return teacherHomeworks.filter((hw) => {
      const matchesSearch =
        (hw.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hw.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClass = selectedClassFilter === 'All' || hw.classId === selectedClassFilter;

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Published' && hw.isPublished) ||
        (statusFilter === 'Draft' && !hw.isPublished);

      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [teacherHomeworks, searchTerm, selectedClassFilter, statusFilter]);

  const paginatedHomeworks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHomeworks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHomeworks, currentPage]);

  const totalPages = Math.ceil(filteredHomeworks.length / itemsPerPage);

  const handleOpenAdd = () => {
    setEditingHomework(null);
    setFormData({
      title: '',
      description: '',
      classId: assignedClasses[0]?.id || '',
      subjectId: assignedSubjects[0]?.id || '',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      publishDate: new Date().toISOString().split('T')[0],
      attachmentUrl: '',
      attachmentName: '',
      attachmentType: 'pdf',
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hw: Homework) => {
    setEditingHomework(hw);
    setFormData({
      title: hw.title,
      description: hw.description,
      classId: hw.classId,
      subjectId: hw.subjectId,
      dueDate: hw.dueDate,
      publishDate: hw.publishDate || new Date().toISOString().split('T')[0],
      attachmentUrl: hw.attachmentUrl || '',
      attachmentName: hw.attachmentName || '',
      attachmentType: hw.attachmentType || 'pdf',
      isPublished: hw.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (hw: Homework) => {
    setEditingHomework(hw);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (editingHomework?.id) {
      await deleteRecord(editingHomework.id);
      addToast('Homework deleted successfully', 'success');
      setIsDeleteOpen(false);
    }
  };

  const handleTogglePublish = async (hw: Homework) => {
    await updateRecord(hw.id, { isPublished: !hw.isPublished });
    addToast(
      !hw.isPublished ? 'Homework published for students' : 'Homework moved to drafts',
      'success'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.classId || !formData.subjectId || !formData.dueDate) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        classId: formData.classId,
        subjectId: formData.subjectId,
        teacherId: teacher.id,
        dueDate: formData.dueDate,
        publishDate: formData.publishDate,
        attachmentUrl: formData.attachmentUrl,
        attachmentName: formData.attachmentName,
        attachmentType: formData.attachmentType,
        isPublished: formData.isPublished,
        status: formData.isPublished ? 'Active' : 'Draft',
      };

      if (editingHomework?.id) {
        await updateRecord(editingHomework.id, payload);
        addToast('Homework updated successfully!', 'success');
      } else {
        await addRecord(payload);
        addToast('New homework created successfully!', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      addToast('Failed to save homework', 'error');
    }
  };

  const getClassName = (id: string) =>
    assignedClasses.find((c) => c.id === id)?.className || id;
  const getSubjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.subjectName || id;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Loading Homework Module...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-start mb-[-1.5rem] relative z-20">
        <BackButton />
      </div>

      <PageHeader
        title="Class Homework & Assignments"
        description="Create, schedule, publish, and manage daily homework assignments for your classes."
      />

      {/* Filter & Action Controls */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <GlassInput
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            <GlassSelect
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              options={[
                { label: 'All Assigned Classes', value: 'All' },
                ...assignedClasses.map((c) => ({ label: `Class ${c.className}`, value: c.id })),
              ]}
              className="text-sm"
            />

            <div className="flex items-center gap-1">
              {(['All', 'Published', 'Draft'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'glass text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <GlassButton
            variant="primary"
            className="w-full md:w-auto flex items-center justify-center gap-2 font-bold px-5 py-2.5"
            onClick={handleOpenAdd}
          >
            <Plus size={18} /> Add New Homework
          </GlassButton>
        </div>
      </GlassCard>

      {/* Homework Table */}
      <GlassTable>
        <thead>
          <tr>
            <th>Homework Title</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Attachment</th>
            <th>Due Date</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-8">
                Loading homework records...
              </td>
            </tr>
          ) : paginatedHomeworks.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-muted-foreground">
                No homework assignments found.
              </td>
            </tr>
          ) : (
            paginatedHomeworks.map((hw) => (
              <tr key={hw.id}>
                <td className="font-bold text-foreground">
                  <div className="space-y-0.5">
                    <p className="text-sm text-foreground hover:text-primary-500 transition-colors">
                      {hw.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{hw.description}</p>
                  </div>
                </td>
                <td className="font-semibold text-primary-500">Class {getClassName(hw.classId)}</td>
                <td>{getSubjectName(hw.subjectId)}</td>
                <td>
                  {hw.attachmentUrl ? (
                    <a
                      href={hw.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-500 hover:underline bg-secondary-500/10 px-2.5 py-1 rounded-lg border border-secondary-500/20"
                    >
                      {hw.attachmentType === 'pdf' ? (
                        <FileText size={14} />
                      ) : hw.attachmentType === 'image' ? (
                        <ImageIcon size={14} />
                      ) : (
                        <FileCode size={14} />
                      )}
                      <span>{hw.attachmentName || 'Attachment'}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="font-mono text-xs font-semibold">
                  {new Date(hw.dueDate).toLocaleDateString()}
                </td>
                <td>
                  <GlassBadge variant={hw.isPublished ? 'success' : 'default'}>
                    {hw.isPublished ? 'Published' : 'Draft'}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-1.5">
                    <button
                      className="p-2 hover:bg-white/10 rounded-full text-amber-500 transition-colors"
                      onClick={() => handleTogglePublish(hw)}
                      title={hw.isPublished ? 'Move to Draft' : 'Publish to Students'}
                    >
                      {hw.isPublished ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                    </button>
                    <button
                      className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors"
                      onClick={() => handleOpenEdit(hw)}
                      title="Edit Assignment"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors"
                      onClick={() => handleOpenDelete(hw)}
                      title="Delete Assignment"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* CREATE / EDIT HOMEWORK MODAL */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHomework ? 'Edit Homework Assignment' : 'Create New Homework'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassSelect
              label="Select Assigned Class"
              value={formData.classId}
              onChange={(e) => setFormData((prev) => ({ ...prev, classId: e.target.value }))}
              options={assignedClasses.map((c) => ({
                label: `Class ${c.className}`,
                value: c.id,
              }))}
              required
            />

            <GlassSelect
              label="Select Subject"
              value={formData.subjectId}
              onChange={(e) => setFormData((prev) => ({ ...prev, subjectId: e.target.value }))}
              options={assignedSubjects.map((s) => ({
                label: s.subjectName,
                value: s.id,
              }))}
              required
            />

            <GlassInput
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
            />

            <GlassInput
              label="Publish / Schedule Date"
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, publishDate: e.target.value }))}
            />
          </div>

          <GlassInput
            label="Homework Title"
            placeholder="e.g. Solve Chapter 3 Exercises on Page 45"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Detailed Instructions</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide complete instructions, questions, or guidance for students..."
              rows={4}
              className="w-full p-3.5 rounded-lg glass bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              required
            />
          </div>

          {/* Attachments Section */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <label className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText size={16} className="text-secondary-500" /> Attach Document / File Reference
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <GlassSelect
                label="FileType"
                value={formData.attachmentType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    attachmentType: e.target.value as 'pdf' | 'image' | 'document',
                  }))
                }
                options={[
                  { label: 'PDF Document (.pdf)', value: 'pdf' },
                  { label: 'Image Reference (.png, .jpg)', value: 'image' },
                  { label: 'Word / Doc File', value: 'document' },
                ]}
              />

              <GlassInput
                label="Attachment Title"
                placeholder="e.g. WorkSheet_Ch3.pdf"
                value={formData.attachmentName}
                onChange={(e) => setFormData((prev) => ({ ...prev, attachmentName: e.target.value }))}
              />

              <GlassInput
                label="File URL / Link"
                placeholder="https://..."
                value={formData.attachmentUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, attachmentUrl: e.target.value }))}
              />
            </div>
          </div>

          {/* Draft vs Publish Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-sm font-bold text-foreground">Publish Immediately</p>
              <p className="text-xs text-muted-foreground">
                If enabled, students can instantly view this homework assignment.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                formData.isPublished ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.isPublished ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <GlassButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" className="font-bold px-6">
              {editingHomework ? 'Update Assignment' : 'Save & Assign Homework'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Homework"
        message={`Are you sure you want to delete "${editingHomework?.title}"?`}
        confirmText="Delete Assignment"
      />
    </div>
  );
};
