import { GlassModal } from '../../common/GlassModal';
import { GlassBadge } from '../../common/GlassBadge';
import { Teacher } from '../../../types/master';

export const TeacherDetailsModal = ({ isOpen, onClose, teacher }: { isOpen: boolean; onClose: () => void; teacher: Teacher }) => {
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Teacher Details" className="max-w-3xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-48 h-48 rounded-[32px] glass flex items-center justify-center overflow-hidden flex-shrink-0">
          {teacher.photoUrl ? (
            <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl font-bold text-primary-500 opacity-50">{teacher.name.charAt(0)}</div>
          )}
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{teacher.name}</h2>
            <div className="flex gap-3 items-center">
              <GlassBadge variant="primary">{teacher.teacherId}</GlassBadge>
              <GlassBadge variant={teacher.status === 'Active' ? 'success' : 'default'}>{teacher.status}</GlassBadge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <DetailItem label="Qualification" value={teacher.qualification} />
            <DetailItem label="Email" value={teacher.email} />
            <DetailItem label="Phone" value={teacher.phone} />
            <DetailItem label="Joining Date" value={teacher.joiningDate} />
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
