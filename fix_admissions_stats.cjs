const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/Admissions.tsx';
let c = fs.readFileSync(file, 'utf8');

const statsCode = `
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center">
          <p className="text-muted-foreground text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-500">{admissions.filter(a => a.status === 'Pending').length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center">
          <p className="text-muted-foreground text-sm">Approved</p>
          <p className="text-2xl font-bold text-emerald-500">{admissions.filter(a => a.status === 'Approved').length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center">
          <p className="text-muted-foreground text-sm">Rejected</p>
          <p className="text-2xl font-bold text-rose-500">{admissions.filter(a => a.status === 'Rejected').length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center">
          <p className="text-muted-foreground text-sm">Today's Applications</p>
          <p className="text-2xl font-bold text-primary-500">
            {admissions.filter(a => {
              const today = new Date().toISOString().split('T')[0];
              return a.createdAt?.startsWith(today);
            }).length}
          </p>
        </div>
      </div>
`;

c = c.replace(
  '<div className="flex flex-col sm:flex-row justify-between gap-4">',
  statsCode + '\n      <div className="flex flex-col sm:flex-row justify-between gap-4">'
);

fs.writeFileSync(file, c);
