import { useState, useMemo } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassInput } from '../../../components/common/GlassInput';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { Pagination } from '../../../components/common/Pagination';
import { useMasterData } from '../../../hooks/useMasterData';
import { AuditLog } from '../../../types/enterprise';
import { Search, ShieldAlert, LogIn, LogOut, Edit, Trash2, Plus, CheckCircle } from 'lucide-react';

export const AuditLogs = () => {
  const { data: logs, loading } = useMasterData<AuditLog>('audit_logs');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return logs.filter(l => 
      (l.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (l.module || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.details || "").toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [logs, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Login': return <LogIn size={16} className="text-emerald-500" />;
      case 'Logout': return <LogOut size={16} className="text-amber-500" />;
      case 'Create': return <Plus size={16} className="text-primary-500" />;
      case 'Edit': return <Edit size={16} className="text-secondary-500" />;
      case 'Delete': return <Trash2 size={16} className="text-rose-500" />;
      case 'Publish': return <CheckCircle size={16} className="text-emerald-500" />;
      default: return <ShieldAlert size={16} className="text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string): 'success' | 'warning' | 'danger' | 'default' | 'primary' => {
    switch (action) {
      case 'Login': case 'Publish': return 'success';
      case 'Logout': return 'warning';
      case 'Delete': return 'danger';
      case 'Edit': return 'default';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Audit Logs" description="Track user activities and system changes." />
      
      <div className="relative w-full max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <GlassInput placeholder="Search logs..." className="pl-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Module</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-8">Loading logs...</td></tr>
          ) : paginatedData.length === 0 ? (
            <tr><td colSpan={5} className="text-center py-8">No audit logs found.</td></tr>
          ) : (
            paginatedData.map(l => (
              <tr key={l.id}>
                <td className="text-xs whitespace-nowrap">{new Date(l.createdAt || Date.now()).toLocaleString()}</td>
                <td className="font-semibold text-primary-500">{l.userName}</td>
                <td>
                  <div className="flex items-center gap-2">
                    {getActionIcon(l.action)}
                    <GlassBadge variant={getActionColor(l.action)}>{l.action}</GlassBadge>
                  </div>
                </td>
                <td className="font-mono text-sm">{l.module}</td>
                <td className="text-sm max-w-xs truncate" title={l.details}>{l.details}</td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
