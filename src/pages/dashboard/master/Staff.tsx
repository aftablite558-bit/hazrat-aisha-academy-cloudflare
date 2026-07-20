import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassButton } from '../../../components/common/GlassButton';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { Staff as StaffType } from '../../../types/master';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { StaffFormModal } from '../../../components/dashboard/master/StaffFormModal';

export const Staff = () => {
  const { data: staffList, loading, addRecord, updateRecord, deleteRecord } = useMasterData<StaffType>('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffType | null>(null);

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffList, searchTerm]);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStaff.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStaff, currentPage]);

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handleAdd = () => {
    setSelectedStaff(null);
    setIsFormOpen(true);
  };

  const handleEdit = (staff: StaffType) => {
    setSelectedStaff(staff);
    setIsFormOpen(true);
  };

  const handleDelete = (staff: StaffType) => {
    setSelectedStaff(staff);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStaff?.id) {
      await deleteRecord(selectedStaff.id);
    }
  };

  const handleSubmit = async (data: Omit<StaffType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedStaff?.id) {
      await updateRecord(selectedStaff.id, data);
    } else {
      await addRecord(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" subtitle="Manage non-teaching staff records." />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <GlassInput 
            placeholder="Search by name or employee ID..." 
            className="pl-12"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <GlassButton variant="primary" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={20} /> Add Staff
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={7} className="text-center py-8">No staff found.</td></tr>
          ) : (
            paginatedData.map(staff => (
              <tr key={staff.id}>
                <td className="font-medium text-primary-500">{staff.employeeId}</td>
                <td className="font-semibold">{staff.name}</td>
                <td>{staff.department}</td>
                <td>{staff.role}</td>
                <td>{staff.phone}</td>
                <td>
                  <GlassBadge variant={staff.status === 'Active' ? 'success' : 'default'}>
                    {staff.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full text-emerald-500 transition-colors" onClick={() => handleEdit(staff)}><Edit size={18} /></button>
                    <button className="p-2 hover:bg-white/10 rounded-full text-rose-500 transition-colors" onClick={() => handleDelete(staff)}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      {isFormOpen && (
        <StaffFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedStaff}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Staff"
        message={`Are you sure you want to delete ${selectedStaff?.name}?`}
        confirmText="Delete"
      />
    </div>
  );
};
