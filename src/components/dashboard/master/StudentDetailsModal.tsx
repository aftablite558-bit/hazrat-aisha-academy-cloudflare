import { GlassModal } from '../../common/GlassModal';
import { GlassBadge } from '../../common/GlassBadge';
import { Student } from '../../../types/master';
import { useMasterData } from '../../../hooks/useMasterData';
import { Class } from '../../../types/master';

export const StudentDetailsModal = ({ isOpen, onClose, student }: { isOpen: boolean; onClose: () => void; student: Student }) => {
  const { data: classes } = useMasterData<Class>('classes');
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Student Details" className="max-w-3xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-48 h-48 rounded-[32px] glass flex items-center justify-center overflow-hidden flex-shrink-0">
          {student.photoUrl ? (
            <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl font-bold text-primary-500 opacity-50">{student.fullName.charAt(0)}</div>
          )}
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{student.fullName}</h2>
            <div className="flex gap-3 items-center">
              <GlassBadge variant="primary">{student.admissionNo}</GlassBadge>
              <GlassBadge variant={student.status === 'Active' ? 'success' : 'default'}>{student.status}</GlassBadge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <DetailItem label="Class" value={classes.find(c => c.id === student.classId)?.className || student.classId} />
            <DetailItem label="Roll No" value={student.rollNo} />
            <DetailItem label="Date of Birth" value={student.dob} />
            <DetailItem label="Gender" value={student.gender} />
            <DetailItem label="Father's Name" value={student.fatherName} />
            <DetailItem label="Mother's Name" value={student.motherName} />
            <DetailItem label="Phone" value={student.phone} />
            <DetailItem label="Admission Date" value={student.admissionDate} />
          </div>
          
          <div className="pt-4 border-t border-white/20">
            <DetailItem label="Address" value={student.address} />
          </div>
        </div>
      </div>
    </GlassModal>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground mb-1 font-medium">{label}</p>
    <p className="text-foreground font-semibold">{value}</p>
  </div>
);
