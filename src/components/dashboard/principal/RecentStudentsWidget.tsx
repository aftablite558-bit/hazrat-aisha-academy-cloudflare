import React from 'react';
import { GlassCard } from '../../common/GlassCard';
import { GlassTable } from '../../common/GlassTable';
import { GlassBadge } from '../../common/GlassBadge';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types/master';
import { Users, ArrowRight, User } from 'lucide-react';

interface RecentStudentsWidgetProps {
  students: Student[];
}

export const RecentStudentsWidget: React.FC<RecentStudentsWidgetProps> = ({ students }) => {
  const navigate = useNavigate();

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-500/10 text-primary-500 rounded-lg">
            <Users size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Recent Admitted Students</h2>
            <p className="text-xs text-muted-foreground">Latest enrolled students across all classes</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/dashboard/students')}
          className="text-xs text-primary-500 hover:underline flex items-center gap-1 font-semibold"
        >
          View All Students <ArrowRight size={14} />
        </button>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Student</th>
            <th>Admission No</th>
            <th>Class</th>
            <th>Gender</th>
            <th>Admission Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-muted-foreground">
                No recent student records found.
              </td>
            </tr>
          ) : (
            students.slice(0, 6).map((std) => (
              <tr key={std.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/students')}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden border border-white/20 flex items-center justify-center text-primary-500 font-bold shrink-0">
                      {std.photoUrl ? (
                        <img src={std.photoUrl} alt={std.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{std.fullName}</div>
                      <div className="text-xs text-muted-foreground">{std.fatherName ? `Father: ${std.fatherName}` : std.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="font-mono text-xs font-bold text-primary-500">{std.admissionNo}</td>
                <td className="font-medium text-sm">{std.classId || 'N/A'}</td>
                <td className="text-sm">{std.gender || 'N/A'}</td>
                <td className="text-xs text-muted-foreground">{std.admissionDate || std.createdAt?.split('T')[0] || 'N/A'}</td>
                <td>
                  <GlassBadge variant={std.status === 'Active' ? 'success' : 'warning'}>
                    {std.status || 'Active'}
                  </GlassBadge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>
    </GlassCard>
  );
};
