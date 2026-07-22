const fs = require('fs');
let file = 'src/pages/dashboard/content/CareerRequests.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes("import { GlassModal } from '../../../components/common/GlassModal';")) {
  c = c.replace("import { GlassButton } from '../../../components/common/GlassButton';", "import { GlassButton } from '../../../components/common/GlassButton';\nimport { GlassModal } from '../../../components/common/GlassModal';");
}

const oldModalStart = `{selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-2xl shadow-2xl border border-white/20 dark:border-white/10"
          >
            <div className="sticky top-0 z-10 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">`;

const newModalStart = `      <GlassModal 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)} 
        title="Application Details" 
        className="max-w-2xl"
      >
        {selectedApp && (
          <div className="space-y-6">`;

c = c.replace(oldModalStart, newModalStart);

const oldModalEnd = `            </div>
          </motion.div>
        </div>
      )}`;
const newModalEnd = `          </div>
        )}
      </GlassModal>`;
c = c.replace(oldModalEnd, newModalEnd);

fs.writeFileSync(file, c);
