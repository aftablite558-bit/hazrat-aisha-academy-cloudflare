const fs = require('fs');
let file = 'src/pages/dashboard/content/CareerRequests.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldImport = "import { GlassInput } from '../../../components/common/GlassInput';";
const newImport = "import { GlassInput } from '../../../components/common/GlassInput';\nimport { GlassTextarea } from '../../../components/common/GlassTextarea';";
c = c.replace(oldImport, newImport);

const oldNotesBlock = "              <div className=\"space-y-3 pt-6 border-t border-white/10\">\n                <h4 className=\"font-semibold text-foreground\">Update Status</h4>";
const newNotesBlock = `              <div className="space-y-3 pt-6 border-t border-white/10">
                <h4 className="font-semibold text-foreground">Internal Notes</h4>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <GlassTextarea 
                      placeholder="Add private notes about this applicant..."
                      value={selectedApp.notes || ''}
                      onChange={(e) => setSelectedApp(prev => prev ? { ...prev, notes: e.target.value } : null)}
                      rows={2}
                    />
                  </div>
                  <GlassButton 
                    className="px-4 py-2 h-[42px]" 
                    variant="ghost" 
                    onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.status, selectedApp.notes)}
                  >
                    Save Note
                  </GlassButton>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-white/10">
                <h4 className="font-semibold text-foreground">Update Status</h4>`;

c = c.replace(oldNotesBlock, newNotesBlock);

// Also update handleUpdateStatus signature
const oldHandleUpdate = "const handleUpdateStatus = async (appId: string, newStatus: CareerApplication['status']) => {";
const newHandleUpdate = "const handleUpdateStatus = async (appId: string, newStatus: CareerApplication['status'], notes?: string) => {";
c = c.replace(oldHandleUpdate, newHandleUpdate);

// Also update the fields sent to updateRecord
const oldUpdateCall = "await updateRecord(appId, { \n        status: newStatus,\n        decisionDate: (newStatus === 'Accepted' || newStatus === 'Rejected') ? new Date().toISOString() : undefined,\n        decisionBy: (newStatus === 'Accepted' || newStatus === 'Rejected') ? profile?.displayName : undefined\n      });";
const newUpdateCall = "await updateRecord(appId, { \n        status: newStatus,\n        notes: notes !== undefined ? notes : selectedApp?.notes,\n        decisionDate: (newStatus === 'Accepted' || newStatus === 'Rejected') ? new Date().toISOString() : undefined,\n        decisionBy: (newStatus === 'Accepted' || newStatus === 'Rejected') ? profile?.displayName : undefined\n      });";
c = c.replace(oldUpdateCall, newUpdateCall);

fs.writeFileSync(file, c);
