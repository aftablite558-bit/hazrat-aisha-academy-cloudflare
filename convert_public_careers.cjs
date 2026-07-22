const fs = require('fs');
let file = 'src/pages/public/Careers.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes("import { GlassModal } from '../../components/common/GlassModal';")) {
  c = c.replace("import { GlassButton } from '../../components/common/GlassButton';", "import { GlassButton } from '../../components/common/GlassButton';\nimport { GlassModal } from '../../components/common/GlassModal';");
}

const oldModalStart = `      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-foreground">Apply for {selectedJob.jobTitle}</h2>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">`;

const newModalStart = `      {/* Application Modal */}
      <GlassModal 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        title={\`Apply for \${selectedJob?.jobTitle}\`}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">`;

c = c.replace(oldModalStart, newModalStart);

const oldModalEnd = `              <GlassButton 
                type="submit" 
                className="w-full" 
                isLoading={loading}
              >
                Submit Application
              </GlassButton>
            </form>
          </motion.div>
        </div>
      )}`;
const newModalEnd = `              <GlassButton 
                type="submit" 
                className="w-full" 
                isLoading={loading}
              >
                Submit Application
              </GlassButton>
        </form>
      </GlassModal>`;
c = c.replace(oldModalEnd, newModalEnd);

fs.writeFileSync(file, c);
