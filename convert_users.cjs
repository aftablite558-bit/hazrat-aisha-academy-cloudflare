const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/Users.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes("import { GlassModal } from '../../../components/common/GlassModal';")) {
  c = c.replace("import { GlassCard } from '../../../components/common/GlassCard';", "import { GlassCard } from '../../../components/common/GlassCard';\nimport { GlassModal } from '../../../components/common/GlassModal';");
}

const oldUserModal = `      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 border border-white/20 shadow-2xl relative">
            <button 
              onClick={() => !submitting && setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              disabled={submitting}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <UsersIcon className="text-primary-500" /> {editingUserId ? 'Edit User' : 'Add New User'}
            </h2>

            <form onSubmit={handleSubmitUser} className="space-y-4">`;

const newUserModal = `      {/* Add/Edit User Modal */}
      <GlassModal
        isOpen={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingUserId ? 'Edit User' : 'Add New User'}
        className="max-w-md"
      >
        <form onSubmit={handleSubmitUser} className="space-y-4">`;
c = c.replace(oldUserModal, newUserModal);

const oldUserModalEnd = `                <GlassButton type="submit" variant="primary" className="w-1/2 flex justify-center items-center gap-2" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save User'}
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}`;
const newUserModalEnd = `                <GlassButton type="submit" variant="primary" className="w-1/2 flex justify-center items-center gap-2" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save User'}
                </GlassButton>
              </div>
        </form>
      </GlassModal>`;
c = c.replace(oldUserModalEnd, newUserModalEnd);


const oldPassModal = `      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 border border-white/20 shadow-2xl relative">
            <button 
              onClick={() => !submitting && setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              disabled={submitting}
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Key className="text-primary-500" /> Reset Password
            </h2>

            <form onSubmit={handleResetPassword} className="space-y-4">`;
const newPassModal = `      {/* Reset Password Modal */}
      <GlassModal
        isOpen={showPasswordModal}
        onClose={() => !submitting && setShowPasswordModal(false)}
        title="Reset Password"
        className="max-w-md"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">`;
c = c.replace(oldPassModal, newPassModal);

const oldPassModalEnd = `                <GlassButton type="submit" variant="primary" className="w-1/2 flex justify-center items-center gap-2" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Reset Password'}
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}`;
const newPassModalEnd = `                <GlassButton type="submit" variant="primary" className="w-1/2 flex justify-center items-center gap-2" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Reset Password'}
                </GlassButton>
              </div>
        </form>
      </GlassModal>`;
c = c.replace(oldPassModalEnd, newPassModalEnd);

fs.writeFileSync(file, c);
