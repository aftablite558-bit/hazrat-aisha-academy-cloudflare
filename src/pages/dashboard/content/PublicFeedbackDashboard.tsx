import { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { GlassCard } from '../../../components/common/GlassCard';
import { GlassTable } from '../../../components/common/GlassTable';
import { GlassBadge } from '../../../components/common/GlassBadge';
import { GlassModal } from '../../../components/common/GlassModal';
import { GlassSelect } from '../../../components/common/GlassSelect';
import { GlassTextarea } from '../../../components/common/GlassTextarea';
import { GlassButton } from '../../../components/common/GlassButton';
import { FeedbackTicket } from '../../../types/content';
import { Trash2, Eye, Save } from 'lucide-react';

export const PublicFeedbackDashboard = () => {
  const [tickets, setTickets] = useState<FeedbackTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<FeedbackTicket | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Resolved' | 'Rejected'>('Pending');

  useEffect(() => {
    // In a real app we'd fetch from useMasterData or an API. 
    // Here we read from localStorage for demonstration.
    const stored = JSON.parse(localStorage.getItem('feedback_tickets') || '[]');
    setTickets(stored);
  }, []);

  const saveToStorage = (updatedTickets: FeedbackTicket[]) => {
    localStorage.setItem('feedback_tickets', JSON.stringify(updatedTickets));
    setTickets(updatedTickets);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback ticket?')) {
      saveToStorage(tickets.filter(t => t.id !== id));
    }
  };

  const handleUpdate = () => {
    if (selectedTicket) {
      const updated = tickets.map(t => 
        t.id === selectedTicket.id ? { ...t, status, internalNotes } : t
      );
      saveToStorage(updated);
      setSelectedTicket(null);
    }
  };

  const openTicket = (ticket: FeedbackTicket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status);
    setInternalNotes(ticket.internalNotes || '');
  };

  const columns = [
    { header: 'Ticket ID', accessor: 'ticketId' as keyof FeedbackTicket },
    { header: 'Name', accessor: 'name' as keyof FeedbackTicket },
    { header: 'Category', accessor: 'category' as keyof FeedbackTicket, 
      cell: (row: FeedbackTicket) => <GlassBadge>{row.category}</GlassBadge> 
    },
    { header: 'Subject', accessor: 'subject' as keyof FeedbackTicket },
    { header: 'Submitted Date', accessor: 'submittedAt' as keyof FeedbackTicket,
      cell: (row: FeedbackTicket) => new Date(row.submittedAt).toLocaleDateString()
    },
    { header: 'Status', accessor: 'status' as keyof FeedbackTicket,
      cell: (row: FeedbackTicket) => {
        let variant: 'default' | 'success' | 'warning' | 'danger' = 'default';
        if (row.status === 'Resolved') variant = 'success';
        if (row.status === 'In Progress') variant = 'warning';
        if (row.status === 'Rejected') variant = 'danger';
        return <GlassBadge variant={variant}>{row.status}</GlassBadge>;
      }
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Public Feedback" description="Manage support tickets, complaints, and appreciation from the public." />

      <GlassCard className="p-6">
        <GlassTable
          data={tickets}
          columns={columns}
          actions={(row) => (
            <>
              <button onClick={() => openTicket(row)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-primary-500" title="View Details">
                <Eye size={18} />
              </button>
              <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-rose-500" title="Delete">
                <Trash2 size={18} />
              </button>
            </>
          )}
          emptyMessage="No feedback tickets found."
        />
      </GlassCard>

      <GlassModal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket Details: ${selectedTicket?.ticketId}`} size="lg">
        {selectedTicket && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Name:</span>
                <span className="font-semibold">{selectedTicket.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Mobile:</span>
                <span className="font-semibold">{selectedTicket.mobile}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Email:</span>
                <span className="font-semibold">{selectedTicket.email || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Category:</span>
                <span className="font-semibold">{selectedTicket.category}</span>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground text-sm block mb-1">Subject:</span>
              <p className="font-semibold text-lg">{selectedTicket.subject}</p>
            </div>

            <div>
              <span className="text-muted-foreground text-sm block mb-2">Description:</span>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm whitespace-pre-wrap">
                {selectedTicket.description}
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 space-y-4">
              <h3 className="font-bold text-lg">Admin Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassSelect 
                  label="Update Status"
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  options={[
                    { label: 'Pending', value: 'Pending' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Resolved', value: 'Resolved' },
                    { label: 'Rejected', value: 'Rejected' }
                  ]}
                />
              </div>

              <GlassTextarea 
                label="Internal Notes"
                placeholder="Add private notes (not visible to public)"
                value={internalNotes}
                onChange={e => setInternalNotes(e.target.value)}
                rows={3}
              />

              <div className="flex justify-end gap-3 pt-2">
                <GlassButton variant="outline" onClick={() => setSelectedTicket(null)}>Cancel</GlassButton>
                <GlassButton variant="primary" onClick={handleUpdate} className="flex items-center gap-2">
                  <Save size={16} /> Save Changes
                </GlassButton>
              </div>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  );
};
