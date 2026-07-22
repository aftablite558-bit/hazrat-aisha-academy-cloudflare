const fs = require('fs');
let file = 'src/pages/dashboard/content/CareerRequests.tsx';
let c = fs.readFileSync(file, 'utf8');

// Fix fullName -> displayName
c = c.replace(/decisionBy: \(newStatus === 'Accepted' \|\| newStatus === 'Rejected'\) \? profile\?\.fullName : undefined/, "decisionBy: (newStatus === 'Accepted' || newStatus === 'Rejected') ? profile?.displayName : undefined");

// Fix getStatusBadge variants
c = c.replace(/variant="info"/g, 'variant="primary"');
c = c.replace(/variant="secondary"/g, 'variant="default"');

// Fix GlassTable to use standard HTML table elements
const oldTableBlock = `<GlassTable
          data={filteredApps}
          columns={columns}
          loading={loading}
          emptyMessage="No applications found matching your criteria."
        />`;
const newTableBlock = `<GlassTable>
          <thead>
            <tr>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Applicant</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Position</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Experience</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Date</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Status</th>
              <th className="px-6 py-4 font-semibold text-secondary-foreground border-b border-white/10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : filteredApps.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No applications found matching your criteria.</td></tr>
            ) : (
              filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{app.applicantName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={12}/> {app.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary-600 dark:text-primary-400">{app.appliedPosition}</td>
                  <td className="px-6 py-4">{app.experience}</td>
                  <td className="px-6 py-4">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedApp(app)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-secondary-foreground transition-colors">
                        <Eye size={16} />
                      </button>
                      {app.resumeUrl && (
                        <button onClick={() => window.open(app.resumeUrl, '_blank')} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-primary-500 transition-colors">
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </GlassTable>`;

c = c.replace(oldTableBlock, newTableBlock);

// Remove columns declaration completely since it's not needed anymore
c = c.replace(/const columns = \[\s*\{[\s\S]*?\}\s*\];/m, ''); // Will fix with regex later or manually

// Fix ConfirmDialog
c = c.replace(/confirmLabel="Delete"/, 'confirmText="Delete"');
c = c.replace(/cancelLabel="Cancel"/, 'cancelText="Cancel"');
c = c.replace(/onCancel=\{/, 'onClose={');

// Fix action buttons size issues and variations
c = c.replace(/<GlassButton size="sm" variant=\{selectedApp.status === 'Pending' \? 'primary' : 'ghost'\}/g, '<GlassButton className="px-4 py-2" variant={selectedApp.status === \'Pending\' ? \'primary\' : \'ghost\'}');
c = c.replace(/<GlassButton size="sm" variant=\{selectedApp.status === 'Under Review' \? 'primary' : 'ghost'\}/g, '<GlassButton className="px-4 py-2" variant={selectedApp.status === \'Under Review\' ? \'primary\' : \'ghost\'}');
c = c.replace(/<GlassButton size="sm" variant=\{selectedApp.status === 'Shortlisted' \? 'primary' : 'ghost'\}/g, '<GlassButton className="px-4 py-2" variant={selectedApp.status === \'Shortlisted\' ? \'primary\' : \'ghost\'}');
c = c.replace(/variant="danger"/g, 'variant="ghost"');
c = c.replace(/variant="success"/g, 'variant="primary"');

fs.writeFileSync(file, c);
